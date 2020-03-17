import { rangesFixture } from "../../src/fixtures"
import { randomArrayItemUtil } from "../../src/utils"

describe("ranges.list", () => {
  beforeEach(() => {
    cy.visit("/ranges")
    cy.startup()
  })

  it("Search", () => {
    const range = randomArrayItemUtil(rangesFixture)
    cy.searchTable(
      range.name,
      "rangesSearchFilterInput",
      "rangesListTable"
    )
  })

  it("Create a range", () => {
    const range = randomArrayItemUtil(rangesFixture)
    cy.getById("rangesCreateDialogOpenButton")
      .click()
    cy.getById("rangesFormNameInput")
      .type(range.name)
    cy.getById("rangesFormAreaInput")
      .type(range.area)
    cy.pickFromSelect("rangesFormCountrySelect", range.country)
    cy.pickFromSelect("rangesFormTypeSelect", range.type)
    cy.getById("rangesCreateDialogSubmitButton")
      .click()
    cy.getById("rangesListTable")
      .contains(range.name)
    cy.getById("rangesListTable")
      .contains(range.area)
    cy.getById("rangesListTable")
      .contains(range.country)
    cy.getById("rangesListTable")
      .contains(range.type)
  })

  it("Delete one range", () => {
    cy.getById("rangesListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("rangesListTableRowDropdownRemoveOne")
      .first()
      .click({ force: true })
    cy.acceptConfirmation()
  })

  it("Edit one range", () => {
    const updatedName = "Korpåsen"
    const updatedStreetAddress = "Sannergata 21"
    cy.getById("rangesListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("rangesListTableRowDropdownOpenEditDialog")
      .first()
      .click({ force: true })
    cy.getById("rangesFormNameInput")
      .clear()
      .type(updatedName)
    cy.getById("rangesFormStreetAddressInput")
      .clear()
      .type(updatedStreetAddress)
    cy.getById("rangesEditDialogSubmitButton")
      .click()
    cy.getById("rangesListTable")
      .contains(updatedName)
    cy.getById("rangesListTable")
      .contains(updatedStreetAddress)
  })
})
