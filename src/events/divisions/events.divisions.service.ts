import {
  insert, findMany, findOne,
  destroyOne, destroyMany, updateOne, count
} from "@/db/queries"
import { filterInputUtil } from "@/utils"
import _uniqBy from "lodash.uniqby"
import { calcTime, calcStand } from "@/utils/division.utils"
import eventsDivisionsStub from "./events.divisions.stub"
import {
  EventsDivisionsProperties,
  EventsDivisionsDocument
} from "./events.divisions.types"
import { EventsContestantsDocument }
  from "../contestants/events.contestants.types"

const populate = async (
  division: EventsDivisionsProperties
): Promise<EventsDivisionsProperties> => {
  division.contestantsCount = await count("events_contestants", {
    divisionId: division.id
  })
  return division
}

const list = async (filter: EventsDivisionsProperties | {}): Promise<{
  items: EventsDivisionsProperties[],
  count: number
}> => {
  const { items, count } = await findMany<EventsDivisionsProperties>(
    "events_divisions", filter, true
  )
  const populated = await Promise.all(items.map(populate))
  return {
    items: populated,
    count
  }
}

const select = async (filter: EventsDivisionsProperties): Promise<
  EventsDivisionsProperties
> => {
  const data = await findOne<EventsDivisionsProperties>(
    "events_divisions", filter, true
  )
  const division = await populate(data)
  return division
}

const create = async (item: EventsDivisionsProperties): Promise<
  EventsDivisionsProperties
> => {
  const input = filterInputUtil<EventsDivisionsProperties, any>(item, eventsDivisionsStub)
  const data = await insert<EventsDivisionsDocument>("events_divisions", input, true)
  const division = await populate(data)
  return division
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne<EventsDivisionsProperties>("events_divisions", { id: item.id })
  return true
}

const removeMany = async (filters: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: filters.map(({ id }) => id) } }
  await destroyMany<any>("events_divisions", filter)
  return true
}

const editOne = async (item: EventsDivisionsProperties): Promise<
  EventsDivisionsProperties
> => {
  const filter = { id: item.id }
  const input = filterInputUtil<EventsDivisionsProperties, any>(
    item, eventsDivisionsStub
  )
  const data = await updateOne<EventsDivisionsDocument>(
    "events_divisions", filter, input, true
  )
  const division = await populate(data)
  return division
}

const autoAssign = async (data: EventsDivisionsProperties): Promise<void> => {
  const populate = async (doc: EventsContestantsDocument): Promise<
    EventsContestantsDocument
  > => {
    doc.weapon = await doc.populate("weaponId")
    return doc
  }

  const assignedContestants = await findMany<EventsContestantsDocument>(
    "events_contestants",
    {
      eventId: data.eventId,
      divisionId: data.id
    }
  )

  const unAssignedContestants = await findMany<any>(
    "events_contestants",
    {
      eventId: data.eventId,
      divisionId: { $exists: false }
    }
  )

  const contestants: EventsContestantsDocument[] = await Promise.all(
    unAssignedContestants.items
      .filter(
        ({ clubMemberId }) => !assignedContestants.items.map(
          ({ clubMemberId }) => clubMemberId
        ).includes(clubMemberId)
      )
      .map(populate)
  )

  const unique: EventsContestantsDocument[] = _uniqBy(contestants, "clubMemberId")
  const filtered = unique.filter(
    ({ weapon }) => weapon.distance === data.distance
  )

  const columnLimit = data.standsCount

  // delta between existing and new contestants
  // @TODO: sort stands by every other big / small calibre
  // @TODO: check that contestant doesnt exist in other divisions

  await Promise.all(
    filtered
      .map((doc, index) => {
        return doc.update({
          $set: {
            divisionId: data.id,
            time: calcTime(
              columnLimit,
              data.startsAt,
              index
            ),
            stand: calcStand(
              columnLimit,
              index
            )
          }
        })
      })
  )
}

export default {
  list,
  select,
  create,
  removeOne,
  removeMany,
  editOne,
  autoAssign
}