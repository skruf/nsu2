import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne, count
} from "@/db/queries"
import { QueryFilter, QueryResult } from "@/db/queries.d"
import { clubsStub } from "@/stubs"
import { filterInputUtil } from "@/utils"
import { ClubsDocument, ClubsProperties } from "@/db/collections/clubs.collection"

const populate = async (doc: ClubsDocument): Promise<ClubsProperties> => {
  const range = await doc.populate("rangeId")
  const membersCount = await count("clubs_members", { clubId: doc.id })

  const club = doc.toJSON()
  club.membersCount = membersCount
  if(range) club.range = range.toJSON()

  return club
}

const list = async (filter: QueryFilter): Promise<{
  items: QueryResult[], count: number
}> => {
  const result = await findMany("clubs", filter)
  result.items = await Promise.all(
    result.items.map((doc: ClubsDocument) => populate(doc))
  )
  return result
}

const select = async (filter: QueryFilter): Promise<ClubsProperties | null> => {
  const doc = await findOne("clubs", filter)
  const club = await populate(doc)
  return club
}

const create = async (item: ClubsProperties): Promise<ClubsProperties> => {
  const data = filterInputUtil(item, clubsStub)
  const doc = await insert("clubs", data)
  const club = await populate(doc)
  return club
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne("clubs", { id: item.id })
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("clubs", filter)
  return true
}

const editOne = async (item: ClubsProperties): Promise<ClubsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil(item, clubsStub)
  const doc = await updateOne("clubs", filter, data)
  const club = await populate(doc)
  return club
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
