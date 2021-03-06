import { eventsFixture } from "../../src/fixtures"
const event = eventsFixture[1]

describe("events.view.results", () => {
  beforeEach(() => {
    cy.visit(`/events/${event.id}`)
    cy.startup()
    cy.getById("eventsViewScreenTabsResultsTab")
      .click()
  })

  it("Group by", () => {
    cy.getById("eventsContestantsResultsTableGroupByWeaponButton")
      .click()
    cy.getById("eventsContestantsResultsTableGroupByWeaponTd")
      .should("be.visible")
    cy.getById("eventsContestantsResultsTableGroupByNoneButton")
      .click()
    cy.getById("eventsContestantsResultsTableGroupByWeaponTd")
      .should("not.be.visible")
  })

  it("Filters", () => {
    cy.pickFromSelect("eventsContestantsResultsListTableFilterWeapon", "Colt")
      .type("{enter}", { force: true })
    cy.getById("eventsContestantsResultsListTable")
      .contains("Colt")
  })

  it("Set results", () => {
    cy.getById("eventsContestantsResultsInputDialogOpen")
      .first()
      .click()
    cy.getById("ResultsFormButtonsSumButton1-2").click()
    cy.getById("ResultsFormButtonsSumButton2-3").click()
    cy.getById("ResultsFormButtonsSumButton3-1").click()
    cy.getById("ResultsFormButtonsSumButton4-5").click()
    cy.getById("ResultsFormButtonsSumButton5-5").click()
    cy.getById("ResultsFormButtonsSumButton6-8").click()
    cy.getById("ResultsFormButtonsSumButton7-4").click()
    cy.getById("ResultsFormButtonsSumButton8-10").click()
    cy.getById("ResultsFormButtonsSumButton9-2").click()
    cy.getById("ResultsFormButtonsSumButton10-7").click()
    cy.getById("ResultsFormButtonsSumButton11-9").click()
    cy.getById("ResultsFormButtonsSumButton12-9").click()
    cy.getById("ResultsFormButtonsSumButton13-4").click()
    cy.getById("eventsContestantsResultsInputDialogSubmit")
      .click()
    cy.getById("eventsContestantsResultsListTable")
      .contains("64")
  })

  it("Create note", () => {
    const note = "Dette er en test"
    cy.getById("eventsContestantsResultsNotesOpenButton")
      .first()
      .click()
    cy.getById("eventsContestantsResultsNotesNewInput")
      .type(note)
    cy.getById("eventsContestantsResultsNotesSubmitNewButton")
      .click()
    cy.getById("eventsContestantsResultsNotesList")
      .contains(note)
  })

  it("Edit note", () => {
    const note = "Dette er enda en test"
    cy.getById("eventsContestantsResultsNotesOpenButton")
      .first()
      .click()
    cy.getById("eventsContestantsResultsNotesListItem")
      .first()
      .click()
    cy.getById("eventsContestantsResultsNotesEditInput")
      .clear()
      .type(note)
    cy.getById("eventsContestantsResultsNotesSubmitEditButton")
      .click()
    cy.getById("eventsContestantsResultsNotesList")
      .contains(note)
  })

  it("Delete note", () => {
    const note = "testest"
    cy.getById("eventsContestantsResultsNotesOpenButton")
      .first()
      .click()
    cy.getById("eventsContestantsResultsNotesListItem")
      .first()
      .click()
    cy.getById("eventsContestantsResultsNotesDeleteButton")
      .click()
    cy.getById("eventsContestantsResultsNotesList")
      .not(note)
  })
})
