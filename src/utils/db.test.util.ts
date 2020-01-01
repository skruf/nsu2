import { Database } from "../db"
import { DatabaseCollectionsNames } from "../db/collections"
import { getTimestampUtil } from "./"
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

const rId = (m): string => {
  const c = Math.floor(Math.random() * m.length)
  const v = m[c]
  if(typeof v === "string") return m.splice(0, c)
  return v.id
}

const store = (
  db: Database,
  collection: DatabaseCollectionsNames,
  fixtures: any,
  refs?: any
): any => {
  // for(const k in refs) {
  //   const ref = refs[k]
  //   f[k] = rId(ref)
  // }

  const timestamp = getTimestampUtil()

  const docs = fixtures.map((fixture) => db[collection].newDocument({
    ...fixture,
    createdAt: timestamp,
    updatedAt: timestamp
  }))

  return Promise.all(docs.map(async (doc: any) => {
    await doc.save()
    return doc.toJSON()
  }))
}

export const seedWeapons = (db: Database, refs?: object) => {
  return store(db, "weapons", weaponsFixture, refs)
}
export const seedRanges = (db: Database, refs?: object) => {
  return store(db, "ranges", rangesFixture, refs)
}
export const seedClubs = (db: Database, refs?: object) => {
  return store(db, "clubs", clubsFixture, refs)
}
export const seedClubsMembers = (db: Database, refs?: object) => {
  return store(db, "clubs_members", clubsMembersFixture, refs)
}
export const seedEventsCategories = (db: Database, refs?: object) => {
  return store(db, "events_categories", eventsCategoriesFixture, refs)
}
export const seedEvents = (db: Database, refs?: object) => {
  return store(db, "events", eventsFixture, refs)
}
export const seedEventsContestants = (db: Database, refs?: object) => {
  return store(db, "events_contestants", eventsContestantsFixture, refs)
}
export const seedEventsDivisions = (db: Database, refs?: object) => {
  return store(db, "events_divisions", eventsDivisionsFixture, refs)
}

export default {
  seed: async (db: Database): Promise<void> => {
    // console.log("[seed] seed:started")

    await seedWeapons(db)
    await seedRanges(db)
    await seedClubs(db)
    await seedClubsMembers(db)
    await seedEventsCategories(db)
    await seedEvents(db)
    await seedEventsDivisions(db)
    await seedEventsContestants(db)

    // console.log("[seed] seed:finished")
  },

  reset: async (db: Database): Promise<void> => {
    // console.log("[seed] reset:started")
    await db.remove()
    db = null
    // console.log("[seed] reset:finished")
  }
}
