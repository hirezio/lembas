import { lembasWrapper } from '../lembas-wrapper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function callLembasWrapper(fn: any) {
  return lembasWrapper(fn);
}
