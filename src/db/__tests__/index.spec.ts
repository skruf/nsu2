import { isRxDatabase, checkAdapter, isRxCollection } from "rxdb"
import { init, collections } from "@/db"

let db = null

const setup = async (): Promise<void> => {
  db = await init()
}

const cleanup = async (): Promise<void> => {
  await db.remove()
  db = null
}

describe("database", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should init and get db", async () => {
    expect(isRxDatabase(db)).toEqual(true)
    const hasMemoryAdapter = await checkAdapter("memory")
    expect(hasMemoryAdapter).toEqual(true)
  })

  it("should be able to configure all collections", async () => {
    const invalid = collections.filter((config) => {
      const collection = db[config.collection.name]
      return !isRxCollection(collection)
    })
    expect(invalid).toHaveLength(0)
  })
})
