import { randomArrayItemUtil } from "../../src/utils"
import {
  eventsFixture,
  eventsCategoriesFixture,
  clubsFixture,
  rangesFixture
} from "../../src/fixtures"

const inputEventsForm = (event) => {
  if(event.title) {
    cy.getById("eventsFormTitleInput")
      .clear()
      .type(event.title)
  }
  if(event.startsAt) {
    cy.getById("eventsFormStartsAtInput")
      .pickDate(event.startsAt)
  }
  if(event.endsAt) {
    cy.getById("eventsFormEndsAtInput")
      .pickDate(event.endsAt)
  }
  if(event.category) {
    cy.pickFromSelect("eventsFormCategorySelect", event.category)
  }
  if(event.organizer) {
    cy.pickFromSelect("eventsFormOrganizerSelect", event.organizer)
  }
  if(event.range) {
    cy.pickFromSelect("eventsFormRangeSelect", event.range)
  }
  if(event.approbated) {
    cy.getById("eventsFormApprobatedSwitch")
      .click({ force: true })
  }
}

const club = clubsFixture[0]
const range = rangesFixture[0]
const category = eventsCategoriesFixture[0]

describe("events.list", () => {
  before(() => {
    cy.startup()
    cy.seed("clubs", [ club ])
    cy.seed("ranges", [ range ])
    cy.seed("events_categories", [ category ])
    cy.seed("events", eventsFixture)
    cy.visit("/#/events")
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
    const event = {
      title: "Test event",
      startsAt: "01.02.2020",
      endsAt: "06.02.2020",
      category: category.name,
      organizer: club.name,
      range: range.name,
      approbated: false
    }
    cy.getById("eventsCreateDialogOpenButton")
      .click()
    cy.getById("eventsCreateDialogForm")
      .within(() => {
        inputEventsForm(event)
      })
    cy.getById("eventsCreateDialogSubmitButton")
      .click()
    cy.getById("eventsListTable")
      .contains(event.title)
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
    cy.getById("eventsEditDialogForm")
      .within(() => {
        inputEventsForm(event)
      })
    cy.getById("eventsEditDialogSubmitButton")
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
    cy.getById("confirmAgree")
      .click()
  })
})
