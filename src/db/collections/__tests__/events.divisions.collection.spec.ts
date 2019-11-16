import { init } from "@/db"
import { dbTestUtil } from "@/utils"

let db = null

const setup = async () => {
  db = await init()
  await dbTestUtil.seed(db)
}

const cleanup = async () => {
  await dbTestUtil.reset(db)
}

describe("events.divisions.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find divisions", async () => {
    const divisions = await db.events_divisions.find().exec()
    expect(divisions.length).toBeGreaterThan(1)
  })

  it("should be able to find a division", async () => {
    const division = await db.events_divisions.findOne().exec()
    expect(division.id).not.toBeFalsy()
  })

  it("should be able to find a division's contestants", async () => {
    const division = await db.events_divisions.findOne().exec()
    const contestants = await db.events_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants.length).toBeGreaterThan(1)
  })

  it("removing a division should also remove its contestants", async () => {
    const division = await db.events_divisions.findOne().exec()

    const contestants1 = await db.events_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants1).not.toHaveLength(0)

    await division.remove()

    const contestants2 = await db.events_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants2).toHaveLength(0)
  })
})
