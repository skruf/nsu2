import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "@/db/queries"
import { getIdUtil, getTimestampUtil } from "@/utils"

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

const statics: EventsCategoriesStatics = {
  count: async function() {
    const docs = await this.find().exec()
    return docs.length
  }
}

const preInsert = (data: EventsCategoriesProperties) => {
  const timestamp = getTimestampUtil()
  data.id = getIdUtil()
  data.createdAt = timestamp
  data.updatedAt = timestamp
}

const preRemove = async (data: EventsCategoriesProperties) => {
  await destroyMany("events", {
    categoryId: data.id
  })
}

export default {
  collection: {
    name: "events_categories",
    schema: schema,
    statics: statics
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    },
    preInsert: {
      handle: preInsert,
      parallel: false
    }
  }
}
