// import { clubsFixture } from "../../src/app/fixtures"
// import { randomArrayItemUtil } from "../../src/app/utils"

const clubsFixture = [{
  "id" : "",
  "name": "Norske Officerers Pistolklubb",
  "shortName": "NOP",
  "leader": "Jens Berentzen",
  "emailAddress": "svartkrutt@nop.no",
  "phoneNumber": "404 22 404",
  "address": "Postboks 92 Sentrum",
  "area": "0101, Oslo",
  "country": "Norge",
  "website": "https://www.nop.no"
}]

describe("clubs.view.screen", () => {
  beforeEach(() => {
    cy.visit("/#clubs")
  })

  it("Create a club", () => {
    // const f = randomArrayItemUtil(clubsFixture)
    const club = clubsFixture[0]

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

    // cy.getById("clubsFormInputName").type(f.name)
    // cy.getById("clubsFormInputShortName").type(f.shortName)
    // cy.getById("clubsFormInputArea").type(f.area)
    // cy.getById("clubsFormSelectCountry").click()
    // cy.getById(`clubsFormSelectCountryValue${f.country}`).click()

    cy.getById("clubsCreateDialogFormButtonSubmit").click()
  })

  it("Navigate to club", () => {
    cy.getById("clubsListTableNameCellContent").first().click()
  })

  // it("", () => {
  //
  // })

})
