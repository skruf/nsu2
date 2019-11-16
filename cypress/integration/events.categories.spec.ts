import { eventsCategoriesFixture } from "../../src/app/fixtures"

describe("events.categories", () => {
  it("Navigate to event categories", () => {
    cy.visit("http://localhost:1234")
    cy.getById("eventsCategoriesMenuItem").click({ force: true })
  })

  it("Create many categories", () => {
    const create = (category) => {
      cy.getById("eventsCategoriesOpenCreateDialogButton").click()
      cy.getById("eventsCategoriesCreateDialogFormInputName").type("Verdensmesterskap")
      cy.getById("eventsCategoriesCreateDialogFormButtonSubmit").click()
      cy.getById("eventsCategoriesListTable").contains("Verdensmesterskap")
    }
    eventsCategoriesFixture.forEach(create)
  })

  it("Edit one categories", () => {
    const updatedName = " updated"
    cy.getById("eventsCategoriesListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsCategoriesListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("eventsCategoriesEditDialogFormInputName").type(updatedName)
    cy.getById("eventsCategoriesEditDialogFormButtonSubmit").click()
    cy.getById("eventsCategoriesListTable").contains("updated")
  })

  it("Delete one categories", () => {
    cy.getById("eventsCategoriesListTableRowDropdown").first().click({ force: true })
    cy.getById("eventsCategoriesListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Delete many categories", () => {
    cy.get(".el-checkbox").first().click()
    cy.getById("eventsCategoriesListTableRowDropdownRemoveMany").click({ force: true })
    cy.get(".el-message-box .el-button--primary").click({ force: true })
  })
})
