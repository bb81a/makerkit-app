describe(`Manage Organizations`, () => {
  beforeEach(() => {
    cy.signIn('/admin/organizations');
  });

  it('should be able to visit the admin users page', () => {
    cy.cyGet('admin-organizations-table')
      .find('tr')
      .should('have.lengthOf.at.least', 1);
  });

  describe('when clicking on the members count', () => {
    it('should visit the members page', () => {
      cy.cyGet('organization-members-link').eq(0).click();

      cy.cyGet('admin-organization-members-table')
        .find('tr')
        .should('have.lengthOf.at.least', 1);
    });
  });
});
