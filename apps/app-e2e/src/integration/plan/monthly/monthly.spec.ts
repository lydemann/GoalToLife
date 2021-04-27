describe('MonthlyComponent', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clock(Date.UTC(2021, 3, 27), ['Date']);
    cy.login('test@test.com', 'testtest');
  });

  it('should show calendar', () => {
    cy.contains('Some daily goal 1').should('be.visible');
  });

  // describe('monthly goal period', () => {
  //   it('should create goal', () => {});

  //   it('should auto save retro item', () => {});

  //   it('should edit goal', () => {});

  //   it('should delete goal', () => {});
  // });

  // describe('daily goal period', () => {
  //   it('should delete create goal', () => {});

  //   it('should auto save retro item', () => {});

  //   it('should edit goal', () => {});

  //   it('should delete goal', () => {});
  // });
});
