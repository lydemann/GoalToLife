import { MonthlyPO } from '../../../support/monthly/monthly.po';

describe('MonthlyComponent', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clock(Date.UTC(2021, 3, 27), ['Date']);
    cy.login('test@test.com', 'testtest');
  });

  it('should show calendar', () => {
    MonthlyPO.assertGoalVisible('Some daily goal 1');
  });

  describe('monthly goal period', () => {
    it('should create goal', () => {
      const goalName = 'Some new monthly goal: ' + Math.random() * 100;
      MonthlyPO.createMonthlyGoalName(goalName);
    });

    // it('should auto save retro item', () => {});

    it('should edit goal', () => {
      const goalName = 'Some new monthly goal: ' + Math.random() * 100;
      MonthlyPO.createMonthlyGoalName(goalName);
      MonthlyPO.toggleLastMonthlyGoalCompleted();
    });

    it('should delete goal', () => {
      const goalName = 'Some new monthly goal: ' + Math.random() * 100;
      MonthlyPO.createMonthlyGoalName(goalName);

      MonthlyPO.deleteLatestMonthlyGoal();
    });
  });

  // describe('daily goal period', () => {
  //   it('should delete create goal', () => {});

  //   it('should auto save retro item', () => {});

  //   it('should edit goal', () => {});

  //   it('should delete goal', () => {});
  // });
});
