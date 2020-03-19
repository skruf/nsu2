import { weaponsFixture } from "../../src/fixtures"
import { randomArrayItemUtil } from "../../src/utils"

const inputWeaponsForm = (weapon) => {
  cy.getById("weaponsFormNumberInput")
    .type(weapon.number)
  cy.getById("weaponsFormNameInput")
    .type(weapon.name)
  cy.pickFromSelect("weaponsFormCategorySelect", weapon.category)
  cy.pickFromSelect("weaponsFormConditionSelect", weapon.condition)
  cy.pickFromSelect("weaponsFormDistanceInput", String(weapon.distance))
}

describe("weapons.list", () => {
  before(() => {
    cy.startup()
    cy.seed("weapons", weaponsFixture)
    cy.visit(`/#/weapons`)
  })

  it("Search", () => {
    const weapon = randomArrayItemUtil(weaponsFixture)
    cy.searchTable(
      weapon.name,
      "weaponsSearchFilterInput",
      "weaponsListTable"
    )
  })

  it("Create weapons", () => {
    const weapon = randomArrayItemUtil(weaponsFixture)
    cy.getById("weaponsCreateDialogOpenButton")
      .click()
    cy.getById("weaponsCreateDialogForm")
      .within(() => {
        inputWeaponsForm(weapon)
      })
    cy.getById("weaponsCreateDialogSubmitButton")
      .click()
    cy.getById("weaponsListTable")
      .contains(weapon.number)
    cy.getById("weaponsListTable")
      .contains(weapon.name)
    cy.getById("weaponsListTable")
      .contains(weapon.category)
    cy.getById("weaponsListTable")
      .contains(weapon.condition)
  })

  it("Delete weapon", () => {
    cy.getById("weaponsListTableRowDropdown")
      .first()
      .click()
    cy.getById("weaponsListTableRowDropdownRemoveOne")
      .first()
      .click()
    cy.getById("confirmAgree")
      .click()
  })

  it("Edit weapon", () => {
    const weapon = {
      number: "123 (updated)",
      name: "Nuclear Warhead (updated)",
      distance: "50 meter"
    }
    cy.getById("weaponsListTableRowDropdown")
      .first()
      .click()
    cy.getById("weaponsListTableRowDropdownOpenEditDialog")
      .first()
      .click()
    cy.getById("weaponsEditDialogForm")
      .within(() => {
        inputWeaponsForm(weapon)
      })
    cy.getById("weaponsEditDialogSubmitButton")
      .click()
    cy.getById("weaponsListTable")
      .contains(weapon.number)
    cy.getById("weaponsListTable")
      .contains(weapon.name)
  })

  it("Sort weapons", () => {
    cy.getById("weaponsListTableColumnNameText")
      .click()
    cy.getById("weaponsListTableColumnNameText")
      .click()
  })

  it("Paginate weapons", () => {
    cy.get(".v-data-footer .v-select")
      .click({ force: true })
    cy.get(".v-menu__content .v-list-item")
      .first()
      .click({ force: true })
    cy.get(".v-data-footer .v-btn")
      .last()
      .click({ force: true })
  })

  it("Delete many weapons", () => {
    cy.get("thead .v-input--selection-controls__ripple")
      .click({ force: true })
    cy.getById("weaponsListTableHeaderDropdown")
      .click()
    cy.getById("weaponsListTableHeaderDropdownRemoveMany")
      .click()
    cy.getById("confirmAgree")
      .click()
  })
})
