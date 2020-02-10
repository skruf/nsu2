import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { EventsDocument } from "@/db/collections/events.collection"
import { db } from "@/db"
import { eventsDivisionsService } from "@/services"

export declare interface EventsDivisionsProperties {
  id: string
  name: string
  day: string
  time: string
  distance: number
  standsCount: number
  eventId: string
  createdAt: string
  updatedAt: string
  event?: EventsDocument
  contestantsCount: number
}

export declare type EventsDivisionsDocument = RxDocument<EventsDivisionsProperties>
export declare type EventsDivisionsCollection = RxCollection<EventsDivisionsProperties>

const schema: RxJsonSchema = {
  title: "Events divisions schema",
  description: "Events divisions",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string"
    },
    day: {
      type: "string",
      format: "date",
      index: true
    },
    time: {
      type: "string"
    },
    distance: {
      type: "number"
    },
    standsCount: {
      type: "number"
    },
    eventId: {
      type: "string",
      ref: "events"
    }
  },
  required: [
    "name",
    "day",
    "time",
    "distance",
    "standsCount",
    "eventId"
  ]
}

const preInsert = async (data: EventsDivisionsProperties): Promise<void> => {
  await eventsDivisionsService.autoAssign(data)
}

const preRemove = async (data: EventsDivisionsProperties): Promise<void> => {
  await db.events_contestants
    .find({ divisionId: data.id })
    .update({ $set: { divisionId: undefined } })
}

export default {
  collection: {
    name: "events_divisions",
    schema: schema
  },
  middlewares: {
    preInsert: {
      handle: preInsert,
      parallel: false
    },
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
