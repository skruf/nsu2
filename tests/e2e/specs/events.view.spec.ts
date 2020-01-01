import { eventsFixture } from "../../../src/fixtures"

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

  it.only("Print details", () => {
    cy.getById("eventsPrintButton").click()
  })

  // @TODO: add event edit
  // @TODO: add event delete
})
