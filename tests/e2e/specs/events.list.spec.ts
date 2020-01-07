import { randomArrayItemUtil } from "../../../src/utils"
import { eventsFixture } from "../../../src/fixtures"

describe("events.list", () => {
  beforeEach(() => {
    cy.visit("/events")
    cy.startup()
  })

  it("Search table", () => {
    const event = randomArrayItemUtil(eventsFixture)
    cy.getById("eventsSearchFilterInput")
      .type(`${event.title}{enter}`)
    cy.getById("eventsListTable")
      .contains(event.title)
    cy.getById("eventsSearchFilterInput")
      .clear()
  })

  it("Create event", () => {
    const event = randomArrayItemUtil(eventsFixture)
    cy.getById("eventsCreateDialogOpenButton")
      .click()
    cy.inputEventsForm(event)
    cy.getById("eventsCreateDialogSubmitButton")
      .click()
    cy.getById("eventsListTable")
      .contains(event.title)
  })

  it("Delete event from table dropdown", () => {
    cy.getById("eventsListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("eventsListTableRowDropdownRemoveOne")
      .first()
      .click({ force: true })
    cy.acceptConfirmation()
  })

  it("Edit event from table dropdown", () => {
    const title = "Test event"
    cy.getById("eventsListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("eventsListTableRowDropdownEditDialogOpen")
      .first()
      .click({ force: true })
    cy.inputEventsForm({ title })
    cy.getById("eventsListTable")
      .contains(title)
  })
})
