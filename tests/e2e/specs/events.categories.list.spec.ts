// import { eventsCategoriesFixture } from "../../../src/fixtures"
// const category = eventsCategoriesFixture[0]

describe("events.categories.list", () => {
  beforeEach(() => {
    cy.visit("/events/categories")
    cy.startup()
  })

  it("Create category", () => {
    cy.getById("eventsCategoriesCreateDialogOpenButton").click()
    cy.getById("eventsCategoriesFormNameInput").type("Verdensmesterskap")
    cy.getById("eventsCategoriesCreateDialogSubmitButton").click()
    cy.getById("eventsCategoriesListTable").contains("Verdensmesterskap")
  })

  it("Edit category", () => {
    const updatedName = "Test category"
    cy.getById("eventsCategoriesListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsCategoriesListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("eventsCategoriesFormNameInput").clear().type(updatedName)
    cy.getById("eventsCategoriesEditDialogSubmitButton").click()
    cy.getById("eventsCategoriesListTable").contains(updatedName)
  })

  it("Delete category", () => {
    cy.getById("eventsCategoriesListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsCategoriesListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })
})
