import { RxJsonSchema } from "rxdb"
import { db } from "@/db"
import { EventsDivisionsProperties } from "./events.divisions.types"
import eventsDivisionsService from "./events.divisions.service"

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
    day: {
      type: "string",
      format: "date",
      index: true
    },
    startsAt: {
      type: "string"
    },
    endsAt: {
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
    autoAssign: {
      type: "boolean"
    }
  },
  required: [
    "day",
    "distance",
    // "standsCount",
    "eventId"
  ]
}

const preInsert = async (data: EventsDivisionsProperties): Promise<void> => {
  if(!data.autoAssign) return
  await eventsDivisionsService.autoAssign(data)
}

const preRemove = async (data: EventsDivisionsProperties): Promise<void> => {
  await db.events_contestants
    .find({ divisionId: data.id })
    .update({
      $set: {
        divisionId: undefined,
        time: undefined,
        stand: undefined
      }
    })
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
