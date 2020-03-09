import {
  insert, findMany, findOne, destroyOne,
  destroyMany, updateOne, count
} from "@/db/queries"
import { filterInputUtil } from "@/utils"
import { ClubsDocument, ClubsProperties } from "./clubs.types"
import { ClubsMembersDocument } from "./members/clubs.members.types"
import clubsStub from "./clubs.stub"

const populate = async (doc: ClubsDocument): Promise<ClubsProperties> => {
  const range = await doc.populate("rangeId")
  const membersCount = await count<ClubsMembersDocument>("clubs_members", { clubId: doc.id })
  const club = doc.toJSON()
  club.membersCount = membersCount
  if(range) club.range = range.toJSON()
  return club
}

const list = async (filter: ClubsDocument | {}): Promise<{
  items: ClubsProperties[],
  count: number
}> => {
  const { items, count } = await findMany<ClubsDocument>("clubs", filter)
  const populated = await Promise.all(items.map((doc) => populate(doc)))
  return {
    items: populated,
    count
  }
}

// type ClubsInput = Omit<ClubsSchema, "id">

const select = async (filter: ClubsDocument): Promise<ClubsProperties | null> => {
  const doc = await findOne<ClubsDocument>("clubs", filter)
  const club = await populate(doc)
  return club
}

const create = async (item: ClubsProperties): Promise<ClubsProperties> => {
  const data = filterInputUtil<ClubsProperties, any>(item, clubsStub)
  const doc = await insert<ClubsDocument>("clubs", data)
  const club = await populate(doc)
  return club
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne<ClubsProperties>("clubs", { id: item.id })
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: items.map(({ id }) => id) } }
  await destroyMany<any>("clubs", filter)
  return true
}

const editOne = async (item: ClubsProperties): Promise<ClubsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil<ClubsProperties, any>(item, clubsStub)
  const doc = await updateOne<ClubsDocument>("clubs", filter, data)
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
