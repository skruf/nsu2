import {
  insert, insertMany, findMany, findOne, destroyOne, destroyMany, updateMany
} from "@/db/queries"
import { QueryOptions, QueryFilter, QueryResult } from "@/db/queries.d"
import { filterInputUtil } from "@/utils"
import { eventsContestantsStub } from "@/stubs"
import {
  EventsContestantsProperties
} from "@/db/collections/events.contestants.collection"

export const populate = async (doc) => {
  const weapon = await doc.populate("weaponId")
  const member = await doc.populate("clubMemberId")
  const club = await member.populate("clubId")

  const contestant = doc.toJSON()
  contestant.weapon = weapon.toJSON()
  contestant.clubMember = member.toJSON()
  contestant.clubMember.club = club.toJSON()

  return contestant
}

const list = async (
  filter: QueryFilter, options: QueryOptions
): Promise<{ items: QueryResult[], count: number }> => {
  const result = await findMany("events_contestants", filter, options)
  result.items = await Promise.all(
    result.items.map(async (doc) => populate(doc))
  )
  return result
}

const select = async (
  filter: QueryFilter
): Promise<QueryResult | null> => {
  const doc = await findOne("events_contestants", filter)
  const contestant = await populate(doc)
  return contestant
}

const create = async (
  item: EventsContestantsProperties
): Promise<QueryResult | null> => {
  const data = filterInputUtil(item, eventsContestantsStub)
  const doc = await insert("events_contestants", data)
  const contestant = await populate(doc)
  return contestant
}

const createMany = async (
  items: EventsContestantsProperties[]
): Promise<{ items: QueryResult[], count: number }> => {
  const data: any = filterInputUtil(items, eventsContestantsStub)
  const docs: object[] = await insertMany("events_contestants", data)
  const contestants = await Promise.all(
    docs.map((doc) => populate(doc))
  )

  return {
    items: contestants,
    count: contestants.length
  }
}

const editMany = async (
  items: EventsContestantsProperties[]
) => {
  const data = filterInputUtil(items, eventsContestantsStub)
  const docs = await updateMany("events_contestants", data)
  const contestants = await Promise.all(docs.map((doc) => populate(doc)))
  return contestants
}

const removeOne = async (contestant) => {
  await destroyOne("events_contestants", { id: contestant.id })
  return true
}

const removeMany = async (contestants) => {
  const filter = {
    id: { $in: contestants.map(({ id }) => id) }
  }
  await destroyMany("events_contestants", filter)
  return true
}

export default {
  list, select, create, createMany, removeOne, removeMany, editMany
}
