import { SETUP_DATA } from '@hirez_io/lembas-cypress';

describe('main', () => {
  it('should do something', () => {
    cy.task(SETUP_DATA, 'src/smoke/main.smoke.setup').then((data) => {
      console.log('data', data);
      cy.visit('/');
      expect(true).equal(true);
    });
  });
});
