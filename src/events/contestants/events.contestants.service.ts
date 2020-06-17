import {
  insert, insertMany, findMany,
  findOne, destroyOne, destroyMany,
  updateMany, updateOne
} from "@/db/queries"
import { db } from "@/db"
import { filterInputUtil } from "@/utils"
import eventsContestantsStub from "./events.contestants.stub"
import { EventsContestantsProperties, EventsContestantsDocument }
  from "./events.contestants.types"

export const populate = async (doc: EventsContestantsDocument): Promise<
  EventsContestantsProperties
> => {
  const division = await doc.populate("divisionId")
  const weapon = await doc.populate("weaponId")
  const member = await doc.populate("clubMemberId")
  const club = await member.populate("clubId")
  const contestant = doc.toJSON()
  contestant.division = division ? division.toJSON() : {}
  contestant.weapon = weapon.toJSON()
  contestant.clubMember = member.toJSON()
  contestant.clubMember.club = club ? club.toJSON() : {}
  return contestant
}

const list = async (filter: EventsContestantsProperties): Promise<{
  items: EventsContestantsProperties[],
  count: number
}> => {
  const { items, count } = await findMany<EventsContestantsDocument>(
    db.events_contestants, filter
  )
  const contestants = await Promise.all(items.map((doc) => populate(doc)))
  return {
    items: contestants,
    count
  }
}

const select = async (filter: EventsContestantsProperties): Promise<
  EventsContestantsProperties
> => {
  const doc = await findOne<EventsContestantsDocument>(db.events_contestants, filter)
  const contestant = await populate(doc)
  return contestant
}

const create = async (item: EventsContestantsProperties): Promise<
  EventsContestantsProperties
> => {
  const data = filterInputUtil<EventsContestantsProperties, any>(
    item, eventsContestantsStub
  )
  const doc = await insert<EventsContestantsDocument>(db.events_contestants, data)
  const contestant = await populate(doc)
  return contestant
}

const createMany = async (items: EventsContestantsProperties[]): Promise<{
  items: EventsContestantsProperties[],
  count: number
}> => {
  const data = filterInputUtil<EventsContestantsProperties, any>(
    items, eventsContestantsStub
  )
  const docs = await insertMany<EventsContestantsDocument>(
    db.events_contestants, data
  )
  const contestants = await Promise.all(
    docs.map((doc) => populate(doc))
  )
  return {
    items: contestants,
    count: contestants.length
  }
}

const editOne = async (item: EventsContestantsProperties): Promise<
  EventsContestantsProperties
> => {
  const filter = { id: item.id }
  const data = filterInputUtil<EventsContestantsProperties, any>(
    item, eventsContestantsStub
  )
  const doc = await updateOne<EventsContestantsDocument>(
    db.events_contestants, filter, data
  )
  const contestant = await populate(doc)
  return contestant
}

const editMany = async (items: EventsContestantsProperties[]): Promise<
  EventsContestantsProperties[]
> => {
  const data = filterInputUtil<EventsContestantsProperties, any>(
    items, eventsContestantsStub
  )
  const docs = await updateMany<EventsContestantsDocument>(db.events_contestants, data)
  const contestants = await Promise.all(docs.map((doc) => populate(doc)))
  return contestants
}

const removeOne = async ({ id }): Promise<true> => {
  await destroyOne<EventsContestantsDocument>(db.events_contestants, { id })
  return true
}

const removeMany = async (filters: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: filters.map(({ id }) => id) } }
  await destroyMany<any>(db.events_contestants, filter)
  return true
}

export default {
  list,
  select,
  create,
  createMany,
  removeOne,
  removeMany,
  editMany,
  editOne
}
