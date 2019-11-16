import {
  clubsFixture,
  clubsMembersFixture
} from "../../src/app/fixtures"
import { randomArrayItemUtil } from "../../src/app/utils"

describe("clubs.members", () => {
  it("Navigate to clubs", () => {
    cy.visit("/clubs")
  })

  it("Create a club", () => {
    const f = randomArrayItemUtil(clubsFixture)
    cy.getById("clubsOpenCreateDialogButton").click()
    cy.getById("clubsCreateDialogFormInputName").type(f.name)
    cy.getById("clubsCreateDialogFormInputArea").type(f.area)
    cy.getById("clubsCreateDialogFormSelectCountry").click()
    cy.getById(`clubsCreateDialogFormSelectCountryValue${f.country}`).click()
    cy.getById("clubsCreateDialogFormButtonSubmit").click()
  })

  it("Navigate to club", () => {
    cy.getById("clubsListTableNameCellContent").first().click()
  })

  it("Create many club members", () => {
    const create = (member) => {
      cy.getById("clubsMembersOpenCreateDialogButton").click()
      cy.getById("clubsMembersCreateDialogFormInputFirstName").type(member.firstName)
      cy.getById("clubsMembersCreateDialogFormInputLastName").type(member.lastName)
      cy.getById("clubsMembersCreateDialogFormInputEmailAddress").type(member.emailAddress)
      cy.getById("clubsMembersCreateDialogFormButtonSubmit").click()
    }

    for(let i = 0; i < 20; i++) {
      const f = randomArrayItemUtil(clubsMembersFixture)
      create(f)
    }
  })

  it("Delete one club member", () => {
    cy.getById("clubsMembersListTableRowDropdown").last().click({ force: true })
    cy.getById("clubsMembersListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit one club", () => {
    cy.wait(200)
    const firstNameUpdated = "Andreas"
    const lastNameUpdated = " Nilsen (updated)"
    const emailAddressUpdated = "updated@email.com"
    cy.getById("clubsMembersListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsMembersListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("clubsMembersEditDialogFormInputFirstName").clear().type(firstNameUpdated)
    cy.getById("clubsMembersEditDialogFormInputLastName").clear().type(lastNameUpdated)
    cy.getById("clubsMembersEditDialogFormInputEmailAddress").clear().type(emailAddressUpdated)
    cy.getById("clubsMembersEditDialogFormButtonSubmit").click()
    cy.getById("clubsMembersListTable").contains(firstNameUpdated)
    cy.getById("clubsMembersListTable").contains(lastNameUpdated)
    cy.getById("clubsMembersListTable").contains(emailAddressUpdated)
  })

  it("Delete many clubs", () => {
    cy.get(".el-checkbox").first().click()
    cy.getById("clubsMembersListTableRowDropdownRemoveMany").click({ force: true })
    cy.get(".el-message-box .el-button--primary").click({ force: true })
  })
})
