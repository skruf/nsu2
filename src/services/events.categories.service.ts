import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { QueryOptions, QueryFilter, QueryResult } from "@/db/queries.d"
import { eventsCategoriesStub } from "@/stubs"
import { filterInputUtil } from "@/utils"
import { EventsCategoriesProperties } from "@/db/collections/events.categories.collection"

const list = async (filter: QueryFilter, options: QueryOptions): Promise<{
  items: QueryResult[], count: number
}> => {
  const result = await findMany("events_categories", filter, options, true)
  return result
}

const select = async (filter: QueryFilter): Promise<EventsCategoriesProperties> => {
  const result = await findOne("events_categories", filter, true)
  return result
}

const create = async (item: EventsCategoriesProperties): Promise<EventsCategoriesProperties> => {
  const data = filterInputUtil(item, eventsCategoriesStub)
  const result = await insert("events_categories", data, true)
  return result
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne("events_categories", item)
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_categories", filter)
  return true
}

const editOne = async (item: EventsCategoriesProperties): Promise<EventsCategoriesProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil(item, eventsCategoriesStub)
  const result = await updateOne("events_categories", filter, data, true)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
