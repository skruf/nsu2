// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("getById", (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add("startup", () => {
  cy.window({ timeout: 10000 }).should("have.property", "ready", true)
})
