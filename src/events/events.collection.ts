import { RxJsonSchema } from "rxdb"
import { destroyMany } from "@/db/queries"
import { EventsProperties } from "./events.types"

const schema: RxJsonSchema = {
  title: "Events schema",
  description: "Events",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    title: {
      type: "string",
      index: true
    },
    startsAt: {
      type: "string",
      format: "date",
      index: true
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
      ref: "events_categories",
      index: true
    },
    organizerId: {
      type: "string",
      ref: "clubs",
      index: true
    },
    rangeId: {
      type: "string",
      ref: "ranges",
      index: true
    }
  },
  required: [
    "title",
    "startsAt",
    "endsAt"
  ]
}

const preRemove = async (data: EventsProperties): Promise<void> => {
  await destroyMany("events_divisions", {
    eventId: data.id
  })
  await destroyMany("events_contestants", {
    eventId: data.id
  })
}

export default {
  collection: {
    name: "events",
    schema: schema
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}