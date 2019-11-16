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

describe("events.contestants.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find contestants", async () => {
    const contestants = await db.events_contestants.find().exec()
    expect(contestants.length).toBeGreaterThan(1)
  })

  it("should be able to populate a contestant's participant", async () => {
    const contestant = await db.events_contestants.findOne().exec()
    const participant = await contestant.populate("participantId")
    expect(participant.id).not.toBeFalsy()
  })

  it("should be able to populate a contestant's division", async () => {
    const contestant = await db.events_contestants.findOne().exec()
    const division = await contestant.populate("divisionId")
    expect(division.id).not.toBeFalsy()
  })

  it("should be able to populate a contestant's weapon", async () => {
    const contestant = await db.events_contestants.findOne().exec()
    const weapon = await contestant.populate("weaponId")
    expect(weapon.id).not.toBeFalsy()
  })

  it("removing a contestant should also remove its results", async () => {
    const contestant = await db.events_contestants.findOne().exec()

    const results1 = await db.events_contestants_results.find({
      contestantId: contestant.id
    }).exec()
    expect(results1).not.toHaveLength(0)

    await contestant.remove()

    const results2 = await db.events_contestants_results.find({
      contestantId: contestant.id
    }).exec()
    expect(results2).toHaveLength(0)
  })
})
