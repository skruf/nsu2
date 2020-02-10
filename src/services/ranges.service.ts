import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { QueryFilter, QueryResult } from "@/db/queries.d"
import { rangesStub } from "@/stubs"
import { filterInputUtil } from "@/utils"
import { RangesProperties } from "@/db/collections/ranges.collection"

const list = async (filter: QueryFilter): Promise<{
  items: QueryResult[], count: number
}> => {
  const result = await findMany("ranges", filter, true)
  return result
}

const select = (filter: QueryFilter): Promise<RangesProperties> => (
  findOne("ranges", filter, true)
)

const create = async (item: RangesProperties): Promise<RangesProperties> => {
  const data = filterInputUtil(item, rangesStub)
  const result = await insert("ranges", data, true)
  return result
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne("ranges", item)
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("ranges", filter)
  return true
}

const editOne = async (item: RangesProperties): Promise<RangesProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil(item, rangesStub)
  let result

  try {
    result = await updateOne("ranges", filter, data, true)
  } catch(e) {
    console.error(e)
  }

  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
