import * as execa from 'execa';
import * as path from 'path';
import { writeFile, unlink } from 'fs/promises';

export default async function restore(sqlDumpAsString: string) {

  const TEMP_FILENAME = 'tmp_dump';
  const TEMP_FILE_LOCATION = path.join(__dirname, './' + TEMP_FILENAME);
  const CONTAINER_FOLDER = '/opt/';

  await writeFile(TEMP_FILE_LOCATION, sqlDumpAsString);

  try {
    
    await execa('docker',
      [
        'compose', 'cp', TEMP_FILE_LOCATION, `db:${CONTAINER_FOLDER}`
      ],
      {cwd: path.resolve( __dirname, '../../demo-server')}
    );

    console.log('COPIED');
    
    
    await execa('docker-compose',
      [
        '-f', '../../demo-server/docker-compose.yml', 'exec', '-T', 'db',
        'psql', '-U', 'postgres', '-d', 'mydb', '-f', `${CONTAINER_FOLDER}${TEMP_FILENAME}`
      ],
      {cwd: __dirname}
    );

    console.log('RESTORED');
    await unlink(TEMP_FILE_LOCATION);
    
  } catch (error) {
    await unlink(TEMP_FILE_LOCATION);
    throw error;
  }
  

}
