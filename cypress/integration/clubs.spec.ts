import { clubsFixture } from "../../src/app/fixtures"
import { randomArrayItemUtil } from "../../src/app/utils"

describe("clubs", () => {
  it("Open /clubs", () => {
    cy.visit("/clubs")
  })

  it("Create many clubs", () => {
    const create = (club) => {
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
    }

    for(let i = 0; i < 3; i++) {
      const f = randomArrayItemUtil(clubsFixture)
      create({ ...f, name: `${i} - ${f.name}` })
    }
  })

  it("Delete one club", () => {
    cy.getById("clubsListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsListTableRowDropdownRemoveOne").first().click({ force: true })
    cy.get(".el-message-box .el-button--primary").click()
  })

  it("Edit one club", () => {
    cy.wait(200)
    const name = " updated"
    const area = "1000, Sted"
    cy.getById("clubsListTableRowDropdown").first().click({ force: true })
    cy.getById("clubsListTableRowDropdownOpenEditDialog").first().click({ force: true })
    cy.getById("clubsFormInputName").type(name)
    cy.getById("clubsFormInputArea").type(area)
    cy.getById("clubsEditDialogFormButtonSubmit").click()
    cy.getById("clubsListTable").contains("updated")
    cy.getById("clubsListTable").contains(area)
  })

  it("Delete many clubs", () => {
    cy.get(".el-checkbox").first().click()
    cy.getById("clubsListTableRowDropdownRemoveMany").click({ force: true })
    cy.get(".el-message-box .el-button--primary").click({ force: true })
  })
})
