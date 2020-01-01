import { weaponsFixture } from "../../../src/fixtures"
import { randomArrayItemUtil } from "../../../src/utils"

describe("weapons.list", () => {
  beforeEach(() => {
    cy.visit("/weapons")
    cy.startup()
  })

  it("Search weapons", () => {
    const weapon = randomArrayItemUtil(weaponsFixture)
    cy.getById("weaponsSearchFilterInput").type(`${weapon.name}{enter}`)
    cy.getById("weaponsListTable").contains(weapon.name)
    cy.getById("weaponsSearchFilterInput").clear()
  })

  it("Sort weapons", () => {
    cy.getById("weaponsListTableColumnNameText").click()
    cy.getById("weaponsListTableColumnNameText").click()
  })

  it("Paginate weapons", () => {
    cy.get(".v-data-footer .v-select").click()
    cy.get(".v-list-item").first().click()
    cy.get(".v-data-footer .v-btn").last().click()
  })

  it("Create weapons", () => {
    const weapon = randomArrayItemUtil(weaponsFixture)
    cy.getById("weaponsCreateDialogOpenButton").click()
    cy.getById("weaponsFormNumberInput").type(weapon.number)
    cy.getById("weaponsFormNameInput").type(weapon.name)
    cy.getById("weaponsFormCategorySelect").click({ force: true })
    cy.contains(weapon.category).click()
    cy.getById("weaponsFormConditionSelect").click({ force: true })
    cy.contains(weapon.condition).click()
    cy.getById("weaponsFormDistanceInput").clear().type(weapon.distance)
    cy.getById("weaponsCreateDialogSubmitButton").click()
    cy.getById("weaponsListTable").contains(weapon.number)
    cy.getById("weaponsListTable").contains(weapon.name)
    cy.getById("weaponsListTable").contains(weapon.category)
    cy.getById("weaponsListTable").contains(weapon.condition)
  })

  it("Delete weapon", () => {
    cy.getById("weaponsListTableRowDropdown").first().click()
    cy.getById("weaponsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit weapon", () => {
    const number = "123 (updated)"
    const name = "Nuclear Warhead (updated)"
    cy.getById("weaponsListTableRowDropdown").first().click()
    cy.getById("weaponsListTableRowDropdownOpenEditDialog").first().click()
    cy.getById("weaponsFormNumberInput").clear().type(number)
    cy.getById("weaponsFormNameInput").clear().type(name)
    cy.getById("weaponsEditDialogSubmitButton").click()
    cy.getById("weaponsListTable").contains(number)
    cy.getById("weaponsListTable").contains(name)
  })

  it("Delete many weapons", () => {
    cy.wait(1000)
    cy.get("thead .v-input--selection-controls__ripple").click()
    cy.getById("weaponsListTableHeaderDropdown").click()
    cy.getById("weaponsListTableHeaderDropdownRemoveMany").click()
    cy.get(".el-message-box .el-button--primary").click()
  })
})
