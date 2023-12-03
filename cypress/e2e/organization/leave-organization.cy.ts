import organizationPageObject from '../../support/organization.po';
import authPo from '../../support/auth.po';
import configuration from '~/configuration';

describe(`Leave Organization`, () => {
  describe(`When the user is a member`, () => {
    it(`should be able to leave the organization`, () => {
      const email = getRandomEmail();

      cy.signIn(configuration.paths.appHome);
      cy.cyGet('organization-card-button').eq(0).click();

      cy.contains('Settings').click();
      cy.contains('Organization').click();
      cy.contains('Members').click();
      cy.contains('Invite Members').click();

      organizationPageObject.inviteMember(email);

      cy.clearCookies();
      cy.reload();

      cy.visitSignUpEmailFromInBucket(email);

      cy.wait(500);

      cy.intercept('auth/v1/signup*').as('signUp');
      authPo.signUpWithEmailAndPassword(email, 'anypass');
      cy.wait('@signUp');

      cy.visitSignUpEmailFromInBucket(email);
      cy.signIn(configuration.paths.appHome, {
        email,
        password: 'anypass',
      });

      cy.wait(500);

      cy.contains('Settings').click();
      cy.contains('Organization').click();

      cy.wait(500);

      organizationPageObject.$getLeaveOrganizationButton().click();
      organizationPageObject.$getConfirmLeaveOrganizationButton().click();

      cy.url().should('contain', configuration.paths.appHome);
    });
  });
});

function getRandomEmail() {
  const random = Math.round(Math.random() * 1000);
  return `leave-organization-${random}@makerkit.dev`;
}
