import { createBrowserClient } from '@supabase/ssr';

// we use a namespace not to pollute the IDE with methods from the tests
const authPageObject = {
  getDefaultUserEmail: () => Cypress.env(`USER_EMAIL`) as string,
  getDefaultUserPassword: () => Cypress.env(`USER_PASSWORD`) as string,
  getDefaultUserCredentials: () => {
    return {
      email: authPageObject.getDefaultUserEmail(),
      password: authPageObject.getDefaultUserPassword(),
    };
  },
  $getEmailInput: () => cy.cyGet(`email-input`),
  $getPasswordInput: () => cy.cyGet(`password-input`),
  $getRepeatPasswordInput: () => cy.cyGet(`repeat-password-input`),
  $getSubmitButton: () => cy.cyGet(`auth-submit-button`),
  $getErrorMessage: () => cy.cyGet(`auth-error-message`),
  $getAcceptInviteSubmitButton: () => cy.cyGet(`accept-invite-submit-button`),
  interceptSignUp(callback: () => void) {
    cy.intercept({
      method: 'POST',
      pathname: '/auth/v1/signup',
    }).as('signUp');

    callback();

    cy.wait('@signUp');
  },
  signInWithEmailAndPassword(email: string, password: string) {
    this.$getEmailInput().clear().type(email);
    this.$getPasswordInput().clear().type(password);
    this.$getSubmitButton().click();
  },
  signUpWithEmailAndPassword(
    email: string,
    password: string,
    repeatPassword?: string,
  ) {
    cy.wait(100);

    this.$getEmailInput().clear().type(email);
    this.$getPasswordInput().clear().type(password);
    this.$getRepeatPasswordInput().type(repeatPassword || password);
    this.$getSubmitButton().click();
  },
  async signInProgrammatically({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const client = createBrowserClient(
      Cypress.env('SUPABASE_URL'),
      Cypress.env('SUPABASE_ANON_KEY'),
    );

    cy.log(`Signing in programmatically ...`);

    return client.auth
      .signInWithPassword({ email, password })
      .then(({ error, data }) => {
        console.log({ error, data });

        if (error) {
          return error.message;
        }

        return JSON.stringify(data);
      });
  },
  validate() {
    const client = createBrowserClient(
      Cypress.env('SUPABASE_URL'),
      Cypress.env('SUPABASE_ANON_KEY'),
    );

    return client.auth.getUser().then(({ data }) => {
      return data;
    });
  },
};

export default authPageObject;
