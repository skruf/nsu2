import { rangesFixture } from "../../src/fixtures"
import { randomArrayItemUtil } from "../../src/utils"

const inputRangeForm = (range) => {
  cy.getById("rangesFormNameInput")
    .type(range.name)
  cy.getById("rangesFormAreaInput")
    .type(range.area)
  cy.pickFromSelect("rangesFormCountrySelect", range.country)
  cy.pickFromSelect("rangesFormTypeSelect", range.type)
}

describe("ranges.list", () => {
  before(() => {
    cy.startup()
    cy.seed("ranges", rangesFixture)
    cy.visit(`/#/ranges`)
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
    const range = {
      name: "Testbane",
      area: "Oslo, 0258",
      country: "Norge",
      type: "Innebane"
    }
    cy.getById("rangesCreateDialogOpenButton")
      .click()
    cy.getById("rangesCreateDialogForm")
      .within(() => {
        inputRangeForm(range)
      })
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
      .click()
    cy.getById("rangesListTableRowDropdownRemoveOne")
      .first()
      .click()
    cy.getById("confirmAgree")
      .click()
  })

  it("Edit one range", () => {
    const range = {
      name: "Testbane oppdatert",
      area: "Bergen, 4020",
      country: "Norge",
      type: "Utebane"
    }
    cy.getById("rangesListTableRowDropdown")
      .first()
      .click()
    cy.getById("rangesListTableRowDropdownOpenEditDialog")
      .first()
      .click()
    cy.getById("rangesEditDialogForm")
      .within(() => {
        inputRangeForm(range)
      })
    cy.getById("rangesEditDialogSubmitButton")
      .click()
    cy.getById("rangesListTable")
      .contains(range.name)
    cy.getById("rangesListTable")
      .contains(range.area)
  })
})
