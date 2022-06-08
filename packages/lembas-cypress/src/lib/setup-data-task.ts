import * as path from 'path';
import { existsSync } from 'fs';

export const SETUP_DATA = 'setupData';
const LEMBAS_CONFIG_FILENAME = `lembas.json`;

export const setupDataTask: any = {};

setupDataTask[SETUP_DATA] = async function setupData(filePathToLoad: string) {
  const lembasRoot = findLembasRoot(process.cwd());
  const fullPath = path.resolve(lembasRoot, filePathToLoad);
  const setup = await import(fullPath);

  return setup.default();
};

export function findLembasRoot(dir: string): string {
  if (existsSync(path.join(dir, LEMBAS_CONFIG_FILENAME))) {
    return dir;
  }

  if (path.dirname(dir) === dir) {
    throw new Error(
      `There must be a ${LEMBAS_CONFIG_FILENAME} present in the root of the workspace / project`
    );
  }

  return findLembasRoot(path.dirname(dir));
}
