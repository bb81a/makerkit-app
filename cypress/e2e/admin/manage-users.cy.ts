describe(`Manage Users`, () => {
  it('should be able to visit the admin users page', () => {
    cy.signIn('/admin/users');

    cy.cyGet('admin-users-table')
      .find('tr')
      .should('have.lengthOf.at.least', 1);
  });
});
