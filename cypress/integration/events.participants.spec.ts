import randomArrayItemUtil from "../../src/app/utils/randomArrayItem.util"
import {
  eventsFixture,
  eventsCategoriesFixture,
  classesFixture,
  rangesFixture,
  clubsFixture,
  clubsMembersFixture
} from "../../src/app/fixtures"

describe("events.participants", () => {
  it("Open app", () => {
    cy.visit("http://localhost:1234")
  })

  it("Create class", () => {
    const weaponClass = randomArrayItemUtil(classesFixture)
    const weaponCategory = weaponClass.category.replace(/\s/g, '')
    const weaponCondition = weaponClass.condition.replace(/\s/g, '')
    cy.getById("classesMenuItem").click({ force: true })
    cy.getById("classesOpenCreateDialogButton").click()
    cy.getById("classesCreateDialogFormInputNumber").type(weaponClass.number)
    cy.getById("classesCreateDialogFormInputName").type(weaponClass.name)
    cy.getById("classesCreateDialogFormSelectCategory").click()
    cy.getById(`classesCreateDialogFormSelectCategoryValue${weaponCategory}`).click()
    cy.getById("classesCreateDialogFormSelectCondition").click()
    cy.getById(`classesCreateDialogFormSelectConditionValue${weaponCondition}`).click()
    cy.getById("classesCreateDialogFormButtonSubmit").click()
  })

  it("Create range", () => {
    const range = randomArrayItemUtil(rangesFixture)
    cy.getById("rangesMenuItem").click({ force: true })
    cy.getById("rangesOpenCreateDialogButton").click()
    cy.getById("rangesCreateDialogFormInputName").type(range.name)
    cy.getById("rangesCreateDialogFormInputArea").type(range.area)
    cy.getById("rangesCreateDialogFormSelectCountry").click()
    cy.getById(`rangesCreateDialogFormSelectCountryValue${range.country}`).click()
    cy.getById("rangesCreateDialogFormSelectType").click()
    cy.getById(`rangesCreateDialogFormSelectTypeValue${range.type}`).click()
    cy.getById("rangesCreateDialogFormButtonSubmit").click()
  })

  it("Create club", () => {
    const club = randomArrayItemUtil(clubsFixture)
    cy.getById("clubsMenuItem").click({ force: true })
    cy.getById("clubsOpenCreateDialogButton").click()
    cy.getById("clubsCreateDialogFormInputName").type(club.name)
    cy.getById("clubsCreateDialogFormInputArea").type(club.area)
    cy.getById("clubsCreateDialogFormSelectCountry").click()
    cy.getById(`clubsCreateDialogFormSelectCountryValue${club.country}`).click()
    cy.getById("clubsCreateDialogFormButtonSubmit").click()
  })

  it("Create club members", () => {
    cy.getById("clubsListTableNameCellContent").first().click()
    const create = (member) => {
      cy.getById("clubsMembersOpenCreateDialogButton").click()
      cy.getById("clubsMembersCreateDialogFormInputFirstName").type(member.firstName)
      cy.getById("clubsMembersCreateDialogFormInputLastName").type(member.lastName)
      cy.getById("clubsMembersCreateDialogFormInputEmailAddress").type(member.emailAddress)
      cy.getById("clubsMembersCreateDialogFormButtonSubmit").click()
    }
    for(let i = 0; i < 5; i++) {
      create(randomArrayItemUtil(clubsMembersFixture))
    }
  })

  it("Create event category", () => {
    const category = randomArrayItemUtil(eventsCategoriesFixture)
    cy.getById("eventsCategoriesMenuItem").click({ force: true })
    cy.getById("eventsCategoriesOpenCreateDialogButton").click()
    cy.getById("eventsCategoriesCreateDialogFormInputName").type(category.name)
    cy.getById("eventsCategoriesCreateDialogFormButtonSubmit").click()
  })

  it("Create events", () => {
    const event = randomArrayItemUtil(eventsFixture)
    // const eventCategory = event.category.name.replace(/\s/g, '')
    cy.getById("eventsAllMenuItem").click({ force: true })
    cy.getById("eventsOpenCreateDialogButton").click()
    cy.getById("eventsCreateDialogFormInputTitle").type(event.title)
    cy.getById("eventsCreateDialogFormDatePickerDates").click()
    cy.get(".available").first().click()
    cy.get(".available").last().click()
    cy.getById("eventsCreateDialogFormSelectCategory").click()
    cy.getById(`eventsCreateDialogFormSelectCategoryValueVerdensmesterskap`).first().click()
    cy.getById("eventsCreateDialogFormButtonSubmit").click()
  })

  it("Add participants to event", () => {
    cy.getById("eventsListTableTitleCellContent").first().click()
  })
})
