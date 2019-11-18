import { clubsFixture } from "../../../src/fixtures"
import { randomArrayItemUtil } from "../../../src/utils"

describe("clubs", () => {
  beforeEach(() => {
    cy.visit("/#clubs")
  })

  it("Create club", () => {
    const club = randomArrayItemUtil(clubsFixture)

    cy.getById("clubsOpenCreateDialogButton").click()

    cy.getById("clubsFormInputName").type(club.name)
    cy.getById("clubsFormInputShortName").type(club.shortName)

    if(club.leader) cy.getById("clubsFormInputLeader").type(club.leader)
    if(club.emailAddress) cy.getById("clubsFormInputEmailAddress").type(club.emailAddress)
    if(club.phoneNumber) cy.getById("clubsFormInputPhoneNumber").type(club.phoneNumber)
    if(club.address) cy.getById("clubsFormInputAddress").type(club.address)

    cy.getById("clubsFormInputArea").type(club.area)
    cy.getById("clubsFormSelectCountry").click()
    cy.getById(`clubsFormSelectCountryValue${club.country.replace(/\s/g, '')}`).click()

    if(club.website) cy.getById("clubsFormInputWebsite").type(club.website)

    cy.getById("clubsCreateDialogFormButtonSubmit").click()
    cy.getById("clubsListTable").contains(club.name)
    cy.getById("clubsListTable").contains(club.area)
  })

  it("Delete club", () => {
    cy.getById("clubsListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit club", () => {
    cy.wait(200)
    const name = "Test club"
    const area = "1000, Sted"
    cy.getById("clubsListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("clubsFormInputName").clear().type(name)
    cy.getById("clubsFormInputArea").clear().type(area)
    cy.getById("clubsEditDialogFormButtonSubmit").click()
    cy.getById("clubsListTable").contains(name)
    cy.getById("clubsListTable").contains(area)
  })
})
