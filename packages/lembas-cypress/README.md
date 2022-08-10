# lembas-cypress

A cypress plugin to run lembas setup files as a task.

## Usage

In your `plugins/index.ts` add the following:

```
import { setupDataTask } from '@hirez_io/lembas-cypress';

export default (on, config) => {
  on('task', setupDataTask);
  
};

```

Then in your tests you can call the task like this:

```
import { SETUP_DATA } from '@hirez_io/lembas-cypress';
import { MainSetupData } from './main.smoke.setup';

describe('main smoke test', () => {

  it('should do something', () => {

    cy.task<MainSetupData>(SETUP_DATA, 'src/smoke/main.smoke.setup').then(data) => {

      cy.visit('/');

      // ... do something with the data ...
      
    });
  });
});


```