import { clubsFixture } from "../../../src/fixtures"
import { randomArrayItemUtil } from "../../../src/utils"

const inputClubsForm = (club) => {
  if(club.name) {
    cy.getById("clubsFormNameInput")
      .type(club.name)
  }
  if(club.shortName) {
    cy.getById("clubsFormShortNameInput")
      .type(club.shortName)
  }
  if(club.leader) {
    cy.getById("clubsFormLeaderInput")
      .type(club.leader)
  }
  if(club.emailAddress) {
    cy.getById("clubsFormEmailAddressInput")
      .type(club.emailAddress)
  }
  if(club.phoneNumber) {
    cy.getById("clubsFormPhoneNumberInput")
      .type(club.phoneNumber)
  }
  if(club.address) {
    cy.getById("clubsFormAddressInput")
      .type(club.address)
  }
  if(club.area) {
    cy.getById("clubsFormAreaInput")
      .type(club.area)
  }
  if(club.country) {
    cy.pickFromSelect("clubsFormCountrySelect", club.country)
  }
  if(club.websiteUrl) {
    cy.getById("clubsFormWebsiteUrlInput")
      .type(club.websiteUrl)
  }
}

describe("clubs.list", () => {
  beforeEach(() => {
    cy.visit("/clubs")
    cy.startup()
  })

  it("Search", () => {
    const club = randomArrayItemUtil(clubsFixture)
    cy.searchTable(
      club.name,
      "clubsSearchFilterInput",
      "clubsListTable"
    )
  })

  it("Create club", () => {
    const club = {
      name: "Test klubb",
      shortName: "TKB",
      area: "0258, Oslo",
      country: "Norge"
    }
    cy.getById("clubsCreateDialogOpenButton")
      .click()
    inputClubsForm(club)
    cy.getById("clubsCreateDialogButtonSubmit")
      .click({ force: true })
    cy.getById("clubsListTable")
      .contains(club.name)
    cy.getById("clubsListTable")
      .contains(club.area)
  })

  it("Delete club", () => {
    cy.getById("clubsListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("clubsListTableRowDropdownRemoveOne")
      .first()
      .click({ force: true })
    cy.acceptConfirmation()
  })

  it("Edit club", () => {
    const club = {
      name: "Updated club",
      area: "1000, Sted"
    }
    cy.getById("clubsListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("clubsListTableRowDropdownOpenEditDialog")
      .first()
      .click({ force: true })
    inputClubsForm(club)
    cy.getById("clubsEditDialogSubmitButton")
      .click()
    cy.getById("clubsListTable")
      .contains(club.name)
    cy.getById("clubsListTable")
      .contains(club.area)
  })
})
