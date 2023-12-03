import profilePo from '../../support/profile.po';
import authPo from '../../support/auth.po';
import organizationPageObject from '../../support/organization.po';

describe(`Update Password`, () => {
  const newPassword = `newpassword`;

  function signIn() {
    const organization = organizationPageObject.useDefaultOrganization();

    cy.signIn(`/dashboard/${organization}/settings/profile/password`, {
      email: `test-update-password@makerkit.dev`,
      password: authPo.getDefaultUserPassword(),
    });
  }

  function fillForm(params: { newPassword: string; repeatPassword: string }) {
    profilePo.$getNewPasswordInput().clear().type(params.newPassword);
    profilePo.$getRepeatNewPasswordInput().clear().type(params.repeatPassword);
    profilePo.$getUpdatePasswordForm().submit();
  }

  describe(`When successfully updating the password`, () => {
    it('should successfully execute the request', () => {
      signIn();

      cy.intercept('PUT', 'auth/v1/user**').as('updatePassword');

      fillForm({
        newPassword,
        repeatPassword: newPassword,
      });

      cy.wait('@updatePassword').its('response.statusCode').should('eq', 200);

      profilePo.$getNewPasswordInput().invoke('val').should('be.empty');
      profilePo.$getRepeatNewPasswordInput().invoke('val').should('be.empty');
    });
  });
});
