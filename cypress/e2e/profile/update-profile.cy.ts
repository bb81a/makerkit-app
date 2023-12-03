import profilePo from '../../support/profile.po';
import organizationPageObject from '../../support/organization.po';

describe(`Update Profile`, () => {
  describe(`When updating the user Display name`, () => {
    const newDisplayName = `Makerkit Guy`;

    it('should execute a request to update the profile', () => {
      signIn();

      cy.intercept('PATCH', '/rest/v1/users**').as('updateProfile');

      // update display name
      profilePo.$getDisplayNameInput().clear().type(newDisplayName);
      profilePo.$getUpdateProfileForm().submit();

      // wait for completion to ensure the request succeeds
      cy.wait('@updateProfile');
    });

    it('should store the new profile name', () => {
      signIn();

      profilePo
        .$getDisplayNameInput()
        .then(($el) => $el.val())
        .should('equal', newDisplayName);
    });
  });
});

function signIn() {
  const organization = organizationPageObject.useDefaultOrganization();
  cy.signIn(`/dashboard/${organization}/settings/profile`);
}
