import * as execa from 'execa';

export default async function() {
  
  await execa('prisma',
    ['migrate', 'reset', '--force', '--schema', '../../../prisma/schema.prisma'],
    {cwd: __dirname}
  );
  
}