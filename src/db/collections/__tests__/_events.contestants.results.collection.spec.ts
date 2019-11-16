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

describe("events.contestants.results.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find results", async () => {
    const results = await db.events_contestants_results.find().exec()
    expect(results.length).toBeGreaterThan(1)
  })

  it("should be able to find a result", async () => {
    const result = await db.events_contestants_results.findOne().exec()
    expect(result.id).not.toBeFalsy()
  })

  it("should be able to populate a result's contestant", async () => {
    const result = await db.events_contestants_results.findOne().exec()
    const contestant = await result.populate("contestantId")
    expect(contestant.id).not.toBeFalsy()
  })
})
