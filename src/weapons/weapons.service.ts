import {
  insert, findMany, findOne,
  destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { db } from "@/db"
import weaponsStub from "./weapons.stub"
import { filterInputUtil, sortCollator } from "@/utils"
import { WeaponsProperties, WeaponsDocument } from "./weapons.types"

const list = async (filter: WeaponsDocument): Promise<{
  items: WeaponsDocument[],
  count: number
}> => {
  const result = await findMany<WeaponsDocument>(db.weapons, filter, true)
  return {
    count: result.count,
    items: result.items.sort((a, b) => {
      return sortCollator.compare(a.name, b.name)
    })
  }
}

const select = (filter: WeaponsDocument): Promise<WeaponsProperties> => (
  findOne<WeaponsDocument>(db.weapons, filter, true)
)

const create = async (item: WeaponsProperties): Promise<WeaponsProperties> => {
  const data = filterInputUtil<WeaponsProperties, any>(item, weaponsStub)
  const result = await insert<WeaponsProperties>(db.weapons, data, true)
  return result
}

const removeOne = async (filter: { id: string }): Promise<true> => {
  await destroyOne<WeaponsProperties>(db.weapons, filter)
  return true
}

const removeMany = async (filters: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: filters.map(({ id }) => id) } }
  await destroyMany<any>(db.weapons, filter)
  return true
}

const editOne = async (item: WeaponsProperties): Promise<WeaponsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil<WeaponsProperties, any>(item, weaponsStub)
  const result = await updateOne<WeaponsDocument>(db.weapons, filter, data, true)
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
