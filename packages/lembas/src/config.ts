import * as lembasConfig from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import * as callsites from 'callsites';


export interface LembasConfig {
  emptyHook?: string;
  restoreHook?: string;
  snapshotHook?: string;
}

const LEMBAS_CONFIG_FILENAME = `lembas.json`;
let configsMap: {
  [key: string]: LembasConfig;
} = {};

export async function getLembasConfig(): Promise<LembasConfig> {
  
  let currentRoot = getCurrentRunningFileRoot();

  if (configsMap[currentRoot]) {
    return configsMap[currentRoot];
  }

  const lembasJsonRoot = findLembasRoot(currentRoot);

  if (!lembasJsonRoot) {
    return {};
  }
  
  let config = await readConfigByJsonRoot(lembasJsonRoot);
  config = decorateHooksWithFullPath(config, lembasJsonRoot);
  
  configsMap[currentRoot] = config;
  return config;
}

function decorateHooksWithFullPath(config: LembasConfig, lembasJsonRoot: string): LembasConfig{
  /* istanbul ignore next */
  if (!config) {
    return config;
  }
  const newConfig = { ...config };
  if (newConfig.emptyHook) {
    newConfig.emptyHook = path.join(lembasJsonRoot, newConfig.emptyHook);
  }
  if (newConfig.restoreHook) {
    newConfig.restoreHook = path.join(lembasJsonRoot, newConfig.restoreHook);
  }
  if (newConfig.snapshotHook) {
    newConfig.snapshotHook = path.join(lembasJsonRoot, newConfig.snapshotHook);
  }
  return newConfig;
}

async function readConfigByJsonRoot(lembasJsonRoot: string) {
  const lembasConfigPath = lembasConfig.resolve(lembasJsonRoot, LEMBAS_CONFIG_FILENAME);
  
  const rawConfig = await readFile(lembasConfigPath, { encoding: 'utf8' });
  return JSON.parse(rawConfig);
}

function getCurrentRunningFileRoot() {
  const callSitesSnapshot = callsites();
  let projectRoot = process.cwd();
  

  const foundStartDirCallSite = callSitesSnapshot.find(callsite => {
    const filename = callsite.getFileName();
    /* istanbul ignore next */
    return filename?.includes(projectRoot);
  });

  if (foundStartDirCallSite) {
    const startDirFileName = foundStartDirCallSite.getFileName();
    if (startDirFileName) {
      projectRoot = path.dirname(startDirFileName);
    }
  }
  return projectRoot;
}

export function findLembasRoot(dir: string): string | null {
    
  if (existsSync(path.join(dir, LEMBAS_CONFIG_FILENAME))) {
    return dir;
  }

  if (path.dirname(dir) === dir) {
    return null;
  }

  return findLembasRoot(path.dirname(dir));
}
