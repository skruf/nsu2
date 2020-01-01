import { randomArrayItemUtil } from "../../../src/utils"
import { eventsFixture } from "../../../src/fixtures"

describe("events.list", () => {
  beforeEach(() => {
    cy.visit("/events")
    cy.startup()
  })

  it("Search", () => {
    const event = randomArrayItemUtil(eventsFixture)
    cy.getById("eventsSearchFilterInput").type(`${event.title}{enter}`)
    cy.getById("eventsListTable").contains(event.title)
    cy.getById("eventsSearchFilterInput").clear()
  })

  it("Create event", () => {
    const event = randomArrayItemUtil(eventsFixture)
    cy.getById("eventsCreateDialogOpenButton").click()
    cy.getById("eventsFormTitleInput").type(event.title)
    cy.getById("eventsFormStartsAtInput").click({ force: true })
    cy.get(".v-date-picker-table .v-btn").first().click()
    cy.get(".v-date-picker-table .v-btn").last().click()
    cy.getById("eventsFormStartsAtOkButton").click()
    cy.getById("eventsFormCategorySelect").click({ force: true })
    cy.get(".v-list-item").first().click()
    cy.getById("eventsFormOrganizerSelect").click({ force: true })
    cy.get(".v-list-item").first().click()
    cy.getById("eventsFormRangeSelect").click({ force: true })
    cy.get(".v-list-item").first().click()
    cy.getById("eventsCreateDialogSubmitButton").click()
    cy.getById("eventsListTable").contains(event.title)
  })

  it("Delete event", () => {
    cy.getById("eventsListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit event", () => {
    const name = "Test event"
    cy.getById("eventsListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsListTableRowDropdownEditDialogOpen").first().click({ force: true })
    cy.getById("eventsFormTitleInput").clear().type(name)
    // cy.getById("eventsFormStartsAtInput").click({ force: true })
    // cy.get(".v-date-picker-table .v-btn").first().click()
    // cy.get(".v-date-picker-table .v-btn").last().click()
    // cy.getById("eventsFormStartsAtOkButton").click()
    cy.getById("eventsFormApprobatedSwitch").click({ force: true })
    cy.getById("eventsEditDialogSubmitButton").click()
    cy.getById("eventsListTable").contains(name)
  })
})
