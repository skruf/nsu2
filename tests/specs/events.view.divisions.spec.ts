import { randomArrayItemUtil } from "../../src/utils"
import {
  eventsFixture,
  eventsDivisionsFixture
} from "../../src/fixtures"

const event = eventsFixture[1]

describe("events.view.divisions", () => {
  beforeEach(() => {
    cy.visit(`/events/${event.id}`)
    cy.startup()
    cy.getById("eventsViewScreenTabsDivisionsTab")
      .click()
  })

  it("Create division", () => {
    const division = {
      id: "7",
      day: "2020-02-25",
      startsAt: "21:00",
      distance: 25,
      standsCount: 2,
      eventId: event.id,
      autoAssign: true
    }

    cy.getById("eventsDivisionsSelectDivisionId")
      .click({ force: true })
    cy.getById("eventsDivisionsCreateDialogOpenButton")
      .click()
    // cy.pickFromDatePicker("eventsDivisionsFormDayInput", division.day)
    cy.getById("eventsDivisionsFormStartsAtInput")
      .type(division.startsAt)
    cy.getById("eventsDivisionsFormDistanceInput")
      .clear()
      .type(`${division.distance}`)
    cy.getById("eventsDivisionsFormStandsCountInput")
      .clear()
      .type(`${division.standsCount}`)
    cy.getById("eventsDivisionsCreateDialogSubmitButton")
      .click()

    cy.getById("eventsDivisionsSelectItem")
      .contains(division.day.split("-").reverse().join("/"))
    cy.getById("eventsDivisionsSelectItem")
      .contains(division.startsAt)
  })

  it("Edit division", () => {
    const divisionUpdates = {
      day: "2020-05-05",
      startsAt: "20:00",
      standsCount: "20",
      distance: "50"
    }

    cy.getById("eventsDivisionsSelectDivisionId")
      .click({ force: true })
    cy.getById("eventsDivisionsSelectDropdown")
      .first()
      .click()
    cy.getById("eventsDivisionsEditDialogOpen")
      .click()
    // cy.pickFromDatePicker("eventsDivisionsFormDayInput", divisionUpdates.day)
    cy.getById("eventsDivisionsFormStartsAtInput")
      .type(divisionUpdates.startsAt)
    cy.getById("eventsDivisionsFormDistanceInput")
      .clear()
      .type(divisionUpdates.distance)
    cy.getById("eventsDivisionsFormStandsCountInput")
      .clear()
      .type(divisionUpdates.standsCount)
    cy.getById("eventsDivisionsEditDialogSubmitButton")
      .click()

    cy.getById("eventsDivisionsSelectItem")
      .contains(divisionUpdates.day.split("-").reverse().join("/"))
    cy.getById("eventsDivisionsSelectItem")
      .contains(divisionUpdates.startsAt)
  })

  it.skip("Remove one division", () => {
    cy.getById("eventsDivisionsSelectDivisionId")
      .click({ force: true })
    const count = Cypress.$('data-testid="eventsDivisionsSelectItem"').length
    cy.getById("eventsDivisionsSelectDropdown")
      .first()
      .click()
    cy.getById("eventsDivisionsRemoveOne")
      .click()
    cy.acceptConfirmation()
    cy.getById("eventsDivisionsSelectItem")
      .should("have.length", count - 1)
    // @TODO: bugfix division filter after removal..
  })

  it("Search un-assigned", () => {
    const clubMemberFirstname = "Shawn"
    cy.getById("unAssignedSearchFilter")
      .type(clubMemberFirstname)
    cy.getById("unAssignedContestant")
      .contains(clubMemberFirstname)
  })

  it("Edit assigned contestant", () => {
    const newWeaponName = "Colt"
    cy.getById("assignedContestantCell")
      .first()
      .click()
    cy.pickFromSelect("eventsContestantsFormWeaponIdSelect", newWeaponName)
    cy.getById("eventsContestantsEditDialogButtonSubmit")
      .click()
    cy.getById("assignedContestantCell")
      .first()
      .contains(newWeaponName)
  })

  it("Edit un-assigned contestant", () => {
    // @TODO: assert stand/time when moved between divisions
    cy.getById("unAssignedContestant")
      .first()
      .click()
    cy.pickFromSelect("eventsContestantsFormDivisionIdSelect", "{downArrow}")
    cy.getById("eventsContestantsEditDialogButtonSubmit")
      .click()

    // cy.getById("unAssignedContestant")
    //   .first()
    //   .contains(newWeaponName)
  })

  it.only("Print division", () => {
    cy.getById("divisionsSchedulerPrintScheduleButton")
      .click()
  })

  // @TODO: eventsContestantsEditDialogOpen
  // @TODO: eventsContestantsCreateDialogOpen

  // it("Assign contestant", () => {
  //   cy.wait(1000)

  //   cy.getById("unAssignedContestant")
  //     .first()
  //     // .trigger("dragover")
  //     .trigger("dragstart")

  //   cy.getById("addContestantCell")
  //     .first()
  //     // .trigger("dragover")
  //     .trigger("drop")
  //     .trigger("dragend")
  // })

  // it.only("Un-assign contestant", () => {
  //   cy.getById("assignedContestantCell")
  //     .first()
  //     // .trigger("dragover")
  //     .trigger("dragstart")
  //   cy.getById("removeContestantOverlay")
  //     // .trigger("dragover")
  //     .trigger("drop")
  //     .trigger("dragend")
  // })

  // it.only("Swap assigned contestant", () => {
  //   // cy.wait(1000)
  //   // .trigger("dragover")
  //   // .trigger("dragover")
  //   const dataTransfer = new DataTransfer()
  //   dataTransfer.dropEffect = "move"
  //   dataTransfer.effectAllowed = "move"

  //   cy.getById("assignedContestantCell").first()
  //     .trigger("mousedown")
  //     .trigger("dragstart", { dataTransfer })
  //     .trigger("dragover", { dataTransfer })
  //     .getById("assignedContestantCell").last()
  //     .trigger("dragenter", { dataTransfer })
  //     .trigger("dragover", { dataTransfer })
  //     .trigger("drop")
  //     .trigger("dragend")
  // })

  // it.only("Swap assigned contestant", () => {
  //   // cy.wait(1000)
  //   const draggable = Cypress.$(".contestant-cell")[0]
  //   const coords = Cypress.$(".contestant-cell")[1].getBoundingClientRect()

  //   console.log(coords)

  //   draggable.dispatchEvent(new MouseEvent("mousedown"))
  //   draggable.dispatchEvent(new MouseEvent("mousemove", {
  //     clientX: 10, clientY: 0
  //   }))
  //   draggable.dispatchEvent(new MouseEvent("mousemove", {
  //     clientX: coords.x + 10,
  //     clientY: coords.y + 10
  //   }))
  //   draggable.dispatchEvent(new MouseEvent("mouseup"))

  //   // cy.getById("assignedContestantCell")
  //   //   .last()
  //   //   // .trigger("dragover")
  //   //   .trigger("drop")
  //   //   .trigger("dragend")
  // })

  // it("Un-assigned to assigned", () => {
  //   cy.getById("unAssignedContestant")
  //     .first()
  //     .trigger("dragstart")
  //   cy.getById("assignedContestantCell")
  //     .first()
  //     .trigger("drop")
  // })
})
