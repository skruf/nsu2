// @ts-nocheck

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
    cy.getById("eventsContestantsListTable")
      .within(() => {
        cy.get(".v-data-table__progress")
          .should("not.exist")
      })
  })

  it("Group by", () => {
    cy.pickFromSelect("eventsContestantsTableGroupBySelect", "D")
    cy.getById("eventsContestantsTableGroupByContestantTd")
      .should("be.visible")
    cy.get(".table-controls")
      .contains("clear")
      .click()
    cy.getById("eventsContestantsTableGroupByContestantTd")
      .should("not.be.visible")
    cy.getById("eventsContestantsTableGroupByDivisionTd")
      .should("not.be.visible")
    cy.getById("eventsContestantsTableGroupByWeaponTd")
      .should("not.be.visible")
  })

  it("Add contestant to event", () => {
    const member = {
      firstName: "Test",
      lastName: "Testersen",
    }

    const weapon = {
      name: "The atom bomb",
      number: "123",
      category: "Langhold",
      distance: "100 meter"
    }

    const contestant = {
      condition: "Orginal",
      calibre: "9999"
    }

    cy.getById("addContestantsToEventButton")
      .click()
    cy.getById("eventsContestantsManagerSelectMember")
      .click()
    cy.getById("clubsMembersCreateDialogOpenButton")
      .click()
    cy.getById("clubsMembersCreateDialogForm")
      .within(() => {
        cy.getById("clubsMembersFormFirstNameInput")
          .type(member.firstName)
        cy.getById("clubsMembersFormLastNameInput")
          .type(member.lastName)
      })
    cy.getById("clubsMembersCreateDialogSubmitButton")
      .click()
    cy.getById("eventsContestantsCreateDialogMemberSelectItem")
      .first()
      .click()
    cy.getById("eventsContestantsCreateDialogWeaponsFormIdSelect")
      .click()
    cy.getById("weaponsCreateDialogOpenButton")
      .click()
    cy.getById("weaponsFormNumberInput")
      .type(weapon.number)
    cy.getById("weaponsFormNameInput")
      .type(weapon.name)
    cy.pickFromSelect("weaponsFormCategorySelect", weapon.category)
    cy.pickFromSelect("weaponsFormDistanceInput", weapon.distance)
    cy.getById("weaponsCreateDialogSubmitButton")
      .click()
    cy.pickFromSelect("eventsContestantsCreateDialogWeaponsFormConditionSelect", contestant.condition)
    cy.getById("eventsContestantsCreateDialogWeaponsFormCalibreInput")
      .type(contestant.calibre)
    cy.getById("submitContestantButton")
      .click()
    cy.getById("eventsContestantsListTable")
      .and("contain", member.firstName)
      .and("contain", weapon.name)
      .and("contain", contestant.calibre)
  })

  it.skip("Filter", () => {
    cy.getById("eventsContestantsListTableFilterClubMember")
      .click()
    cy.get(".v-menu__content .v-list-item__title")
      .first()
      .then((item) => {
        const i = Cypress.$(item)
        const text = i.text()
        i.click()
        cy.getById("eventsContestantsListTable")
          .within(() => {
            cy.get("tr")
              .each((tr, index) => {
                if(index !== 0) cy.wrap(tr).contains(text)
              })
          })
      })
  })
})
