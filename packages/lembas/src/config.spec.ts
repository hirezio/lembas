import { getLembasConfig } from './config';
import * as fs from 'fs';
import * as path from 'path';

describe(`getLembasConfig`, () => {

  given('fake lembas.json on the file system', () => {
    
    when('calling getLembasConfig', async () => {
      const actualResult = await getLembasConfig();
      then('config should be the same as on the file system with hooks containing the full path', () => {
        expect(actualResult.emptyHook).toContain(path.normalize('/packages/lembas/fake'));
        expect(actualResult.restoreHook).toContain(path.normalize('/packages/lembas/fake'));
        expect(actualResult.snapshotHook).toContain(path.normalize('/packages/lembas/fake'));
      });
    });
  });

  given('getLembasConfig already been called once', async () => {
    await getLembasConfig();
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation();

    when('calling getLembasConfig again', async () => {
      const actualResult = await getLembasConfig();
      then('config should be the same as on the file system', () => {
        
        expect(existsSyncSpy).not.toHaveBeenCalled();
      });
    });
  });
  
  
});