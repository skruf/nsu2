import { eventsFixture } from "../../src/fixtures"

const event = eventsFixture[1]

describe("events.view", () => {
  beforeEach(() => {
    cy.visit(`/events/${event.id}`)
    cy.startup()
  })

  it("Screen contains details", () => {
    cy.contains(event.title)
    cy.contains(event.startsAt)
    cy.contains(event.endsAt)
  })

  it.skip("Print details", () => {
    cy.wait(10000)
    cy.getById("eventsPrintButton")
      .click()
  })

  it("Edit event from dropdown", () => {
    const title = "Test event"
    cy.getById("eventsViewDropdown")
      .click()
    cy.getById("eventsViewDropdownOpenEditDialog")
      .click()
    cy.inputEventsForm({ title })
    cy.getById("eventsEditDialogSubmitButton")
      .click()
    cy.contains(event.title)
  })

  // @TODO: add event delete
})
