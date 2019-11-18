// import { eventsCategoriesFixture } from "../../../src/fixtures"

describe("events.categories", () => {
  beforeEach(() => {
    cy.visit("/#events/categories")
  })

  it("Create category", () => {
    cy.getById("eventsCategoriesOpenCreateDialogButton").click()
    cy.getById("eventsCategoriesCreateDialogFormInputName").type("Verdensmesterskap")
    cy.getById("eventsCategoriesCreateDialogFormButtonSubmit").click()
    cy.getById("eventsCategoriesListTable").contains("Verdensmesterskap")
  })

  it("Edit category", () => {
    const updatedName = "Test category"
    cy.getById("eventsCategoriesListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsCategoriesListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("eventsCategoriesEditDialogFormInputName").clear().type(updatedName)
    cy.getById("eventsCategoriesEditDialogFormButtonSubmit").click()
    cy.getById("eventsCategoriesListTable").contains(updatedName)
  })

  it("Delete category", () => {
    cy.getById("eventsCategoriesListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsCategoriesListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })
})
