import * as execa from 'execa';
import { writeFile, unlink } from 'fs/promises';

export default async function restore(sqlDumpAsString: string) {
  // const bla = `
  //   HEY
  //   WHATS
  //   WRONG
  // `;

  // try {
    
  //   const { stdout } = await execa('echo', [bla]);
  //   console.log('stdout', stdout);
  // } catch (error) {
  //   console.log('error: ', error);
  // }

  const TEMP_FILE = './tmp_dump';
  await writeFile(TEMP_FILE, sqlDumpAsString);

  try {
    
    await execa('docker-compose',
      [
        '-f', '../../demo-server/docker-compose.yml', 'exec', '-T', 'db',
        'pg_restore', '-c', '--no-acl', '-U', 'postgres', 'mydb', '<', TEMP_FILE
      ],
      {cwd: __dirname}
    );
    await unlink(TEMP_FILE);
    
  } catch (error) {
    await unlink(TEMP_FILE);
    throw error;
  }
  

}
