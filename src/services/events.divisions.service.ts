import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne, count
} from "@/db/queries"
import { QueryFilter, QueryResult } from "@/db/queries.d"
import { eventsDivisionsStub } from "@/stubs"
import { filterInputUtil } from "@/utils"
import {
  EventsDivisionsProperties
} from "@/db/collections/events.divisions.collection"
import _uniqBy from "lodash.uniqby"
import { EventsContestantsDocument } from '@/db/collections/events.contestants.collection'

type ListResult = Promise<{ items: QueryResult[], count: number }>
type List = (filter: QueryFilter) => ListResult

const list: List = async (filter) => {
  const divisions = await findMany("events_divisions", filter, true)
  divisions.items = await Promise.all(
    divisions.items.map(async (item: EventsDivisionsProperties) => {
      item.contestantsCount = await count("events_contestants", { divisionId: item.id })
      return item
    })
  )
  return divisions
}

const select = async (
  filter: QueryFilter
): Promise<EventsDivisionsProperties | null> => {
  const division = await findOne("events_divisions", filter, true)
  division.contestantsCount = await count("events_contestants", { divisionId: division.id })
  return division
}

const create = async (
  item: EventsDivisionsProperties
): Promise<EventsDivisionsProperties> => {
  const data = filterInputUtil(item, eventsDivisionsStub)
  const division = await insert("events_divisions", data, true)
  division.contestantsCount = await count("events_contestants", { divisionId: division.id })
  return division
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne("events_divisions", { id: item.id })
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_divisions", filter)
  return true
}

const editOne = async (
  item: EventsDivisionsProperties
): Promise<EventsDivisionsProperties> => {
  const filter = { id: item.id }
  const data = filterInputUtil(item, eventsDivisionsStub)
  const division = await updateOne("events_divisions", filter, data, true)
  return division
}

// get existing contestants for uniq
const autoAssign = async (data): Promise<void> => {
  const populate = async (doc: EventsContestantsDocument): Promise<EventsContestantsDocument> => {
    doc.weapon = await doc.populate("weaponId")
    return doc
  }

  const existingContestants: any = await findMany("events_contestants", {
    eventId: data.eventId,
    divisionId: data.id
  })

  const contestantsWithoutDivision: any = await findMany("events_contestants", {
    eventId: data.eventId,
    divisionId: { $exists: false }
  })

  const contestants = await Promise.all(
    contestantsWithoutDivision.items.filter(
      ({ clubMemberId }) => !existingContestants.items.map(
        ({ clubMemberId }) => clubMemberId
      ).includes(clubMemberId)
    ).map(populate)
  )

  // delta between existing and new contestants
  // @TODO: sort stands by every other big / small calibre
  // @TODO: check that contestant doesnt exist in other divisions

  const currentMaxCount = data.standsCount - existingContestants.count

  await Promise.all(
    _uniqBy(contestants, "clubMemberId")
      .filter(({ weapon }) => weapon.distance === data.distance)
      .slice(0, currentMaxCount)
      // index is wrong for stand
      .map((doc: any, index) => {
        // const a = doc.toJSON()
        // console.log(a.clubMemberId)
        return doc.update(
          { $set: { divisionId: data.id, stand: index + 1 } }
        )
      })
  )
}

export default {
  list, select, create, removeOne, removeMany, editOne, autoAssign
}
