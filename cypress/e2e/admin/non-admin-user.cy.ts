import authPo from '../../support/auth.po';

describe(`Non-Admin user accessing the Super Admin`, () => {
  it('should redirect the user away', () => {
    cy.signIn('/', {
      email: 'test2@makerkit.dev',
      password: authPo.getDefaultUserPassword(),
    });

    cy.visit('/admin', {
      failOnStatusCode: false,
    });

    // verify that the user is redirected to the 404 page
    cy.cyGet('catch-route-status-code').should('contain', '404');
  });
});
