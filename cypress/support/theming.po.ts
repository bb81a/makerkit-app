export namespace themingPo {
  function openDarkModeMenu() {
    cy.cyGet('dark-mode-toggle').click();
  }

  export function assertIsNotDarkMode() {
    cy.get('html').should('not.have.class', 'dark');
  }

  export function assertIsDarkTheme() {
    cy.get('html').should('have.class', 'dark');
    cy.getCookie('theme').its('value').should('equal', 'dark');
  }

  export function toggleDarkMode() {
    openDarkModeMenu();
    cy.cyGet('dark-theme-button').click();
  }

  export function toggleLightMode() {
    openDarkModeMenu();
    cy.cyGet('light-theme-button').click();
  }

  export function toggleSystemMode() {
    openDarkModeMenu();
    cy.cyGet('system-theme-button').click();
  }

  function isSystemThemeDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  export function assertIsCorrectSystemTheme() {
    cy.get('html').should(
      isSystemThemeDark() ? 'have.class' : 'not.have.class',
      'dark'
    );
  }
}
