import { eventsFixture } from "../../../src/fixtures"

const event = eventsFixture[1]

describe("events.view.contestants", () => {
  beforeEach(() => {
    cy.visit(`/events/${event.id}`)
    cy.startup()
    cy.wait(2500)
  })

  it("Group by", () => {
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

  it.only("Should be able to add a contestant to an event", () => {
    const selectMember = () => {
      cy.getById("eventsContestantsManagerDialogSelectClubListItem")
        .random()
        .click()
      cy.wait(500)
      cy.getById("eventsContestantsManagerDialogSelectClubMemberListItem")
        .random()
        .click()
      cy.wait(500)
    }

    const addWeapon = () => {
      cy.getById("eventsContestantsManagerDialogAddWeaponButton")
        .click()
      cy.getById("eventsContestantsManagerDialogWeaponsFormIdSelect")
        .last()
        .click()
      cy.get(".v-list-item--link")
        .random()
        .click()
      cy.getById("eventsContestantsManagerDialogWeaponsFormCalibreInput")
        .last()
        .type(`${Math.floor(Math.random() * 50)}`)
    }

    cy.getById("eventsContestantsListTableOpenManageDialogButton").click()
    selectMember()
    addWeapon()
    cy.getById("eventsContestantsManagerDialogSubmit").click()
  })
})
