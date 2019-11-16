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

describe("events.participants.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find participant's", async () => {
    const participants = await db.events_participants.find().exec()
    expect(participants.length).toBeGreaterThan(1)
  })

  it("should be able to populate a participant's member", async () => {
    const participant = await db.events_participants.findOne().exec()
    const member = await participant.populate("memberId")
    expect(member.id).not.toBeFalsy()
  })

  it("should be able to populate a participant's event", async () => {
    const participant = await db.events_participants.findOne().exec()
    const event = await participant.populate("eventId")
    expect(event.id).not.toBeFalsy()
  })

  it("removing a participant should also remove its contestants", async () => {
    const participant = await db.events_participants.findOne().exec()

    const contestants1 = await db.events_contestants.find({
      participantId: participant.id
    }).exec()
    expect(contestants1).not.toHaveLength(0)

    await participant.remove()

    const contestants2 = await db.events_contestants.find({
      participantId: participant.id
    }).exec()
    expect(contestants2).toHaveLength(0)
  })

  it("removing a participant should also remove its weapons", async () => {
    const participant = await db.events_participants.findOne().exec()

    const weapons1 = await db.events_participants_weapons.find({
      participantId: participant.id
    }).exec()
    expect(weapons1).toHaveLength(0)

    await participant.remove()

    const weapons2 = await db.events_participants_weapons.find({
      participantId: participant.id
    }).exec()
    expect(weapons2).toHaveLength(0)
  })
})
