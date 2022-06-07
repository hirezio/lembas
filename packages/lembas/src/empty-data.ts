import { getLembasConfig } from './config';

let emptyDataFn: () => Promise<void>;

export async function emptyData() {
  if (!emptyDataFn) { 
    emptyDataFn = await getEmptyDataFn();
  }
  try {
    await emptyDataFn();
  } catch (error) {
    throw new Error(`
      Error was thrown while trying to empty the DB

      Original Error:
      ${error}
    `);
    
  }
}

async function getEmptyDataFn() {
  const config = await getLembasConfig();
  if (config.emptyHook) {
    const emptyFn = await import(config.emptyHook);
    return emptyFn.default;
  }
  return function noop() {};
}