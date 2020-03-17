import { init } from "@/db"
import { dbTestUtil } from "@/utils"

let db = null

const setup = async () => {
  db = await init()
  await dbTestUtil.seedAll(db)
}

const cleanup = async () => {
  await dbTestUtil.reset(db)
}

describe("clubs.members.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find club members", async () => {
    const members = await db.clubs_members.find().exec()
    expect(members.length).toBeGreaterThan(1)
  })

  it("should be able to populate a club member's club", async () => {
    const member = await db.clubs_members.findOne().exec()
    const club = await member.populate("clubId")
    expect(club.id).not.toBeFalsy()
  })

  it("should be able to find a club member's contestants", async () => {
    const clubMember = await db.clubs_members.findOne().exec()
    const contestants = await db.events_contestants.find({
      clubMemberId: clubMember.id
    }).exec()
    expect(contestants.length).toBeGreaterThan(0)
  })

  it("removing a club member should also remove its contestants", async () => {
    const clubMember = await db.clubs_members.findOne().exec()

    const contestants1 = await db.events_contestants.find({
      clubMemberId: clubMember.id
    }).exec()
    expect(contestants1).not.toHaveLength(0)

    await clubMember.remove()

    const contestants2 = await db.events_contestants.find({
      clubMemberId: clubMember.id
    }).exec()
    expect(contestants2).toHaveLength(0)
  })
})
