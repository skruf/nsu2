import {
  insert, findMany, findOne,
  destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { db } from "@/db"
import { filterInputUtil } from "@/utils"
import { RangesProperties, RangesDocument, } from "./ranges.types"
import rangesStub from "./ranges.stub"

const list = async (filter: RangesDocument): Promise<{
  items: RangesProperties[],
  count: number
}> => {
  const result = await findMany<RangesProperties>(db.ranges, filter, true)
  return result
}

const select = (filter: RangesDocument): Promise<RangesProperties> => (
  findOne<RangesProperties>(db.ranges, filter, true)
)

const create = async (item: RangesProperties): Promise<RangesProperties> => {
  const data = filterInputUtil<RangesProperties, any>(item, rangesStub)
  const result = await insert<RangesProperties>(db.ranges, data, true)
  return result
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne<RangesProperties>(db.ranges, item)
  return true
}

const removeMany = async (filters: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: filters.map(({ id }) => id) } }
  await destroyMany<any>(db.ranges, filter)
  return true
}

const editOne = async (item: RangesProperties): Promise<RangesProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil<RangesProperties, any>(item, rangesStub)
  const result = await updateOne<RangesDocument>(db.ranges, filter, data, true)
  return result
}

export default {
  list,
  select,
  create,
  removeOne,
  removeMany,
  editOne
}
