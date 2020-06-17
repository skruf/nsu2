import {
  insert, findMany, findOne,
  destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { db } from "@/db"
import { filterInputUtil } from "@/utils"
import eventsStub from "./events.stub"
import { EventsDocument, EventsProperties } from "./events.types"

const populate = async (doc: EventsDocument): Promise<EventsProperties> => {
  const club = await doc.populate("organizerId")
  const range = await doc.populate("rangeId")
  const category = await doc.populate("categoryId")
  const event = doc.toJSON()
  if(club) event.club = club.toJSON()
  if(range) event.range = range.toJSON()
  if(category) event.category = category.toJSON()
  return event
}

const list = async (filter: EventsProperties): Promise<{
  items: EventsProperties[],
  count: number
}> => {
  const { items, count } = await findMany<EventsDocument>(db.events, filter)
  const populated = await Promise.all(items.map(populate))
  return {
    items: populated,
    count
  }
}

const select = async (filter: EventsProperties): Promise<EventsProperties> => {
  const doc = await findOne<EventsDocument>(db.events, filter, false)
  if(!doc) return null
  const event = await populate(doc)
  return event
}

const create = async (item: EventsProperties): Promise<EventsProperties> => {
  const data = filterInputUtil<EventsProperties, any>(item, eventsStub)
  const doc = await insert<EventsDocument>(db.events, data, false)
  const event = await populate(doc)
  return event
}

const removeOne = async (event: { id: string }): Promise<true> => {
  await destroyOne<EventsProperties>(db.events, { id: event.id })
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: items.map(({ id }) => id) } }
  await destroyMany<any>(db.events, filter)
  return true
}

const editOne = async (item: EventsProperties): Promise<EventsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil<EventsProperties, any>(item, eventsStub)
  const doc = await updateOne<EventsDocument>(db.events, filter, data, false)
  const result = await populate(doc)
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
