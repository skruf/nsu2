// @ts-nocheck
import { getTimestampUtil, promiseSequenceUtil } from "./"
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

export const seed = (db, collection, fixtures) => {
  const timestamp = getTimestampUtil()

  const docs = fixtures.map((fixture) => db[collection].newDocument({
    ...fixture,
    createdAt: timestamp,
    updatedAt: timestamp
  }))

  return Promise.all(
    docs.map((doc) => doc.save())
  )

  // return promiseSequenceUtil(
  //   docs.map((doc: any) => () => doc.save())
  // )
}

export const seedWeapons = (db, refs?) => {
  return seed(db, "weapons", weaponsFixture, refs)
}
export const seedRanges = (db, refs?) => {
  return seed(db, "ranges", rangesFixture, refs)
}
export const seedClubs = (db, refs?) => {
  return seed(db, "clubs", clubsFixture, refs)
}
export const seedClubsMembers = (db, refs?) => {
  return seed(db, "clubs_members", clubsMembersFixture, refs)
}
export const seedEventsCategories = (db, refs?) => {
  return seed(db, "events_categories", eventsCategoriesFixture, refs)
}
export const seedEvents = (db, refs?) => {
  return seed(db, "events", eventsFixture, refs)
}
export const seedEventsContestants = (db, refs?) => {
  return seed(db, "events_contestants", eventsContestantsFixture, refs)
}
export const seedEventsDivisions = (db, refs?) => {
  return seed(db, "events_divisions", eventsDivisionsFixture, refs)
}

export default {
  seedAll: async (db): Promise<void> => {
    await seedWeapons(db)
    await seedRanges(db)
    await seedClubs(db)
    await seedClubsMembers(db)
    await seedEventsCategories(db)
    await seedEvents(db)
    await seedEventsDivisions(db)
    await seedEventsContestants(db)
  },

  reset: async (db): Promise<void> => {
    await db.remove()
    db = null
  }
}
