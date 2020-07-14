import {
  clubsFixture,
  clubsMembersFixture
} from "../../src/fixtures"

const inputClubsMembersForm = (member) => {
  cy.getById("firstNameInput")
    .clear()
    .type(member.firstName)
  cy.getById("lastNameInput")
    .clear()
    .type(member.lastName)
  cy.getById("emailAddressInput")
    .clear()
    .type(member.emailAddress)
  cy.pickFromSelect("countrySelect", member.country)
}

const club = clubsFixture[0]

describe("clubs.view", () => {
  before(() => {
    cy.startup()
    cy.seed("clubs", [ club ])
    cy.seed("clubs_members", clubsMembersFixture)
    cy.visit(`/clubs/${club.id}`)
  })

  it("Details", () => {
    cy.contains(club.name)
    cy.contains(club.area)
    cy.contains(club.streetAddress)
    cy.contains(club.leaderFullName)
    cy.contains(club.country)
  })

  it("Search", () => {
    const member = clubsMembersFixture
      .find(({ clubId }) => clubId === club.id)
    cy.searchTable(
      member.firstName,
      "clubsMembersSearchFilterInput",
      "clubsMembersListTable"
    )
  })

  it("Delete club member", () => {
    cy.getById("clubsMembersListTableRowDropdown")
      .last()
      .click()
    cy.getById("clubsMembersListTableRowDropdownRemoveOne")
      .first()
      .click()
    cy.getById("confirmAgree")
      .click()
  })

  it("Create club member", () => {
    const member = {
      firstName: "Roger",
      lastName: "Hansen",
      emailAddress: "roger@hansen.com"
    }
    cy.getById("clubsMembersCreateDialogOpenButton")
      .click()
    cy.getById("clubsMembersCreateDialogForm")
      .within(() => {
        inputClubsMembersForm(member)
      })
    cy.getById("clubsMembersCreateDialogSubmitButton")
      .click()
    cy.getById("clubsMembersListTable")
      .contains(member.firstName)
    cy.getById("clubsMembersListTable")
      .contains(member.lastName)
    cy.getById("clubsMembersListTable")
      .contains(member.emailAddress)
  })

  it("Edit club member", () => {
    const member = {
      firstName: "Andreas",
      lastName: "Nilsen (updated)",
      emailAddress: "updated@email.com"
    }
    cy.getById("clubsMembersListTableRowDropdown")
      .first()
      .click()
    cy.getById("clubsMembersListTableRowDropdownOpenEditDialog")
      .first()
      .click()
    cy.getById("clubsMembersEditDialogForm")
      .within(() => {
        inputClubsMembersForm(member)
      })
    cy.getById("clubsMembersEditDialogSubmitButton")
      .click()
    cy.getById("clubsMembersListTable")
      .contains(member.firstName)
    cy.getById("clubsMembersListTable")
      .contains(member.lastName)
    cy.getById("clubsMembersListTable")
      .contains(member.emailAddress)
  })
})
