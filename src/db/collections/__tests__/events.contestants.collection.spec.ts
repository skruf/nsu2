import { init } from "@/db"
import {
  dbTestUtil,
  getIdUtil,
  getTimestampUtil,
  randomArrayItemUtil
} from "@/utils"
import {
  eventsFixture,
  clubsMembersFixture,
  weaponsFixture
} from "@/fixtures"

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

  it("should be able to populate a contestant's club member", async () => {
    const contestant = await db.events_contestants.findOne().exec()
    const clubMember = await contestant.populate("clubMemberId")
    expect(clubMember.id).not.toBeFalsy()
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

  it.only("should assign a unique number for each club members", async () => {
    const timestamp = getTimestampUtil()
    const factory = async (p) => {
      const r = await db.events_contestants.insert({
        ...p,
        id: getIdUtil(),
        weaponId: randomArrayItemUtil(weaponsFixture).id,
        calibre: 25,
        createdAt: timestamp,
        updatedAt: timestamp
      })
      return r.toJSON()
    }

    const event0Person0Contestant0 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person0Contestant1 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person0Contestant3 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person0Contestant4 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person0Contestant5 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person0Contestant6 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person0Contestant7 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person0Contestant8 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })

    const event0Person0Contestant2 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event0Person1Contestant0 = await factory({
      eventId: eventsFixture[0].id,
      clubMemberId: clubsMembersFixture[1].id
    })
    const event1Person0Contestant0 = await factory({
      eventId: eventsFixture[1].id,
      clubMemberId: clubsMembersFixture[0].id
    })
    const event1Person1Contestant0 = await factory({
      eventId: eventsFixture[1].id,
      clubMemberId: clubsMembersFixture[1].id
    })
    const event1Person1Contestant1 = await factory({
      eventId: eventsFixture[1].id,
      clubMemberId: clubsMembersFixture[1].id
    })

    expect(event0Person0Contestant0.number)
      .toEqual(event0Person0Contestant1.number)
    expect(event0Person0Contestant0.number)
      .toEqual(event0Person0Contestant2.number)
    expect(event0Person0Contestant0.number)
      .not.toEqual(event0Person1Contestant0.number)
    expect(event1Person0Contestant0.number)
      .not.toEqual(event1Person1Contestant0.number)
    expect(event1Person1Contestant0.number)
      .toEqual(event1Person1Contestant1.number)
    expect(event0Person0Contestant0.number)
      .toEqual(event0Person0Contestant1.number)
    expect(event0Person0Contestant2.number)
      .toEqual(event0Person0Contestant3.number)
    expect(event0Person0Contestant3.number)
      .toEqual(event0Person0Contestant4.number)
    expect(event0Person0Contestant4.number)
      .toEqual(event0Person0Contestant5.number)
    expect(event0Person0Contestant5.number)
      .toEqual(event0Person0Contestant6.number)
    expect(event0Person0Contestant6.number)
      .toEqual(event0Person0Contestant7.number)
    expect(event0Person0Contestant7.number)
      .toEqual(event0Person0Contestant8.number)
  })
})
