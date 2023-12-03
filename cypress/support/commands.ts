// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import authPo from './auth.po';

export function registerCypressCommands() {
  Cypress.Commands.add('cyGet', (name: string) => {
    return cy.get(createCySelector(name));
  });

  Cypress.Commands.add(
    'signIn',
    (redirectPath = '/', credentials = authPo.getDefaultUserCredentials()) => {
      cy.session(
        [redirectPath, credentials.email, credentials.password, Math.random()],
        () => {
          cy.log(
            `Signing in programmatically and redirecting to ${redirectPath} ...`,
          );

          return authPo.signInProgrammatically(credentials);
        },
        {
          validate: () =>
            authPo.validate().then((user) => {
              if (!user) {
                throw new Error('User is not authenticated');
              }
            }),
        },
      );

      // visit page
      cy.visit(redirectPath);

      // let the page hydrate before continuing
      cy.wait(1000);
    },
  );

  Cypress.Commands.add(
    'signUp',
    (
      redirectPath: string = '/',
      credentials = authPo.getDefaultUserCredentials(),
    ) => {
      cy.session([redirectPath, credentials.email, Math.random()], () => {
        cy.log(`Signing Up and redirecting to ${redirectPath} ...`);

        cy.visit(`/auth/sign-up`);

        authPo.$getEmailInput().type(credentials.email);
        authPo.$getPasswordInput().type(credentials.password);
        authPo.$getRepeatPasswordInput().type(credentials.password);
        authPo.$getSubmitButton().click();
      });

      cy.visit(redirectPath);
      cy.wait(500);
    },
  );

  Cypress.Commands.add(`clearStorage`, () => {
    cy.clearCookies();
    localStorage.clear();
    sessionStorage.clear();
  });

  Cypress.Commands.add(`resetDatabase`, () => {
    cy.task(`resetDatabase`);
  });

  Cypress.Commands.add(
    `completeOnboarding`,
    (email: string, password: string) => {
      cy.intercept({
        method: 'POST',
        pathname: '/onboarding/complete',
      }).as('completeOnboarding');

      cy.signIn('/onboarding', { email, password });
      cy.cyGet('organization-name-input').type('test');
      cy.get('button[type="submit"]').click();
      cy.cyGet('skip-onboarding-step').click();
      cy.wait('@completeOnboarding');

      cy.cyGet('complete-onboarding-link').click();
    },
  );

  Cypress.Commands.add(`visitSignUpEmailFromInBucket`, (email: string) => {
    const mailbox = email.split('@')[0];
    const emailTask = cy.task<UnknownObject>('getInviteEmail', mailbox);

    emailTask.then((json) => {
      const html = (json.body as { html: string }).html;
      const el = document.createElement('html');
      el.innerHTML = html;

      const linkHref = el.querySelector('a')?.getAttribute('href');

      cy.log(`Visiting ${linkHref} ...`);

      cy.visit(linkHref!, { failOnStatusCode: false });
    });
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
    const isResizeObserverLoopErr = resizeObserverLoopErrRe.test(err.message);
    const isNextRedirect = err.message.includes('NEXT_REDIRECT');
    const skipErrs = [isResizeObserverLoopErr, isNextRedirect];
    const shouldSkipErr = skipErrs.some(Boolean);

    if (shouldSkipErr) {
      return false;
    }
  });
}

export function createCySelector(name: string) {
  return `[data-cy="${name}"]`;
}
