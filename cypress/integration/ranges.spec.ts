import { rangesFixture } from "../../src/app/fixtures"
import { randomArrayItemUtil } from "../../src/app/utils"

describe("ranges", () => {
  it("Open /ranges", () => {
    cy.visit("/ranges")
  })

  it("Create many ranges", () => {
    const create = (range) => {
      cy.getById("rangesOpenCreateDialogButton").click()
      cy.getById("rangesCreateDialogFormInputName").type(range.name)
      cy.getById("rangesCreateDialogFormInputArea").type(range.area)
      cy.getById("rangesCreateDialogFormSelectCountry").click()
      cy.getById(`rangesCreateDialogFormSelectCountryValue${range.country}`).click()
      cy.getById("rangesCreateDialogFormSelectType").click()
      cy.getById(`rangesCreateDialogFormSelectTypeValue${range.type}`).click()
      cy.getById("rangesCreateDialogFormButtonSubmit").click()
      cy.getById("rangesListTable").contains(range.name)
      cy.getById("rangesListTable").contains(range.area)
      cy.getById("rangesListTable").contains(range.country)
      cy.getById("rangesListTable").contains(range.type)
    }

    for(let i = 0; i < 3; i++) {
      const f = randomArrayItemUtil(rangesFixture)
      create({ ...f, name: `${i} - ${f.name}` })
    }
  })

  it("Delete one range", () => {
    cy.getById("rangesListTableRowDropdown").first().click({ force: true })
    cy.getById("rangesListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit one range", () => {
    cy.wait(200)
    const updatedName = " updated"
    const updatedAddress = "Sannergata 21"
    cy.getById("rangesListTableRowDropdown").first().click({ force: true })
    cy.getById("rangesListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("rangesEditDialogFormInputName").type(updatedName)
    cy.getById("rangesEditDialogFormInputAddress").type(updatedAddress)
    cy.getById("rangesEditDialogFormButtonSubmit").click()
    cy.getById("rangesListTable").contains("updated")
    cy.getById("rangesListTable").contains(updatedAddress)
  })

  it("Delete many ranges", () => {
    cy.get(".el-checkbox").first().click()
    cy.getById("rangesListTableRowDropdownRemoveMany").click({ force: true })
    cy.get(".el-message-box .el-button--primary").click({ force: true })
  })
})
