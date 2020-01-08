import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { WeaponsDocument } from "@/db/collections/weapons.collection"
import { EventsDocument } from "@/db/collections/events.collection"
import { EventsDivisionsDocument } from "@/db/collections/events.divisions.collection"
import { ClubsMembersDocument } from "@/db/collections/clubs.members.collection"
import { db } from "@/db"

export declare interface EventsContestantsProperties {
  id: string
  number: number
  stand: number
  calibre: number
  hits: { hit: number, sum: number }[]
  total: number
  notes: string[]
  weaponId: string
  eventId: string
  divisionId: string
  clubMemberId: string
  createdAt: string
  updatedAt: string
  weapon?: WeaponsDocument
  event?: EventsDocument
  division?: EventsDivisionsDocument
  clubMember?: ClubsMembersDocument
}

interface EventsContestantsStatics {
  count: () => Promise<number>
}

export declare type EventsContestantsDocument = RxDocument<
  EventsContestantsProperties
>
export declare type EventsContestantsCollection = RxCollection<
  EventsContestantsProperties,
  EventsContestantsStatics
>

const schema: RxJsonSchema = {
  title: "Events contestants schema",
  description: "Events contestants",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    number: {
      type: "number",
      index: true
    },
    stand: {
      type: "number",
      index: true
    },
    calibre: {
      type: "number",
      index: true
    },
    hits: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hit: {
            type: "number"
          },
          sum: {
            type: "number"
          }
        }
      }
    },
    total: {
      type: "number",
      index: true
    },
    notes: {
      type: "array",
      items: {
        type: "string"
      }
    },
    weaponId: {
      type: "string",
      ref: "weapons",
      index: true
    },
    eventId: {
      type: "string",
      ref: "events",
      index: true
    },
    divisionId: {
      type: "string",
      ref: "events_divisions"
    },
    clubMemberId: {
      type: "string",
      ref: "clubs_members",
      index: true
    }
  },
  required: [
    "number",
    "calibre",
    "weaponId",
    "eventId",
    "clubMemberId"
  ]
}

const preInsert = async (data: EventsContestantsProperties): Promise<void> => {
  if(data.number) return

  const contestant = await db.events_contestants.findOne({
    eventId: data.eventId,
    clubMemberId: data.clubMemberId
  }).exec()

  if(contestant) {
    data.number = contestant.number
    return
  }

  const contestantsNextNumber = await db.events_contestants
    .find({ eventId: data.eventId })
    .sort({ number: -1 })
    .limit(1)
    .exec()

  if(!contestantsNextNumber.length) {
    data.number = 1
    return
  }

  data.number = contestantsNextNumber[0].number + 1
}

export default {
  collection: {
    name: "events_contestants",
    schema: schema
  },
  middlewares: {
    preInsert: {
      handle: preInsert,
      parallel: false
    }
  }
}
