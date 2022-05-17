import * as path from 'path';

export const SETUP_DATA = 'setupData';

export const setupDataTask: any = {};

setupDataTask[SETUP_DATA] = async function setupData(filePathToLoad: string) {
  const fullPath = path.resolve(process.cwd(), filePathToLoad);
  const setup = await import(fullPath);

  return setup.default();
};
