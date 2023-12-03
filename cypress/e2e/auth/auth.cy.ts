import auth from '../../support/auth.po';
import configuration from '~/configuration';
import authPo from '../../support/auth.po';

const randomNumber = () => Math.round(Math.random() * 100);

describe(`Authentication`, () => {
  // randomize email to avoid using duplicate emails
  const email = `test+${randomNumber()}@makerkit.dev`;
  const password = `makerkitpwd`;

  describe(`Sign Up`, () => {
    beforeEach(() => {
      cy.visit(`/auth/sign-up`);
    });

    describe(`given the user signs up with email/password`, () => {
      describe(`when the passwords mismatch`, () => {
        it('should return an error', () => {
          auth.signUpWithEmailAndPassword(email, password, 'anotherpassword');

          cy.url().should('contain', configuration.paths.signUp);
        });
      });

      describe(`when the request is successful`, () => {
        it('should display the email confirmation alert', () => {
          auth.interceptSignUp(() => {
            auth.signUpWithEmailAndPassword(email, password);
          });

          cy.cyGet('email-confirmation-alert').should('exist');
          cy.task('confirmEmail', email);
        });
      });

      describe(`when the request is unsuccessful because the user already signed up`, () => {
        it('should display an error message', () => {
          auth.signUpWithEmailAndPassword(
            authPo.getDefaultUserEmail(),
            authPo.getDefaultUserPassword(),
          );

          auth.$getErrorMessage().should('exist');
        });
      });
    });
  });

  describe(`Sign In`, () => {
    beforeEach(() => {
      cy.visit(`/auth/sign-in`).wait(1000);
    });

    describe(`given the user signs in with email/password`, () => {
      describe(`when the request is not successful`, () => {
        it('should display an error message', () => {
          const wrongEmail = `awrongemail@makerkit.dev`;
          const wrongPassword = `somePassword`;

          auth.signInWithEmailAndPassword(wrongEmail, wrongPassword);
          auth.$getErrorMessage().should('exist');
        });
      });

      describe(`when the request is successful`, () => {
        it('should take the user to the app home page', () => {
          auth.signInWithEmailAndPassword(
            auth.getDefaultUserEmail(),
            auth.getDefaultUserPassword(),
          );

          cy.url().should('contain', configuration.paths.appHome);
        });
      });
    });
  });
});
