import { lembasCypress } from './lembas-cypress';

describe('lembasCypress', () => {
  it('should work', () => {
    expect(lembasCypress()).toEqual('lembas-cypress');
  });
});
