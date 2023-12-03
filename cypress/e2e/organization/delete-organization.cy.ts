import organizationPageObject from '../../support/organization.po';

describe(`Delete Organization`, () => {
  describe(`When the user is an owner`, () => {
    it(`should be able to delete the organization`, () => {
      const path = `/dashboard/${organizationPageObject.getDefaultOrganizationId()}`;
      cy.signIn(path);

      const orgName = `Org ${Math.random()}`;
      organizationPageObject.createOrganization(orgName);

      cy.contains('Settings').click();
      cy.contains('Organization').click();

      organizationPageObject.$getDeleteOrganizationButton().click();
      organizationPageObject
        .$getDeleteOrganizationConfirmationInput()
        .type(orgName);

      organizationPageObject
        .$getConfirmDeleteOrganizationButton()
        .wait(100)
        .click();

      cy.visit(path);
      organizationPageObject.openOrganizationsDropdown();

      organizationPageObject
        .getOrganizationDropdownItem(orgName)
        .should('not.exist');
    });
  });
});
