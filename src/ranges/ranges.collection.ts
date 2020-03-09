import { db } from "@/db"
import { RxJsonSchema } from "rxdb"
import { RangesProperties, } from "./ranges.types"

export declare interface RangesStatics {
  count: () => Promise<number>
}

const schema: RxJsonSchema = {
  title: "Ranges schema",
  description: "Ranges",
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
    },
    streetAddress: {
      type: "string",
      index: true
    },
    area: {
      type: "string",
      index: true
    },
    country: {
      type: "string",
      index: true
    },
    lat: {
      type: "string"
    },
    lng: {
      type: "string"
    },
    type: {
      type: "string",
      index: true
    }
  },
  required: [
    "name",
    "area",
    "country",
    "type"
  ]
}

const statics: RangesStatics = {
  count: async function(): Promise<number> {
    const docs = await this.find().exec()
    return docs.length
  }
}

const preRemove = async (data: RangesProperties): Promise<void> => {
  await db.clubs
    .find({ rangeId: data.id })
    .update({ $set: { rangeId: undefined } })

  await db.events
    .find({ rangeId: data.id })
    .update({ $set: { rangeId: undefined } })
}

export default {
  collection: {
    name: "ranges",
    schema: schema,
    statics: statics
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
