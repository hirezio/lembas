import { lembasWrapper, LembasWrapperOptions } from '../lembas-wrapper';

export function otherNameLembasWrapper(fn: any, options?: LembasWrapperOptions){
  return lembasWrapper(fn, options);
}