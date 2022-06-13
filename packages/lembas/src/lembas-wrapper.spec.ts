/* eslint-disable @typescript-eslint/no-explicit-any */
import { LembasWrapperOptions, lembasWrapper, LEMBAS_SEPARATOR } from './lembas-wrapper';
import { writeFile, readFile } from 'fs/promises';
import { callLembasWrapper } from './test-utils/fake.smoke.setup';
import { otherNameLembasWrapper } from './test-utils/fake.other.name';
import * as fs from 'fs';
import * as path from 'path';
import { setFakeRawDbData } from './test-utils/lembas-hooks/fake-snapshot-hook';
import { getFakeRawDbData } from './test-utils/lembas-hooks/fake-restore-hook';
import * as lembasConfig from './config';

jest.mock('fs');
jest.mock('fs/promises');

describe(`lembasWrapper`, () => {
  function setup() {
    //
    const lembasWrapperOptions: LembasWrapperOptions = {
      // This is so that most of the tests will not fail
      // on "not run via a setup file" error
      setupFilePattern: 'wrapper.spec',
    };

    const getLembasConfigSpy = jest
      .spyOn(lembasConfig, 'getLembasConfig')
      .mockImplementation();

    const fakeObjects = {
      fake: 'data',
    };

    const FAKE_RAW_DB_DATA = `
FAKE
RAW
DATA
`;

    return {
      fakeObjects,
      lembasWrapperOptions,
      getLembasConfigSpy,
      FAKE_RAW_DB_DATA,
    };
  }

  describe(`cache filename configuration`, () => {
    //

    given('data does not exist in cache', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      when('calling lembasWrapper via a smoke setup file', async () => {
        await callLembasWrapper(async () => 'fake');

        then(
          'cache file name should contain the same setup file name that was calling lembas ',
          () => {
            const expectedCacheFileName = getNormalizedFullPathFor(
              'test-utils/fake.smoke.setup.lembas'
            );

            expect(writeFile).toHaveBeenCalledWith(
              expect.stringContaining(expectedCacheFileName),
              expect.any(String)
            );
          }
        );
      });
    });

    given(
      `data does not exist in cache 
       AND "setupFilePattern" option set to "other.name"`,
      () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const fakeOptions: LembasWrapperOptions = {
          setupFilePattern: 'other.name',
        };

        when('calling lembasWrapper via "other name" setup file ', async () => {
          await otherNameLembasWrapper(async () => 'fake', fakeOptions);

          then(
            'cache file name should contain the same setup file name that was calling lembas ',
            () => {
              const expectedCacheFileName = getNormalizedFullPathFor(
                'test-utils/fake.other.name.lembas'
              );

              expect(writeFile).toHaveBeenCalledWith(
                expect.stringContaining(expectedCacheFileName),
                expect.any(String)
              );
            }
          );
        });
      }
    );

    given(
      `data does not exist in cache 
       AND "setupFilePattern" option set to a non matched file`,
      () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        const fakeOptions: LembasWrapperOptions = {
          setupFilePattern: 'does.not.exist',
        };

        when('calling lembasWrapper ', async () => {
          let actualError: Error;
          try {
            await lembasWrapper(async () => 'fake', fakeOptions);
          } catch (error: any) {
            actualError = error;
          }
          then('an error should be thrown', () => {
            expect(actualError.message).toContain('You must call "lembasWrapper"');
          });
        });
      }
    );
  });

  describe(`writing to cache`, () => {
    //
    given(
      `lembas file does NOT exist
       AND config is configured to return fake snapshot hook
       AND snapshot is configured to return fake raw data`,
      () => {
        const {
          fakeObjects,
          lembasWrapperOptions,
          getLembasConfigSpy,
          FAKE_RAW_DB_DATA,
        } = setup();

        (fs.existsSync as jest.Mock).mockReturnValue(false);

        setFakeRawDbData(FAKE_RAW_DB_DATA);

        getLembasConfigSpy.mockResolvedValue({
          snapshotHook: './test-utils/lembas-hooks/fake-snapshot-hook.ts',
        });

        when('wrapping the data generator with lembas', async () => {
          const actualResult = await lembasWrapper(
            async () => fakeObjects,
            lembasWrapperOptions
          );

          then(
            `actual result should be the same value from the callback
             AND results should be cached`,
            () => {
              const fakeDataObjectsJson = JSON.stringify(fakeObjects);

              const expectedCacheFileContent = `
${fakeDataObjectsJson}

${LEMBAS_SEPARATOR}

${FAKE_RAW_DB_DATA}
`;
              expect(actualResult).toEqual(fakeObjects);
              expect(writeFile).toHaveBeenCalledWith(
                expect.any(String),
                expectedCacheFileContent
              );
            }
          );
        });
      }
    );

    given(
      `lembas file does NOT exist
       AND config is configured to return fake snapshot hook 
       AND the snapshot hook is NOT returning a default exported function`,
      () => {
        const { lembasWrapperOptions, getLembasConfigSpy } = setup();

        (fs.existsSync as jest.Mock).mockReturnValue(false);

        getLembasConfigSpy.mockResolvedValue({
          snapshotHook: './test-utils/lembas-hooks/fake-bad-snapshot-hook.ts',
        });

        when('wrapping the data generator with lembas', async () => {
          let actualError: Error;
          try {
            await lembasWrapper(async () => {}, lembasWrapperOptions);
          } catch (error: any) {
            actualError = error;
          }
          then(`should throw an error about having a default exported function`, () => {
            expect(actualError.message).toContain(
              'Snapshot hook should return a **default** function.'
            );
          });
        });
      }
    );
  });

  describe(`reading from cache`, () => {
    given(
      `
      lembas file DOES exist
      AND config is configured to return a fake restore hook`,
      () => {
        //
        const {
          fakeObjects,
          lembasWrapperOptions,
          getLembasConfigSpy,
          FAKE_RAW_DB_DATA,
        } = setup();

        (fs.existsSync as jest.Mock).mockReturnValue(true);

        const fakeDataObjectsJson = JSON.stringify(fakeObjects);

        const fakeLembasContent = `

${fakeDataObjectsJson}

${LEMBAS_SEPARATOR}

${FAKE_RAW_DB_DATA}

`;

        (readFile as jest.Mock).mockResolvedValue(fakeLembasContent);

        getLembasConfigSpy.mockResolvedValue({
          restoreHook: './test-utils/lembas-hooks/fake-restore-hook.ts',
        });

        when('wrapping data generator with lembasWrapper', async () => {
          const actualResult = await lembasWrapper(async () => {}, lembasWrapperOptions);

          then(
            `
          actualResult should come from the cache
          AND restore hook should be called with the right raw db dump
          `,
            () => {
              const actualFakeRawDbData = getFakeRawDbData();
              expect(actualResult).toEqual(fakeObjects);
              expect(actualFakeRawDbData.trim()).toEqual(FAKE_RAW_DB_DATA.trim());
            }
          );
        });
      }
    );

    given(
      `lembas file DOES exist
       AND config is configured to return fake restore hook 
       AND the restore hook is NOT returning a default exported function`,
      () => {
        const {
          fakeObjects,
          lembasWrapperOptions,
          getLembasConfigSpy,
          FAKE_RAW_DB_DATA,
        } = setup();

        (fs.existsSync as jest.Mock).mockReturnValue(true);

        const fakeDataObjectsJson = JSON.stringify(fakeObjects);

        const fakeLembasContent = `
${fakeDataObjectsJson}

${LEMBAS_SEPARATOR}

${FAKE_RAW_DB_DATA}
`;
        (readFile as jest.Mock).mockResolvedValue(fakeLembasContent);

        getLembasConfigSpy.mockResolvedValue({
          restoreHook: './test-utils/lembas-hooks/fake-bad-restore-hook.ts',
        });

        when('wrapping the data generator with lembas', async () => {
          let actualError: Error;
          try {
            await lembasWrapper(async () => {}, lembasWrapperOptions);
          } catch (error: any) {
            actualError = error;
          }
          then(`should throw an error about having a default exported function`, () => {
            expect(actualError.message).toContain(
              'Restore hook should return a **default** function.'
            );
          });
        });
      }
    );
  });
});

function getNormalizedFullPathFor(filePath: string) {
  return path.normalize(`packages/lembas/src/${filePath}`);
}
