import { RxJsonSchema } from "rxdb"
import { destroyMany } from "@/db/queries"
import { EventsProperties } from "./events.types"
import { db } from "@/db"

const schema: RxJsonSchema = {
  title: "Events schema",
  description: "Events",
  version: 1,
  type: "object",
  indexes: [
    "title",
    "startsAt",
    "categoryId",
    "organizerId",
    "rangeId"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    title: {
      type: "string"
    },
    startsAt: {
      type: "string",
      format: "date"
    },
    endsAt: {
      type: "string",
      format: "date"
    },
    approbated: {
      type: "boolean",
      default: false
    },
    categoryId: {
      type: "string",
      ref: "events_categories"
    },
    organizerId: {
      type: "string",
      ref: "clubs"
    },
    rangeId: {
      type: "string",
      ref: "ranges"
    }
  },
  required: [
    "title",
    "startsAt",
    "endsAt"
  ]
}

const preRemove = async (data: EventsProperties): Promise<void> => {
  await destroyMany(db.events_divisions, {
    eventId: data.id
  })
  await destroyMany(db.events_contestants, {
    eventId: data.id
  })
}

export default {
  collection: {
    name: "events",
    schema: schema,
    migrationStrategies: {
      1: (doc) => doc
    }
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
