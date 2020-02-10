import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { QueryFilter, QueryResult } from "@/db/queries.d"
import { weaponsStub } from "@/stubs"
import { filterInputUtil } from "@/utils"
import { WeaponsProperties } from "@/db/collections/weapons.collection"

const list = async (filter: QueryFilter): Promise<{
  items: QueryResult[], count: number
}> => {
  const result = await findMany("weapons", filter, true)
  return result
}

const select = (filter: QueryFilter): Promise<WeaponsProperties | null> => (
  findOne("weapons", filter, true)
)

const create = async (item: WeaponsProperties): Promise<WeaponsProperties> => {
  const data = filterInputUtil(item, weaponsStub)
  const result = await insert("weapons", data, true)
  return result
}

const removeOne = async (filter: { id: string }): Promise<true> => {
  await destroyOne("weapons", filter)
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("weapons", filter)
  return true
}

const editOne = async (item: WeaponsProperties): Promise<WeaponsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil(item, weaponsStub)
  const result = await updateOne("weapons", filter, data, true)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
