import * as execa from 'execa';

export default async function snapshot() {


  const { stdout: sqlDumpAsString } = await execa('docker-compose',
    ['-f', '../../demo-server/docker-compose.yml', 'exec', '-T', 'db', 'pg_dump', '-U', 'postgres', 'mydb'],
    {cwd: __dirname}
  );
  return sqlDumpAsString;  

  
}