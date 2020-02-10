import { randomArrayItemUtil } from "../../../src/utils"
import {
  eventsFixture,
  eventsDivisionsFixture
} from "../../../src/fixtures"

const event = eventsFixture[1]

describe("events.view.divisions", () => {
  beforeEach(() => {
    cy.visit(`/events/${event.id}`)
    cy.startup()
    cy.getById("eventsViewScreenTabsDivisionsTab")
      .click()
  })

  it("Create division", () => {
    const division = randomArrayItemUtil(eventsDivisionsFixture)
    cy.getById("eventsDivisionsListTableCreateDialogOpenButton")
      .click()
    cy.getById("eventsDivisionsFormNameInput")
      .type(division.name)
    cy.datePickerPickFirst("eventsDivisionsFormDayInput")
    cy.getById("eventsDivisionsFormTimeInput")
      .type(division.time)
    cy.getById("eventsDivisionsFormDistanceInput")
      .clear()
      .type(division.distance)
    cy.getById("eventsDivisionsFormStandsCountInput")
      .clear()
      .type(division.standsCount)
    cy.getById("eventsDivisionsCreateDialogSubmitButton")
      .click()
  })

  // it.only("Reorder contestants", () => {
  //   cy.getById("eventsDivisionsListTableNameColumn").first().click()
  //   cy.getById("eventsDivisionsContestantsListTableHandle").first()
  //     .trigger("dragstart")
  //   cy.getById("eventsDivisionsContestantsListTableHandle").last()
  //     .trigger("drop")
  // })

  it("Remove contestant", () => {
    // @TODO: update stands
    cy.getById("eventsDivisionsListTableNameColumn")
      .first()
      .click()
    // cy.wait(500)
    cy.getById("eventsDivisionsContestantsTableRowMenuButton")
      .first()
      .click({ force: true })
    cy.getById("eventsDivisionsContestantsRemoveOneListItem")
      .click({ force: true })
    cy.acceptConfirmation()
  })

  it("Edit contestant inside division", () => {
    cy.getById("eventsDivisionsListTableNameColumn")
      .first()
      .click()
    cy.getById("eventsDivisionsContestantsTableRowMenuButton")
      .first()
      .click()
    cy.getById("eventsDivisionsContestantsEditDialogOpenListItem")
      .click()
    cy.getById("eventsContestantsFormCalibreInput")
      .clear()
      .type("1")
    cy.getById("eventsContestantsEditDialogButtonSubmit")
      .click()
  })

  it("Remove contestant from division", () => {
    cy.getById("eventsDivisionsListTableNameColumn")
      .first()
      .click()
    cy.getById("eventsDivisionsContestantsTableRowMenuButton")
      .first()
      .click()
    // @TODO: add confirm
    // @TODO: update stands
    cy.getById("eventsDivisionsContestantsRemoveOneListItem")
      .click({ force: true })
    cy.acceptConfirmation()
  })
})
