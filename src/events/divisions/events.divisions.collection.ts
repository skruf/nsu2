import { RxJsonSchema } from "rxdb"
import { db } from "@/db"
import { EventsDivisionsProperties }
  from "./events.divisions.types"

const schema: RxJsonSchema = {
  title: "Events divisions schema",
  description: "Events divisions",
  version: 0,
  type: "object",
  indexes: [
    "day",
    "startsAt",
    "endsAt"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    day: {
      type: "string",
      format: "date"
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
    "standsCount",
    "eventId"
  ]
}

const preRemove = async (
  data: EventsDivisionsProperties
): Promise<void> => {
  await db.events_contestants
    .find({ selector: { divisionId: data.id } })
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
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
