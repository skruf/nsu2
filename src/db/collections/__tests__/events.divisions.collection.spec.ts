import { init } from "@/db"
import { dbTestUtil } from "@/utils"
import _uniqBy from "lodash.uniqby"

let db = null

const setup = async () => {
  db = await init()
  await dbTestUtil.seed(db)
}

const cleanup = async () => {
  await dbTestUtil.reset(db)
}

describe("events.divisions.collection", () => {
  beforeAll(setup)
  afterAll(cleanup)

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

  it("removing a division should also update contestants", async () => {
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

  describe("creating a division should autofill contestants", () => {
    const fixture = {
      id: "999",
      name: "Håndvåpen",
      day: "2019-07-19",
      time: "14:00",
      distance: 25,
      standsCount: 8,
      eventId: "2"
    }

    let division
    let contestants

    beforeAll(async () => {
      division = await db.events_divisions.insert(fixture)
      contestants = await db.events_contestants
        .find({ divisionId: division.id })
        .exec()
    })

    it("should not assign more than division's stand count", () => {
      expect(contestants.length).toBeLessThanOrEqual(division.standsCount)
    })

    it("should assign unique and not out of bound stand", () => {
      expect(contestants.length).toBe(_uniqBy(contestants, "stand").length)
      expect(contestants.reduce(
        (_, contestant) => contestant.stand > division.standsCount, false
      )).toBe(false)
    })

    it("contestants should be unique club members", () => {
      expect(contestants.length).toBe(_uniqBy(contestants, "clubMemberId").length)
    })

    it("contestants weapons should match division's distance", async () => {
      const weaponIds = contestants.map(({ weaponId }) => weaponId)
      const weapons = await db.weapons.find({ id: { $in: weaponIds } }).exec()
      expect(weapons.reduce(
        (c, { distance }) => distance !== division.distance ? c + 1 : c, 0
      )).toBe(0)
    })
  })
})
