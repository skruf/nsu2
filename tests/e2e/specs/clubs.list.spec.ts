import { clubsFixture } from "../../../src/fixtures"
import { randomArrayItemUtil } from "../../../src/utils"

describe("clubs.list", () => {
  beforeEach(() => {
    cy.visit("/clubs")
    cy.startup()
  })

  it("Search", () => {
    const club = randomArrayItemUtil(clubsFixture)
    cy.getById("clubsSearchFilterInput").type(`${club.name}{enter}`)
    cy.getById("clubsListTable").contains(club.name)
    cy.getById("clubsSearchFilterInput").clear()
  })

  it("Create club", () => {
    const club = randomArrayItemUtil(clubsFixture)
    cy.getById("clubsCreateDialogOpenButton").click()
    cy.getById("clubsFormNameInput").type(club.name)
    cy.getById("clubsFormShortNameInput").type(club.shortName)
    if(club.leader) cy.getById("clubsFormLeaderInput").type(club.leader)
    if(club.emailAddress) cy.getById("clubsFormEmailAddressInput").type(club.emailAddress)
    if(club.phoneNumber) cy.getById("clubsFormPhoneNumberInput").type(club.phoneNumber)
    if(club.address) cy.getById("clubsFormAddressInput").type(club.address)
    cy.getById("clubsFormAreaInput").type(club.area)
    cy.getById("clubsFormCountrySelect").click({ force: true })
    cy.get(".v-list-item").first().click()
    if(club.websiteUrl) cy.getById("clubsFormWebsiteUrlInput").type(club.websiteUrl)
    cy.getById("clubsCreateDialogButtonSubmit").click()
    cy.getById("clubsListTable").contains(club.name)
    cy.getById("clubsListTable").contains(club.area)
  })

  it("Delete club", () => {
    cy.getById("clubsListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit club", () => {
    const name = "Test club"
    const area = "1000, Sted"
    cy.getById("clubsListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("clubsFormNameInput").clear().type(name)
    cy.getById("clubsFormAreaInput").clear().type(area)
    cy.getById("clubsEditDialogSubmitButton").click()
    cy.getById("clubsListTable").contains(name)
    cy.getById("clubsListTable").contains(area)
  })
})
