import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "@/db/queries"
import { db } from "@/db"

export declare interface EventsCategoriesProperties {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
interface EventsCategoriesStatics {
  count: () => Promise<number>
}

export declare type EventsCategoriesDocument = RxDocument<
  EventsCategoriesProperties
>
export declare type EventsCategoriesCollection = RxCollection<
  EventsCategoriesProperties,
  EventsCategoriesStatics
>

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

const preRemove = async (data: EventsCategoriesProperties) => {
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
