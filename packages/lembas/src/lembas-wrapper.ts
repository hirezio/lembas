import { writeFile, readFile } from 'fs/promises';
import * as fs from 'fs';
import { getLembasConfig, LembasConfig } from './config';
import * as callsites from 'callsites';

export const LEMBAS_SEPARATOR = '===LEMBAS===LEMBAS===LEMBAS===';

export interface LembasWrapperOptions {
  setupFilePattern?: string;
}

export async function lembasWrapper<T = unknown>(
  generateDataFn: () => Promise<T>,
  options?: LembasWrapperOptions
): Promise<T> {
  const lembasFileName = getLembasFileName(options?.setupFilePattern);

  const config = await getLembasConfig();

  const cachedData = await loadLembas<T>(lembasFileName, config);

  if (cachedData) {
    return cachedData;
  }

  const generatedData = await generateDataFn();

  await saveLembas(lembasFileName, generatedData, config);

  return generatedData;
}

function getLembasFileName(setupFilePattern?: string): string {
  const defaultSetupFilePatten = '.smoke.setup';
  const selectedSetupFilePattern = setupFilePattern || defaultSetupFilePatten;

  const callSitesSnapshot = callsites();

  const foundCallsite = callSitesSnapshot.find((callsite) => {
    const filename = callsite.getFileName();
    return filename && filename.includes(selectedSetupFilePattern);
  });

  const setupFileName = foundCallsite?.getFileName();

  if (!setupFileName) {
    throw new Error(`
    You must call "lembasWrapper" from a setup file with a matched pattern.
    The default filename pattern (part of the filename) is ${defaultSetupFilePatten}
    Lembas uses the setup filename to generate the cache file
    `);
  }

  const setupFilePath = setupFileName.substring(0, setupFileName.lastIndexOf('.'));
  const lembasFileName = setupFilePath + '.lembas';

  return lembasFileName;
}

async function loadLembas<T>(
  lembasFilename: string,
  config: LembasConfig
): Promise<T | undefined> {
  let cachedDataObjects: T | undefined;

  if (fs.existsSync(lembasFilename)) {
    const lembasFileContent = await readFile(lembasFilename, { encoding: 'utf8' });

    const separatorPosition = lembasFileContent.indexOf(LEMBAS_SEPARATOR);
    const rawDataStartPosition = separatorPosition + LEMBAS_SEPARATOR.length;

    const dataJson = lembasFileContent.substring(0, separatorPosition);
    cachedDataObjects = JSON.parse(dataJson);

    const rawDbDump = lembasFileContent.substring(
      rawDataStartPosition,
      lembasFileContent.length
    );

    await restoreDbSnapshot(config, rawDbDump);
  }
  return cachedDataObjects;
}

async function saveLembas<T>(
  lembasFilename: string,
  dataToCache: T,
  config: LembasConfig
): Promise<void> {
  const dataToCacheAsJson = JSON.stringify(dataToCache);
  const rawDbDump = await takeDbSnapshot(config);

  const lembasContent: string = `
${dataToCacheAsJson}

${LEMBAS_SEPARATOR}

${rawDbDump}
`;

  await writeFile(lembasFilename, lembasContent);
}

async function takeDbSnapshot(config: LembasConfig): Promise<string | undefined> {
  if (config.snapshotHook) {
    const snapshotHook = await import(config.snapshotHook);
    if (!snapshotHook.default || typeof snapshotHook.default !== 'function') {
      throw new Error(`
        Snapshot hook should return a **default** function.
        You're probably missing the "default" keyword after your "export".
      `);
    }
    return snapshotHook.default();
  }
  return;
}

async function restoreDbSnapshot(config: LembasConfig, rawDbDump: string) {
  if (config.restoreHook) {
    const restoreHook = await import(config.restoreHook);
    if (!restoreHook.default || typeof restoreHook.default !== 'function') {
      throw new Error(`
        Restore hook should return a **default** function.
        You're probably missing the "default" keyword after your "export".
      `);
    }
    await restoreHook.default(rawDbDump);
  }
}
