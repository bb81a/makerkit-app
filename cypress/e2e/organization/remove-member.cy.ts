import organizationPageObject from '../../support/organization.po';

describe(`Remove Member`, () => {
  const targetEmail = `test-remove@makerkit.dev`;

  function signIn() {
    const organization = organizationPageObject.useDefaultOrganization();
    cy.signIn(`/dashboard/${organization}/settings/organization/members`);
  }

  describe(`Given the current user removes a member from the organization`, () => {
    it('the member should disappear from the list', () => {
      signIn();

      organizationPageObject.removeMember(targetEmail);
      organizationPageObject.$getMemberByEmail(targetEmail).should('not.exist');
    });
  });
});
