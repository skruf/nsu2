import { init } from "@/db"
import { dbTestUtil } from "@/utils"

let db = null

const setup = async (): Promise<void> => {
  db = await init()
  await dbTestUtil.seedAll(db)
}

const cleanup = async (): Promise<void> => {
  await dbTestUtil.reset(db)
}

describe("ranges.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find ranges", async () => {
    const ranges = await db.ranges.find().exec()
    expect(ranges.length).toBeGreaterThan(1)
  })

  it("should be able to find a range", async () => {
    const range = await db.ranges.findOne().exec()
    expect(range.id).not.toBeFalsy()
  })

  it("removing a range should update clubs and events", async () => {
    const range = await db.ranges.findOne().exec()

    const clubs1 = await db.clubs.find({ rangeId: range.id }).exec()
    expect(clubs1).not.toHaveLength(0)

    const events1 = await db.events.find({ rangeId: range.id }).exec()
    expect(events1).not.toHaveLength(0)

    await range.remove()

    const clubs2 = await db.clubs.find({ rangeId: range.id }).exec()
    expect(clubs2).toHaveLength(0)

    const events2 = await db.events.find({ rangeId: range.id }).exec()
    expect(events2).toHaveLength(0)
  })
})
