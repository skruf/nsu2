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

describe("weapons.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find weapons", async () => {
    const weapons = await db.weapons.find().exec()
    expect(weapons.length).toBeGreaterThan(1)
  })

  it("should be able to find a weapon", async () => {
    const weapon = await db.weapons.findOne().exec()
    expect(weapon.id).not.toBeFalsy()
  })

  it("removing a weapon should also remove participants weapon's", async () => {
    const weapon = await db.weapons.findOne().exec()

    const weapons1 = await db.events_participants_weapons.find({
      weaponId: weapon.id
    }).exec()
    expect(weapons1).not.toHaveLength(0)

    await weapon.remove()

    const weapons2 = await db.events_participants_weapons.find({
      weaponId: weapon.id
    }).exec()
    expect(weapons2).toHaveLength(0)
  })
})
