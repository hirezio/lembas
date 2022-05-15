import { writeFile, readFile } from 'fs/promises';
import * as fs from 'fs';

export async function loadOrGenerate<T = any>(
  fileName: string,
  generateFakeDataFn: (...args: any[]) => Promise<T>
): Promise<T> {
  const { cachedFakeData, saveCache } = await loadFromCache(fileName);

  if (cachedFakeData) {
    return cachedFakeData;
  }

  const generatedData = await generateFakeDataFn();

  await saveCache(generatedData);

  return generatedData;
}

export async function loadFromCache(filename: string) {
  const setupFilePath = filename.substring(0, filename.lastIndexOf('.'));
  const cacheFilePath = setupFilePath + '.cache.json';

  let cachedFakeData;

  if (fs.existsSync(cacheFilePath)) {
    const cacheFileContentString = await readFile(cacheFilePath, { encoding: 'utf8' });
    const cacheFileContent = JSON.parse(cacheFileContentString);
    // override

    // await writeFile(DATABASE_LOCATION, JSON.stringify(cacheFileContent.dump));
    // TODO: RUN "POPULATE" HOOK

    cachedFakeData = cacheFileContent.objects;
  }

  async function saveCache(fakeData: any) {
    let cacheFileContent = {
      objects: fakeData,
      dump: undefined,
    };

    // TODO: RUN DUMP HOOK

    // SAVE DUMP
    // if (fs.existsSync(DATABASE_LOCATION)) {
    //   const dbFileContent = await readFile(DATABASE_LOCATION, { encoding: 'utf8' });
    //   dataFileContent.dump = JSON.parse(dbFileContent);
    // }

    // SAVE CACHE
    await writeFile(cacheFilePath, JSON.stringify(cacheFileContent));
  }

  return {
    cachedFakeData,
    saveCache,
  };
}

export async function emptyDb() {
  // RUN EMPTY HOOK
  // await overrideFile('db/empty-db-for-e2e.json', DATABASE_LOCATION);
}

export async function overrideFile(source: string, target: string) {
  try {
    const sourceContent = await readFile(source, { encoding: 'utf8' });
    await writeFile(target, sourceContent);
  } catch (error) {
    console.log('There was an error while trying to copy the file: ', error);
  }
}
