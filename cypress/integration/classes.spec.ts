import { classesFixture } from "../../src/app/fixtures"
import { randomArrayItemUtil } from "../../src/app/utils"

describe("classes", () => {
  it("Navigate to classes", () => {
    cy.visit("/classes")
  })

  it("Create many classes", () => {
    const create = (weaponClass) => {
      cy.getById("classesOpenCreateDialogButton").click()
      cy.getById("classesFormInputNumber").type(weaponClass.number)
      cy.getById("classesFormInputName").type(weaponClass.name)
      cy.getById("classesFormSelectCategory").click()
      cy.getById(`classesFormSelectCategoryValue${weaponClass.category.replace(/\s/g, '')}`).click()
      cy.getById("classesFormSelectCondition").click()
      cy.getById(`classesFormSelectConditionValue${weaponClass.condition.replace(/\s/g, '')}`).click()
      cy.getById("classesFormInputDistance").type(weaponClass.distance)
      cy.getById("classesCreateDialogFormButtonSubmit").click()
      cy.getById("classesListTable").contains(weaponClass.number)
      cy.getById("classesListTable").contains(weaponClass.name)
      cy.getById("classesListTable").contains(weaponClass.category)
      cy.getById("classesListTable").contains(weaponClass.condition)
    }

    for(let i = 0; i < classesFixture.length; i++) {
      const f = randomArrayItemUtil(classesFixture)
      create({ ...f, name: `${i} - ${f.name}` })
    }
  })

  it("Delete one class", () => {
    cy.getById("classesListTableRowDropdown").first().click({ force: true })
    cy.getById("classesListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-mesage-box .el-button--primary").click({ force: true })
  })

  it("Edit one class", () => {
    cy.wait(200)
    const number = "123 (updated)"
    const name = "Nuclear Warhead (updated)"
    cy.getById("classesListTableRowDropdown").first().click({ force: true })
    cy.getById("classesListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("classesFormInputNumber").clear().type(number)
    cy.getById("classesFormInputName").clear().type(name)
    cy.getById("classesEditDialogFormButtonSubmit").click()
    cy.getById("classesListTable").contains(number)
    cy.getById("classesListTable").contains(name)
  })

  it("Delete many classes", () => {
    cy.get(".el-checkbox").first().click({ force: true })
    cy.getById("classesListTableRowDropdownRemoveMany").click({ force: true })
    cy.get(".el-mesage-box .el-button--primary").click({ force: true })
  })
})
