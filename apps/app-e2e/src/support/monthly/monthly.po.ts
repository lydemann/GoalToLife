export class MonthlyPO {
  static toggleLastMonthlyGoalCompleted() {
    cy.get('[data-testid=monthly-goal-period] [data-testid=edit-goal]')
      .last()
      .click();
    cy.get('[data-testid=toggle-goal-completed]').click();
    cy.get('[data-testid=submit-goal]').click();

    cy.get('[data-testid=monthly-goal-period] [data-testid=goal-completed]')
      .last()
      .should('have.class', 'checkbox-checked');
  }

  static deleteLatestMonthlyGoal() {
    cy.get('[data-testid=goal]')
      .its('length')
      .then((length) => {
        cy.get('[data-testid=monthly-goal-period] [data-testid=delete-goal]')
          .last()
          .click();

        cy.get('[data-testid=goal]').its('length').should('be.lt', length);
      });
  }

  static createMonthlyGoalName(goalName: string) {
    cy.get('[data-testid=goal]')
      .its('length')
      .then((length) => {
        cy.get('[data-testid=add-monthly-goal-input] > input')
          .type(goalName)
          .type('{enter}');

        cy.get('[data-testid=goal]').its('length').should('be.gt', length);
      });
  }
  static assertGoalVisible(goalName: string) {
    cy.contains(goalName).should('be.visible');
  }
}
