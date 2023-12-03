import { themingPo } from '../support/theming.po';

describe(`Theming`, () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(500);
  });

  describe('When setting the dark theme', () => {
    it('should use the dark theme', () => {
      themingPo.toggleDarkMode();
      themingPo.assertIsDarkTheme();

      // check it persists across reloads
      cy.reload();
      themingPo.assertIsDarkTheme();
    });
  });

  describe('When setting the light theme', () => {
    it('should use the light theme', () => {
      themingPo.toggleLightMode();
      themingPo.assertIsNotDarkMode();

      // check it persists across reloads
      cy.reload();
      themingPo.assertIsNotDarkMode();
    });
  });

  describe('When setting the system theme', () => {
    it('should use the selected system theme', () => {
      themingPo.toggleSystemMode();
      themingPo.assertIsCorrectSystemTheme();

      cy.visit('/auth/sign-in');
      themingPo.assertIsCorrectSystemTheme();
    });
  });
});
