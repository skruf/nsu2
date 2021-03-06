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

describe("events.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find events", async () => {
    const events = await db.events.find().exec()
    expect(events.length).toBeGreaterThan(1)
  })

  it("should be able to find an event", async () => {
    const event = await db.events.findOne().exec()
    expect(event.id).not.toBeFalsy()
  })

  it("should be able to populate an event's range", async () => {
    const event = await db.events.findOne().exec()
    const range = await event.populate("rangeId")
    expect(range.id).not.toBeFalsy()
  })

  it("should be able to populate an event's club", async () => {
    const event = await db.events.findOne().exec()
    const club = await event.populate("organizerId")
    expect(club.id).not.toBeFalsy()
  })

  it("removing an event should also remove its divisions", async () => {
    const event = await db.events.findOne().exec()
    const divisions1 = await db.events_divisions
      .find({ eventId: event.id })
      .exec()

    await event.remove()

    const divisions2 = await db.events_divisions
      .find({ eventId: event.id })
      .exec()

    expect(divisions1).not.toHaveLength(0)
    expect(divisions2).toHaveLength(0)
  })

  it("removing an event should also remove its contestants", async () => {
    const event = await db.events.findOne({ id: "2" }).exec()
    const contestants1 = await db.events_contestants
      .find({ eventId: event.id })
      .exec()

    await event.remove()

    const contestants2 = await db.events_contestants
      .find({ eventId: event.id })
      .exec()

    expect(contestants1.length).toBeGreaterThan(1)
    expect(contestants2).toHaveLength(0)
  })
})
