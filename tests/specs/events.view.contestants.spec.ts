import {
  eventsFixture,
  eventsCategoriesFixture,
  eventsContestantsFixture,
  eventsDivisionsFixture,
  clubsFixture,
  clubsMembersFixture,
  rangesFixture,
  weaponsFixture
} from "../../src/fixtures"

const getEventData = (event) => {
  const weapons = weaponsFixture.filter(
    ({ id }) => eventsContestantsFixture.map(
      ({ weaponId }) => weaponId
    ).includes(id)
  )
  const members = clubsMembersFixture.filter(
    ({ id }) => eventsContestantsFixture.map(
      ({ clubMemberId }) => clubMemberId
    ).includes(id)
  )
  const clubs = clubsFixture.filter(
    ({ id }) => members.map(
      ({ clubId }) => clubId
    ).includes(id)
  )
  const range = rangesFixture.find(
    ({ id }) => id === event.rangeId
  )
  const category = eventsCategoriesFixture.find(
    ({ id }) => id === event.categoryId
  )
  const contestants = eventsContestantsFixture.filter(
    ({ eventId }) => eventId === event.id
  )
  const divisions = eventsDivisionsFixture.filter(
    ({ eventId }) => eventId === event.id
  )

  return {
    weapons,
    members,
    clubs,
    range,
    category,
    contestants,
    divisions
  }
}

const event = eventsFixture[1]
const {
  weapons,
  members,
  clubs,
  range,
  category,
  contestants,
  divisions
} = getEventData(event)

describe("events.view.contestants", () => {
  before(() => {
    cy.startup()
    cy.seed("clubs", clubs)
    cy.seed("clubs_members", members)
    cy.seed("ranges", [ range ])
    cy.seed("weapons", weapons)
    cy.seed("events_categories", [ category ])
    cy.seed("events", eventsFixture)
    cy.seed("events_contestants", contestants)
    cy.seed("events_divisions", divisions)
    cy.visit(`/events/${event.id}`)
    // cy.getById("eventsContestantsListTable")
    // .contains("Laster..")

    cy.get("tbody")
      .its("length")
      .should("be", 1)
    cy.get("tbody")
      .its("length")
      .should("be.gt", 2)

    // cy.getById("eventsContestantsListTable")
    //   .within(() => {
    //     cy.get("tbody tr")
    //       .its("length")
    //       .should("be.gt", 2)
    //   })
  })

  it.skip("Filter", () => {
    cy.getById("eventsContestantsListTableFilterClubMember")
      .click()
    cy.get(".v-menu__content .v-list-item")
      .first()
      .click()
  })

  it.skip("Group by", () => {
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

  it.only("Add contestant to event", () => {
    // .as("waitForData")
    // cy.wait("@waitForData")

    cy.getById("addContestantsToEventButton")
      .click()
    cy.getById("eventsContestantsCreateDialogWeaponsFormIdSelect")
      .click()
    cy.getById("weaponsCreateDialogOpenButton")
      .click()
  })

  // it("Should be able to add a contestant to an event", () => {
  //   const selectMember = () => {
  //     cy.getById("eventsContestantsManagerDialogSelectClubListItem")
  //       .random()
  //       .click()
  //     cy.wait(500)
  //     cy.getById("eventsContestantsManagerDialogSelectClubMemberListItem")
  //       .random()
  //       .click()
  //     cy.wait(500)
  //   }

  //   const addWeapon = () => {
  //     cy.getById("eventsContestantsManagerDialogAddWeaponButton")
  //       .click()
  //     cy.getById("eventsContestantsManagerDialogWeaponsFormIdSelect")
  //       .last()
  //       .click()
  //     cy.get(".v-list-item--link")
  //       .random()
  //       .click()
  //     cy.getById("eventsContestantsManagerDialogWeaponsFormCalibreInput")
  //       .last()
  //       .type(`${Math.floor(Math.random() * 50)}`)
  //   }

  //   cy.getById("eventsContestantsListTableOpenManageDialogButton")
  //     .click()
  //   selectMember()
  //   addWeapon()
  //   cy.getById("eventsContestantsManagerDialogSubmit")
  //     .click()
  // })
})
