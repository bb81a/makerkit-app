import organizationPageObject from '../../support/organization.po';

describe(`Delete Invite`, () => {
  // this invite has been pre-populated with the following email
  const invitedMemberEmail = `invite-delete@makerkit.dev`;

  function signIn() {
    const organization = organizationPageObject.useDefaultOrganization();
    cy.signIn(`/dashboard/${organization}/settings/organization/members`);
  }

  function deleteInvite() {
    organizationPageObject
      .$getInvitedMemberByEmail(invitedMemberEmail)
      .within(() => {
        organizationPageObject
          .$getDeleteInviteButton()
          .wait(50)
          .click({ force: true });
      });

    organizationPageObject.$getConfirmDeleteInviteButton().click();
  }

  describe(`When the invite is deleted`, () => {
    it('should be removed from the list', () => {
      signIn();
      deleteInvite();

      organizationPageObject
        .$getInvitedMemberByEmail(invitedMemberEmail)
        .should('not.exist');
    });
  });
});
