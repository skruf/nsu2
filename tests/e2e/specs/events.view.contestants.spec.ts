import { eventsFixture } from "../../../src/fixtures"

const event = eventsFixture[1]

describe("events.view.contestants", () => {
  beforeEach(() => {
    cy.visit(`/events/${event.id}`)
    cy.startup()
    cy.wait(5000)
  })

  it.only("Group by", () => {
    cy.getById("eventsContestantsTableGroupByContestantButton").click()
    cy.getById("eventsContestantsTableGroupByContestantTd")
      .should("be.visible")

    cy.getById("eventsContestantsTableGroupByDivisionButton").click()
    cy.getById("eventsContestantsTableGroupByDivisionTd")
      .should("be.visible")

    cy.getById("eventsContestantsTableGroupByNoneButton").click()
    cy.getById("eventsContestantsTableGroupByContestantTd")
      .should("not.be.visible")
    cy.getById("eventsContestantsTableGroupByDivisionTd")
      .should("not.be.visible")
  })

  it("Should be able to add a contestant to an event", () => {
    cy.getById("eventsContestantsListTableOpenManageDialogButton").click()
    cy.getById("eventsContestantsManagerDialogSelectClubListItem").first().click()
    cy.getById("eventsContestantsManagerDialogSelectClubMemberListItem").first().click({ force: true })
    cy.getById("eventsContestantsManagerDialogAddWeaponButton").click()
    cy.getById("eventsContestantsManagerDialogWeaponsFormIdSelect").click()
    cy.get(".v-list-item--link").first().click()
    cy.getById("eventsContestantsManagerDialogWeaponsFormCalibreInput").type("99")
    cy.getById("eventsContestantsManagerDialogSubmit").click()
  })
})
