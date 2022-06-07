import { SETUP_DATA } from '@hirez_io/lembas-cypress';
import { MainSetupData } from './main.smoke.setup';

describe('main', () => {
  it('should do something', () => {
    cy.task<MainSetupData>(SETUP_DATA, 'src/smoke/main.smoke.setup').then(({posts}) => {
      
      cy.visit('/');

      cy.getByTestId(`post-${posts[0].id}`).should('contain', posts[0].title);
      
    });
  });
});
