import { RxJsonSchema } from "rxdb"
import { db } from "@/db"
import { EventsCategoriesProperties } from "./events.categories.types"

const schema: RxJsonSchema = {
  title: "Events categories schema",
  description: "Events categories",
  version: 1,
  type: "object",
  indexes: [
    "name"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string"
    }
  },
  required: [
    "name"
  ]
}

const preRemove = async (data: EventsCategoriesProperties): Promise<void> => {
  await db.events_contestants
    .find({ selector: { categoryId: data.id } })
    .update({ $set: { categoryId: undefined } })
}

export default {
  collection: {
    name: "events_categories",
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
