export const profilePo = {
  $getDisplayNameInput: () => cy.cyGet(`profile-display-name`),
  $getUpdateEmailForm: () => cy.cyGet(`update-email-form`),
  $getUpdateProfileForm: () => cy.cyGet(`update-profile-form`),
  $getUpdatePasswordForm: () => cy.cyGet('update-password-form'),
  $getNewEmailInput: () => cy.cyGet(`profile-new-email-input`),
  $getRepeatEmailInput: () => cy.cyGet(`profile-repeat-email-input`),
  $getUpdateEmailErrorAlert: () => cy.cyGet(`update-email-error-alert`),
  $getNewPasswordInput: () => cy.cyGet(`new-password`),
  $getRepeatNewPasswordInput: () => cy.cyGet(`repeat-new-password`),
  $confirmDeleteAccountButton: () => cy.cyGet(`confirm-delete-account-button`),
  $confirmDeleteAccountConfirmationInput: () =>
    cy.cyGet(`delete-account-input-field`),
  $getDeleteAccountButton: () => cy.cyGet(`delete-account-button`),
  deleteAccount: () => {
    cy.intercept(
      {
        method: 'POST',
        pathname: '/dashboard/*/settings/profile',
      },
      (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.equal(200);
        });
      },
    ).as('deleteAccount');

    cy.wait(500);

    profilePo.$getDeleteAccountButton().click();
    profilePo.$confirmDeleteAccountConfirmationInput().type('DELETE');
    profilePo.$confirmDeleteAccountButton().click();

    cy.wait('@deleteAccount');
  },
};

export default profilePo;
