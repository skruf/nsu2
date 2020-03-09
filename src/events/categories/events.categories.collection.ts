import { RxJsonSchema } from "rxdb"
import { db } from "@/db"
import { EventsCategoriesProperties } from "./events.categories.types"

const schema: RxJsonSchema = {
  title: "Events categories schema",
  description: "Events categories",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string",
      index: true
    }
  },
  required: [
    "name"
  ]
}

const preRemove = async (data: EventsCategoriesProperties): Promise<void> => {
  await db.events_contestants
    .find({ categoryId: data.id })
    .update({ $set: { categoryId: undefined } })
}

export default {
  collection: {
    name: "events_categories",
    schema: schema
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
