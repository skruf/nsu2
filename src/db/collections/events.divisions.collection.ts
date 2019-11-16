import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "@/db/queries"
import { EventsDocument } from "@/db/collections/events.collection"

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
    },
    eventsContestantsIds: {
      type: "array",
      ref: "events_contestants",
      items: {
        type: "string"
      }
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

const preRemove = async (data: EventsDivisionsProperties) => {
  await destroyMany("events_contestants", {
    divisionId: data.id
  })
}

export default {
  collection: {
    name: "events_divisions",
    schema: schema
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
