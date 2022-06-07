import execa from 'execa';

export default async function restore(sqlDumpAsString: string) {
  const bla = `
    HEY
    WHATS
    WRONG
  `;

  try {
    
    const { stdout } = await execa('echo', [bla]);
    console.log('stdout', stdout);
  } catch (error) {
    console.log('error: ', error);
  }

  // await execa('docker-compose',
  //   [
  //     '-f', '../../demo-server/docker-compose.yml', 'exec', '-T', 'db',
  //     'pg_restore', '-c', '--no-acl', '-U', 'postgres', 'mydb', '|', sqlDumpAsString
  //   ],
  //   {cwd: __dirname}
  // );

}
