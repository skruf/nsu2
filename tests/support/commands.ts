import { seed } from "../../src/utils/db.test.util"

Cypress.Commands.add("getById", (testId) => (
  cy.get(`[data-testid="${testId}"]`)
))

Cypress.Commands.add("startup", () => {
  cy.window()
    .should("have.property", "ready", true)
})

Cypress.Commands.add("acceptConfirmation", (
  options: Partial<Cypress.ClickOptions>
) => {
  cy.get(".el-message-box .el-button--primary")
    .click(options)
})

Cypress.Commands.add("random", { prevSubject: true }, (subject) => (
  cy.get(subject).its("length")
    .then((count) => (
      cy.get(subject)
        .eq(Math.floor(Math.random() * count - 1))
    ))
))

Cypress.Commands.add("searchTable", (searchValue, inputId, tableId) => {
  cy.getById(inputId)
    .find("input")
    .type(`${searchValue}{enter}`)
  cy.getById(tableId)
    .within(() => {
      cy.get("tr")
        .each((tr, index) => {
          if(index !== 0) cy.wrap(tr).contains(searchValue)
        })
    })
  cy.getById(inputId)
    .find("input")
    .clear()
})

Cypress.Commands.add("pickFromSelect", (testid, value) => {
  cy.getById(testid)
    .click({ force: true })
    .type(`${value}{enter}`, { force: true })
})

Cypress.Commands.add("pickFromDatePicker", (testid, date) => {
  cy.getById(testid)
    .type(date.split(".").reverse().join("-"))
  cy.getById("datePickerSaveButton")
    .click()
})

Cypress.Commands.add("seed", (collection, data) => {
  cy.window().then(async ({ db }) => {
    await seed(db, collection, data)
  })
})
