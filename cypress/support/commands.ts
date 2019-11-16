export {}
declare global {
  namespace Cypress {
    interface Chainable {
      getById: (testid: string) => Chainable
    }
  }
}

Cypress.Commands.add("getById", (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})
