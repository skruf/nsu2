import {
  clubsFixture,
  clubsMembersFixture
} from "../../../src/fixtures"
import { randomArrayItemUtil } from "../../../src/utils"

describe("clubs.members", () => {
  beforeEach(() => {
    cy.visit(`/#clubs/${clubsFixture[0].id}`)
  })

  it("Create club member", () => {
    const member = randomArrayItemUtil(clubsMembersFixture)
    cy.getById("clubsMembersOpenCreateDialogButton").click()
    cy.getById("clubsMembersFormInputFirstName").type(member.firstName)
    cy.getById("clubsMembersFormInputLastName").type(member.lastName)
    cy.getById("clubsMembersFormInputEmailAddress").type(member.emailAddress)
    cy.getById("clubsMembersCreateDialogButtonSubmit").click()
  })

  it("Delete club member", () => {
    cy.getById("clubsMembersListTableRowDropdown").last().click({ force: true })
    cy.getById("clubsMembersListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit club member", () => {
    cy.wait(200)
    const firstNameUpdated = "Andreas"
    const lastNameUpdated = " Nilsen (updated)"
    const emailAddressUpdated = "updated@email.com"
    cy.getById("clubsMembersListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsMembersListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("clubsMembersFormInputFirstName").clear().type(firstNameUpdated)
    cy.getById("clubsMembersFormInputLastName").clear().type(lastNameUpdated)
    cy.getById("clubsMembersFormInputEmailAddress").clear().type(emailAddressUpdated)
    cy.getById("clubsMembersEditDialogButtonSubmit").click()
    cy.getById("clubsMembersListTable").contains(firstNameUpdated)
    cy.getById("clubsMembersListTable").contains(lastNameUpdated)
    cy.getById("clubsMembersListTable").contains(emailAddressUpdated)
  })
})
