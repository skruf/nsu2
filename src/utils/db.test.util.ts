import { Database } from "../db"
import { DatabaseCollectionsNames } from "../db/collections"
import { getIdUtil, getTimestampUtil } from "./"
import {
  weaponsFixture,
  rangesFixture,
  clubsFixture,
  clubsMembersFixture,
  eventsCategoriesFixture,
  eventsFixture,
  eventsDivisionsFixture,
  eventsContestantsFixture
} from "../fixtures"

const store = (
  db: Database,
  collection: DatabaseCollectionsNames,
  fixtures: any,
  overrides?: any
): any => {
  return Promise.all(
    fixtures.map(async (fixture: any) => {
      const f = { ...fixture, ...overrides }
      const timestamp = getTimestampUtil()
      f.id = getIdUtil()
      f.createdAt = timestamp
      f.updatedAt = timestamp
      const d = await db[collection].insert(f)
      return d.toJSON()
    })
  )
}

export const seedWeapons = (db: Database, overrides?: object) => {
  return store(db, "weapons", weaponsFixture, overrides)
}
export const seedRanges = (db: Database, overrides?: object) => {
  return store(db, "ranges", rangesFixture, overrides)
}
export const seedClubs = (db: Database, overrides?: object) => {
  return store(db, "clubs", clubsFixture, overrides)
}
export const seedClubsMembers = (db: Database, overrides?: object) => {
  return store(db, "clubs_members", clubsMembersFixture, overrides)
}
export const seedEventsCategories = (db: Database, overrides?: object) => {
  return store(db, "events_categories", eventsCategoriesFixture, overrides)
}
export const seedEvents = (db: Database, overrides?: object) => {
  return store(db, "events", eventsFixture, overrides)
}
export const seedEventsContestants = (db: Database, overrides?: object) => {
  return store(db, "events_contestants", eventsContestantsFixture, overrides)
}
export const seedEventsDivisions = (db: Database, overrides?: object) => {
  return store(db, "events_divisions", eventsDivisionsFixture, overrides)
}

export default {
  seed: async (db: Database) => {
    const weapons = await seedWeapons(db)
    const ranges = await seedRanges(db)
    const clubs = await seedClubs(db, {
      rangeId: ranges[0].id
    })
    const clubsMembers = await seedClubsMembers(db, { clubId: clubs[0].id })
    const eventsCategories = await seedEventsCategories(db)
    const events = await seedEvents(db, {
      categoryId: eventsCategories[0].id,
      rangeId: ranges[0].id,
      organizerId: clubs[0].id
    })
    const eventsContestants = await seedEventsContestants(db, {
      weaponId: weapons[0].id,
      eventId: events[0].id,
      clubMemberId: clubsMembers[0].id
    })
    await seedEventsDivisions(db, {
      eventId: events[0].id,
      eventsContestantsIds: eventsContestants.map(({ id }) => id)
    })
  },
  reset: async (db: Database) => {
    await db.remove()
    db = null
  }
}
