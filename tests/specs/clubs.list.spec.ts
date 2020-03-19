import { randomArrayItemUtil } from "../../src/utils"
import { clubsFixture } from "../../src/fixtures"

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
  before(() => {
    cy.startup()
    cy.seed("clubs", clubsFixture)
    cy.visit("/#/clubs")
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
    cy.getById("clubsCreateDialogForm")
      .within(() => {
        inputClubsForm(club)
      })
    cy.getById("clubsCreateDialogButtonSubmit")
      .click()
    cy.getById("clubsListTable")
      .contains(club.name)
    cy.getById("clubsListTable")
      .contains(club.area)
  })

  it("Delete club", () => {
    cy.getById("clubsListTableRowDropdown")
      .first()
      .click()
    cy.getById("clubsListTableRowDropdownRemoveOne")
      .first()
      .click()
    cy.getById("confirmAgree")
      .click()
  })

  it("Edit club", () => {
    const club = {
      name: "Updated club",
      area: "1000, Sted"
    }
    cy.getById("clubsListTableRowDropdown")
      .first()
      .click()
    cy.getById("clubsListTableRowDropdownOpenEditDialog")
      .first()
      .click()
    cy.getById("clubsEditDialogForm")
      .within(() => {
        inputClubsForm(club)
      })
    cy.getById("clubsEditDialogSubmitButton")
      .click()
    cy.getById("clubsListTable")
      .contains(club.name)
    cy.getById("clubsListTable")
      .contains(club.area)
  })
})
