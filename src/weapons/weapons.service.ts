import {
  insert, findMany, findOne,
  destroyOne, destroyMany, updateOne
} from "@/db/queries"
import weaponsStub from "./weapons.stub"
import { filterInputUtil } from "@/utils"
import { WeaponsProperties, WeaponsDocument } from "./weapons.types"

const list = async (filter: WeaponsDocument | {}): Promise<{
  items: WeaponsDocument[],
  count: number
}> => {
  const result = await findMany<WeaponsDocument>("weapons", filter, true)
  return result
}

const select = (filter: WeaponsDocument): Promise<WeaponsProperties> => (
  findOne<WeaponsDocument>("weapons", filter, true)
)

const create = async (item: WeaponsProperties): Promise<WeaponsProperties> => {
  const data = filterInputUtil<WeaponsProperties, any>(item, weaponsStub)
  const result = await insert<WeaponsProperties>("weapons", data, true)
  return result
}

const removeOne = async (filter: { id: string }): Promise<true> => {
  await destroyOne<WeaponsProperties>("weapons", filter)
  return true
}

const removeMany = async (filters: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: filters.map(({ id }) => id) } }
  await destroyMany<any>("weapons", filter)
  return true
}

const editOne = async (item: WeaponsProperties): Promise<WeaponsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil<WeaponsProperties, any>(item, weaponsStub)
  const result = await updateOne<WeaponsDocument>("weapons", filter, data, true)
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
