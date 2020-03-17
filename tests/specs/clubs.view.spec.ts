import {
  clubsFixture,
  clubsMembersFixture
} from "../../src/fixtures"
// import { randomArrayItemUtil } from "../../../src/utils"

const club = clubsFixture[0]
const member = clubsMembersFixture
  .find(({ clubId }) => clubId === club.id)

describe("clubs.view", () => {
  beforeEach(() => {
    cy.visit(`/clubs/${club.id}`)
    cy.startup()
    cy.seed("clubs", clubsFixture)
    cy.seed("clubs_members", clubsMembersFixture)
  })

  it("Details", () => {
    cy.contains(club.name)
    cy.contains(club.area)
    cy.contains(club.streetAddress)
    cy.contains(club.leaderFullName)
    cy.contains(club.country)
  })

  it("Search", () => {
    cy.searchTable(
      member.firstName,
      "clubsMembersSearchFilterInput",
      "clubsMembersListTable"
    )
  })

  it("Create club member", () => {
    cy.getById("clubsMembersCreateDialogOpenButton")
      .click()
    cy.getById("clubsMembersFormFirstNameInput")
      .type(member.firstName)
    cy.getById("clubsMembersFormLastNameInput")
      .type(member.lastName)
    cy.getById("clubsMembersFormEmailAddressInput")
      .type(member.emailAddress)
    cy.getById("clubsMembersFormCountrySelect")
      .click({ force: true })
    cy.get(".v-menu__content .v-list-item")
      .first()
      .click({ force: true })
    cy.getById("clubsMembersCreateDialogSubmitButton")
      .click()
    cy.getById("clubsMembersListTable")
      .contains(member.firstName)
    cy.getById("clubsMembersListTable")
      .contains(member.lastName)
    cy.getById("clubsMembersListTable")
      .contains(member.emailAddress)
  })

  it("Delete club member", () => {
    cy.getById("clubsMembersListTableRowDropdown")
      .last()
      .click({ force: true })
    cy.getById("clubsMembersListTableRowDropdownRemoveOne")
      .first()
      .click({ force: true })
    cy.acceptConfirmation()
  })

  it("Edit club member", () => {
    const firstNameUpdated = "Andreas"
    const lastNameUpdated = " Nilsen (updated)"
    const emailAddressUpdated = "updated@email.com"
    cy.getById("clubsMembersListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("clubsMembersListTableRowDropdownOpenEditDialog")
      .first()
      .click({ force: true })
    cy.getById("clubsMembersFormFirstNameInput")
      .clear()
      .type(firstNameUpdated)
    cy.getById("clubsMembersFormLastNameInput")
      .clear()
      .type(lastNameUpdated)
    cy.getById("clubsMembersFormEmailAddressInput")
      .clear()
      .type(emailAddressUpdated)
    cy.getById("clubsMembersEditDialogSubmitButton")
      .click()
    cy.getById("clubsMembersListTable")
      .contains(firstNameUpdated)
    cy.getById("clubsMembersListTable")
      .contains(lastNameUpdated)
    cy.getById("clubsMembersListTable")
      .contains(emailAddressUpdated)
  })
})
