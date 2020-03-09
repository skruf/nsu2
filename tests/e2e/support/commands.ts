Cypress.Commands.add("getById", (testId) => (
  cy.get(`[data-testid="${testId}"]`)
))

Cypress.Commands.add("startup", () => {
  cy.window({ timeout: 10000 })
    .should("have.property", "ready", true)
  cy.wait(1000)
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
    .type(`${searchValue}{enter}`)
  cy.getById(tableId)
    .within(() => {
      cy.get("tr")
        .each((tr, index) => {
          if(index !== 0) cy.wrap(tr).contains(searchValue)
        })
    })
  cy.getById(inputId)
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

Cypress.Commands.add("datePickerPickFirst", (testid) => {
  cy.getById(testid)
    .click({ force: true })
    .within(() => {
      cy.get(".v-btn")
        .first()
        .click()
      cy.getById("datePickerSaveButton")
        .first()
        .click()
    })
})

Cypress.Commands.add("datePickerPickLast", (testid) => {
  cy.getById(testid)
    .click({ force: true })
    .within(() => {
      cy.get(".v-btn")
        .last()
        .click()
      cy.getById("datePickerSaveButton")
        .first()
        .click()
    })

  // cy.getById(testid)
  //   .click({ force: true })
  // cy.get(".v-date-picker-table .v-btn")
  //   .last()
  //   .click()
  // cy.getById("datePickerSaveButton")
  //   .first()
  //   .click()
})
