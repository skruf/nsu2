import { rangesFixture } from "../../../src/fixtures"
import { randomArrayItemUtil } from "../../../src/utils"

describe("ranges", () => {
  beforeEach(() => {
    cy.visit("/#ranges")
  })

  it("Create a range", () => {
    const range = randomArrayItemUtil(rangesFixture)
    cy.getById("rangesOpenCreateDialogButton").click()
    cy.getById("rangesFormInputName").type(range.name)
    cy.getById("rangesFormInputArea").type(range.area)
    cy.getById("rangesFormSelectCountry").click()
    cy.getById(`rangesFormSelectCountryValue${range.country}`).click()
    cy.getById("rangesFormSelectType").click()
    cy.getById(`rangesFormSelectTypeValue${range.type}`).click()
    cy.getById("rangesCreateDialogButtonSubmit").click()
    cy.getById("rangesListTable").contains(range.name)
    cy.getById("rangesListTable").contains(range.area)
    cy.getById("rangesListTable").contains(range.country)
    cy.getById("rangesListTable").contains(range.type)
  })

  it("Delete one range", () => {
    cy.getById("rangesListTableRowDropdown").first().click({ force: true })
    cy.getById("rangesListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit one range", () => {
    cy.wait(200)
    const updatedName = "Korpåsen"
    const updatedStreetAddress = "Sannergata 21"
    cy.getById("rangesListTableRowDropdown").first().click({ force: true })
    cy.getById("rangesListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("rangesFormInputName").clear().type(updatedName)
    cy.getById("rangesFormInputStreetAddress").clear().type(updatedStreetAddress)
    cy.getById("rangesEditDialogButtonSubmit").click()
    cy.getById("rangesListTable").contains(updatedName)
    cy.getById("rangesListTable").contains(updatedStreetAddress)
  })
})
