import {
  insert, findMany, findOne,
  destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { db } from "@/db"
import eventsCategoriesStub from "./events.categories.stub"
import { filterInputUtil } from "@/utils"
import { EventsCategoriesProperties }
  from "./events.categories.types"

const list = async (filter: EventsCategoriesProperties): Promise<{
  items: EventsCategoriesProperties[],
  count: number
}> => {
  const result = await findMany<EventsCategoriesProperties>(
    db.events_categories, filter, true
  )
  return result
}

const select = async (filter: EventsCategoriesProperties): Promise<
  EventsCategoriesProperties
> => {
  const result = await findOne<EventsCategoriesProperties>(
    db.events_categories, filter, true
  )
  return result
}

const create = async (item: EventsCategoriesProperties): Promise<
  EventsCategoriesProperties
> => {
  const data = filterInputUtil<EventsCategoriesProperties, any>(
    item, eventsCategoriesStub
  )
  const result = await insert<EventsCategoriesProperties>(
    db.events_categories, data, true
  )
  return result
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne<EventsCategoriesProperties>(db.events_categories, item)
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: items.map(({ id }) => id) } }
  await destroyMany<any>(db.events_categories, filter)
  return true
}

const editOne = async (item: EventsCategoriesProperties): Promise<
  EventsCategoriesProperties
> => {
  const filter = { id: item.id }
  const data = filterInputUtil<EventsCategoriesProperties, any>(
    item, eventsCategoriesStub
  )
  const result = await updateOne<EventsCategoriesProperties>(
    db.events_categories, filter, data, true
  )
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
