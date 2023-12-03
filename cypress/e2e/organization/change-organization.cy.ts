import organizationPageObject from '../../support/organization.po';
import configuration from '~/configuration';

describe(`Change Organization`, () => {
  const organizationName = `Test ${Math.random() * 100}`;
  const originalOrganizationName = `IndieCorp`;

  describe(`Given the user changes organization using the organizations selector`, () => {
    it('it should load and display the selected organization', () => {
      cy.signIn(configuration.paths.appHome);

      organizationPageObject.createOrganization(organizationName);
      organizationPageObject.assertCurrentOrganization(organizationName);

      organizationPageObject.switchToOrganization(originalOrganizationName);
      organizationPageObject.assertCurrentOrganization(
        originalOrganizationName
      );
    });
  });
});
