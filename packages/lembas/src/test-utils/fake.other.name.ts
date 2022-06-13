import { lembasWrapper, LembasWrapperOptions } from '../lembas-wrapper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function otherNameLembasWrapper(fn: any, options?: LembasWrapperOptions) {
  return lembasWrapper(fn, options);
}
