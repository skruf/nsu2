import { init } from "@/db"
import { clubsFixture } from "@/fixtures"
import { dbTestUtil } from "@/utils"
import {
  insert,
  findMany,
  findOne,
  destroyOne,
  destroyMany
} from "@/db/queries"

let db = null

const setup = async (): Promise<void> => {
  db = await init()
  await dbTestUtil.seedAll(db)
}

const cleanup = async (): Promise<void> => {
  await dbTestUtil.reset(db)
}

describe("database queries", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should list and count", async () => {
    const filter = {}
    const results = await findMany("clubs", filter)
    // expect(results.items[0].name).toEqual(clubsFixture[0].name)
    expect(results.count).toEqual(clubsFixture.length)
  })

  it("should filter", async () => {
    const mock = clubsFixture[2]
    const filter = { name: mock.name }
    const results = await findMany("clubs", filter)
    // expect(results.items[0].name).toEqual(mock.name)
    expect(results.count).toEqual(1)
  })

  // it("should search", async () => {
  //   const mock = clubsFixture[0]
  //   const filter = {}
  //   const options = {
  //     search: { fields: [ "name" ], value: mock.name }
  //   }
  //   const results = await findMany("clubs", filter, options)
  //   // expect(results.items[0].name).toEqual(mock.name)
  //   expect(results.count).toEqual(1)
  // })

  // it("should sort", async () => {
  //   const filter = {}
  //   const options = { sort: "-id" }
  //   const results = await findMany("clubs", filter, options)
  //   // expect(results.items[0].id).toEqual(clubsFixture[clubsFixture.length - 2].id)
  //   expect(results.count).toEqual(clubsFixture.length)
  // })

  // it("should paginate", async () => {
  //   const filter = {}

  //   const options1 = { skip: 0, limit: 3 }
  //   const results1 = await findMany("clubs", filter, options1)
  //   // results1.items.forEach((i) => i.toJSON().id)

  //   // expect(results1.count).toEqual(3)

  //   const options2 = { skip: 3, limit: 6 }
  //   const results2 = await findMany("clubs", filter, options2)
  //   // results2.items.forEach((i) => i.toJSON().id)

  //   // expect(results2.count).toEqual(6)

  //   expect(results1.items[0].id).not.toEqual(results2.items[0].id)
  // })
})
