import { weaponsFixture } from "../../../src/fixtures"
import { randomArrayItemUtil } from "../../../src/utils"

describe("weapons", () => {
  beforeEach(() => {
    cy.visit("/#weapons")
  })

  it("Create weapons", () => {
    const weapon = randomArrayItemUtil(weaponsFixture)
    cy.getById("weaponsOpenCreateDialogButton").click()
    cy.getById("weaponsFormInputNumber").type(weapon.number)
    cy.getById("weaponsFormInputName").type(weapon.name)
    cy.getById("weaponsFormSelectCategory").click()
    cy.getById(`weaponsFormSelectCategoryValue${weapon.category.replace(/\s/g, '')}`).click()
    cy.getById("weaponsFormSelectCondition").click()
    cy.getById(`weaponsFormSelectConditionValue${weapon.condition.replace(/\s/g, '')}`).click()
    cy.getById("weaponsFormInputDistance").type(weapon.distance)
    cy.getById("weaponsCreateDialogButtonSubmit").click()
    cy.getById("weaponsListTable").contains(weapon.number)
    cy.getById("weaponsListTable").contains(weapon.name)
    cy.getById("weaponsListTable").contains(weapon.category)
    cy.getById("weaponsListTable").contains(weapon.condition)
  })

  it("Delete weapon", () => {
    cy.getById("weaponsListTableRowDropdown").first().click({ force: true })
    cy.getById("weaponsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click({ force: true })
  })

  it("Edit weapon", () => {
    cy.wait(200)
    const number = "123 (updated)"
    const name = "Nuclear Warhead (updated)"
    cy.getById("weaponsListTableRowDropdown").first().click({ force: true })
    cy.getById("weaponsListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("weaponsFormInputNumber").clear().type(number)
    cy.getById("weaponsFormInputName").clear().type(name)
    cy.getById("weaponsEditDialogButtonSubmit").click()
    cy.getById("weaponsListTable").contains(number)
    cy.getById("weaponsListTable").contains(name)
  })
})
