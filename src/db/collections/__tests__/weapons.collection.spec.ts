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
})
