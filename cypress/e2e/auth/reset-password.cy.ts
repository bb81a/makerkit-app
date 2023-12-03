import configuration from '~/configuration';
import authPo from '../../support/auth.po';

describe(`Reset Password`, () => {
  describe(`when the password is reset successfully`, () => {
    it('should allow the user to sign in with the new password', () => {
      const suffix = Math.floor(Math.random() * 1000);
      const email = `test-reset-pwd-${suffix}@makerkit.dev`;
      const password = `makerkitpwd`;
      const newPassword = `newpassword`;

      cy.visit('/auth/sign-up');

      authPo.interceptSignUp(() => {
        authPo.signUpWithEmailAndPassword(email, password);
      });

      cy.visitSignUpEmailFromInBucket(email);
      cy.completeOnboarding(email, password);

      // sign out
      cy.clearCookies();
      cy.reload();

      cy.visit(`/auth/password-reset`);

      // fill out the form
      cy.get('input[name="email"]').type(email);
      cy.get('button[type="submit"]').click();

      cy.visitSignUpEmailFromInBucket(email);

      cy.get('input[name="password"]').type(newPassword);
      cy.get('input[name="repeatPassword"]').type(newPassword);
      cy.get('button[type="submit"]').click();

      cy.clearCookies();

      cy.signIn(configuration.paths.appHome, {
        email,
        password: newPassword,
      });
    });
  });
});
