import authPo from '../../support/auth.po';
import profilePo from '../../support/profile.po';
import auth from '../../support/auth.po';

describe(`Delete Account`, () => {
  let email: string;
  let password: string;

  function setupUser() {
    const random = Math.round(Math.random() * 1000);
    email = `delete-account-${random}@example.com`;
    password = authPo.getDefaultUserPassword();

    cy.visit('/auth/sign-up');
    authPo.signUpWithEmailAndPassword(email, password);
    cy.wait(500);
    cy.task('confirmEmail', email);

    cy.completeOnboarding(email, password);
  }

  describe(`When the user deletes their account`, () => {
    it(`should delete the user's account`, () => {
      setupUser();

      cy.contains('Settings').click();

      profilePo.deleteAccount();
    });

    it(`should not be able to sign in with the deleted account`, () => {
      cy.visit('/auth/sign-in');
      authPo.signInWithEmailAndPassword(email, password);
      auth.$getErrorMessage().should('exist');
    });
  });
});
