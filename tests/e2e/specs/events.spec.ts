import { randomArrayItemUtil } from "../../../src/utils"
import {
  eventsFixture,
  eventsCategoriesFixture
} from "../../../src/fixtures"

describe("events", () => {
  beforeEach(() => {
    cy.visit("/#events")
  })

  it("Create event", () => {
    const event = randomArrayItemUtil(eventsFixture)
    cy.getById("eventsOpenCreateDialogButton").click()
    cy.getById("eventsFormInputTitle").type(event.title)
    cy.getById("eventsFormDatePickerDates").click()
    cy.get(".available").first().click()
    cy.get(".available").last().click()
    cy.getById("eventsFormSelectCategory").click()
    cy.getById(`eventsFormSelectCategoryValueVerdensmesterskap`).first().click()
    cy.getById("eventsCreateDialogButtonSubmit").click()
    cy.getById("eventsListTable").contains(event.title)
  })

  it("Delete event", () => {
    cy.getById("eventsListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit event", () => {
    cy.wait(200)
    cy.getById("eventsListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("eventsFormLabelApprobated").click({ force: true })
    cy.getById("eventsEditDialogButtonSubmit").click()
    cy.getById("eventsListTable").contains("Er approbert")
  })
})
