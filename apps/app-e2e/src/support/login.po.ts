export class LoginPO {
  static login() {
    cy.get('[data-testid=email-input]').type('testuser@testuser.dk');
    cy.get('[data-testid=password-input]').type('testuser');
    cy.get('[data-testid=login-btn]').click();
  }
}
