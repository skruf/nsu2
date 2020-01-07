Cypress.Commands.add("getById", (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add("startup", () => {
  cy.window({ timeout: 10000 }).should("have.property", "ready", true)
})

Cypress.Commands.add("acceptConfirmation", () => {
  cy.get(".el-message-box .el-button--primary").click()
})

Cypress.Commands.add("inputEventsForm", (data) => {
  if(data.title) {
    cy.getById("eventsFormTitleInput").clear().type(data.title)
  }

  if(data.startsAt) {
    cy.getById("eventsFormStartsAtInput").click({ force: true })
    cy.get(".v-date-picker-table .v-btn").first().click()
    cy.get(".v-date-picker-table .v-btn").last().click()
    cy.getById("eventsFormStartsAtOkButton").click()
  }

  if(data.endsAt) {
    cy.getById("eventsFormEndsAtInput").click({ force: true })
    cy.get(".v-date-picker-table .v-btn").first().click()
    cy.get(".v-date-picker-table .v-btn").last().click()
    cy.getById("eventsFormEndsAtOkButton").click()
  }

  if(data.categoryId) {
    cy.getById("eventsFormCategorySelect").click({ force: true })
    cy.get(".v-list-item").first().click()
  }

  if(data.organizerId) {
    cy.getById("eventsFormOrganizerSelect").click({ force: true })
    cy.get(".v-list-item").first().click()
  }

  if(data.rangeId) {
    cy.getById("eventsFormRangeSelect").click({ force: true })
    cy.get(".v-list-item").first().click()
  }

  if(data.approbated) {
    cy.getById("eventsFormApprobatedSwitch").click({ force: true })
  }
})
