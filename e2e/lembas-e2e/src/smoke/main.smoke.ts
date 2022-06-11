import { SETUP_DATA } from '@hirez_io/lembas-cypress';
import { MainSetupData } from './main.smoke.setup';

describe('main', () => {
  it('should do something', () => {
    cy.task<MainSetupData>(SETUP_DATA, 'src/smoke/main.smoke.setup').then(({ posts }) => {
      cy.visit('/');

      cy.getByTestId(`post-${posts[2].id}`).should(
        'contain',
        posts[1].title + ' ' + posts[0].title
      );

      cy.readFile('src/smoke/main.smoke.setup.lembas');
      cy.readFile('src/smoke/minimum.smoke.setup.lembas');
    });
  });
});
