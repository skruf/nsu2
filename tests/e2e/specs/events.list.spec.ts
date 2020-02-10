import { randomArrayItemUtil } from "../../../src/utils"
import {
  eventsFixture,
  eventsCategoriesFixture,
  clubsFixture,
  rangesFixture
} from "../../../src/fixtures"

const inputEventsForm = (event) => {
  if(event.title) {
    cy.getById("eventsFormTitleInput")
      .clear()
      .type(event.title)
  }
  if(event.startsAt) {
    cy.pickFromDatePicker("eventsFormStartsAtInput", event.startsAt)
  }
  if(event.endsAt) {
    cy.pickFromDatePicker("eventsFormEndsAtInput", event.endsAt)
  }
  if(event.category) {
    const category = eventsCategoriesFixture.find(
      ({ id }) => id === event.categoryId
    )
    cy.pickFromSelect("eventsFormCategorySelect", category.name)
  }
  if(event.organizer) {
    const organizer = clubsFixture.find(
      ({ id }) => id === event.organizerId
    )
    cy.pickFromSelect("eventsFormOrganizerSelect", organizer.name)
  }
  if(event.range) {
    const range = rangesFixture.find(
      ({ id }) => id === event.rangeId
    )
    cy.pickFromSelect("eventsFormRangeSelect", range.name)
  }
  if(event.approbated) {
    cy.getById("eventsFormApprobatedSwitch")
      .click({ force: true })
  }
}

describe("events.list", () => {
  beforeEach(() => {
    cy.visit("/events")
    cy.startup()
  })

  it("Search", () => {
    const event = randomArrayItemUtil(eventsFixture)
    cy.searchTable(
      event.title,
      "eventsSearchFilterInput",
      "eventsListTable"
    )
  })

  it("Create event", () => {
    // const event = {
    //   title: "Test event",
    //   startsAt: "01.02.2020",
    //   endsAt: "06.02.2020"
    // }

    const event = randomArrayItemUtil(eventsFixture)

    cy.getById("eventsCreateDialogOpenButton")
      .click()
    inputEventsForm(event)
    cy.getById("eventsCreateDialogSubmitButton")
      .click()
    cy.getById("eventsListTable")
      .contains(event.title)
  })

  it("Delete event from table dropdown", () => {
    cy.getById("eventsListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("eventsListTableRowDropdownRemoveOne")
      .first()
      .click({ force: true })
    cy.acceptConfirmation()
  })

  it("Edit event from table dropdown", () => {
    const event = {
      title: "Updated event"
    }
    cy.getById("eventsListTableRowDropdown")
      .first()
      .click({ force: true })
    cy.getById("eventsListTableRowDropdownEditDialogOpen")
      .first()
      .click({ force: true })
    inputEventsForm(event)
    cy.getById("eventsEditDialogSubmitButton")
      .click()
    cy.getById("eventsListTable")
      .contains(event.title)
  })
})
