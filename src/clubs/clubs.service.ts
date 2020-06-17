import {
  insert, findMany, findOne, destroyOne,
  destroyMany, updateOne, count
} from "@/db/queries"
import { db } from "@/db"
import { filterInputUtil } from "@/utils"
import { ClubsDocument, ClubsProperties } from "./clubs.types"
import { ClubsMembersDocument } from "./members/clubs.members.types"
import clubsStub from "./clubs.stub"

const populate = async (doc: ClubsDocument): Promise<ClubsProperties> => {
  const range = await doc.populate("rangeId")

  const membersCount = await count<ClubsMembersDocument>(
    db.clubs_members,
    { clubId: doc.id }
  )

  // const members = await db.clubs_members.find({
  //   selector: { clubId: doc.id }
  // }).exec()

  const club = doc.toJSON()
  club.membersCount = membersCount
  // club.membersCount = members.length
  if(range) club.range = range.toJSON()
  return club
}

const list = async (filter: ClubsDocument): Promise<{
  items: ClubsProperties[],
  count: number
}> => {
  // const docs = await db.clubs.find({ selector: filter }).exec()
  // const { length } = await db.clubs.find().exec()
  const { items, count } = await findMany<ClubsDocument>(db.clubs, filter)
  const populated = await Promise.all(items.map(populate))
  return {
    items: populated,
    count
  }
}

// type ClubsInput = Omit<ClubsSchema, "id">

const select = async (filter: ClubsDocument): Promise<ClubsProperties | null> => {
  const doc = await findOne<ClubsDocument>(db.clubs, filter)
  const club = await populate(doc)
  return club
}

const create = async (item: ClubsProperties): Promise<ClubsProperties> => {
  const data = filterInputUtil<ClubsProperties, any>(item, clubsStub)
  const doc = await insert(db.clubs, data)
  const club = await populate(doc)
  return club
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne<ClubsProperties>(db.clubs, { id: item.id })
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: items.map(({ id }) => id) } }
  await destroyMany<any>(db.clubs, filter)
  return true
}

const editOne = async (item: ClubsProperties): Promise<ClubsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil<ClubsProperties, any>(item, clubsStub)
  const doc = await updateOne<ClubsDocument>(db.clubs, filter, data)
  const club = await populate(doc)
  return club
}

export default {
  list,
  select,
  create,
  removeOne,
  removeMany,
  editOne
}
