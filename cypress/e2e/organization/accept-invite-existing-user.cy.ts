import authPo from '../../support/auth.po';
import configuration from '~/configuration';
import organizationPageObject from '../../support/organization.po';

describe(`Accept Invite - Existing User`, () => {
  const existingUserEmail = `test2@makerkit.dev`;
  const existingUserInviteCode = '89Mu5Q42DjzIWvyc';
  const password = authPo.getDefaultUserPassword();

  function signIn() {
    const invitePath = `/invite/${existingUserInviteCode}`;

    cy.signIn(invitePath, {
      email: existingUserEmail,
      password,
    });
  }

  describe(`when the user signs out`, () => {
    before(() => {
      signIn();
      cy.cyGet('invite-sign-out-button').click();
    });

    it('should display the new user invite flow', () => {
      authPo.$getEmailInput().should('be.visible');
    });
  });

  describe(`when the user accepts the invite`, () => {
    it('should be redirected to the dashboard', () => {
      signIn();
      authPo.$getAcceptInviteSubmitButton().wait(150).click();

      cy.url().should('contain', configuration.paths.appHome);
    });
  });

  describe(`when the user visits the members page`, () => {
    it('should add the new member to the members list', () => {
      const organization = organizationPageObject.useDefaultOrganization();

      cy.signIn(`/dashboard/${organization}/settings/organization/members`, {
        email: existingUserEmail,
        password,
      });

      organizationPageObject
        .$getMemberByEmail(existingUserEmail)
        .should('exist');
    });
  });
});
