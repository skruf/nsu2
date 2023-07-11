import { db } from "@/db"
import { RxJsonSchema } from "rxdb"
import { RangesProperties, } from "./ranges.types"

export declare interface RangesStatics {
  count: () => Promise<number>
}

const schema: RxJsonSchema = {
  title: "Ranges schema",
  description: "Ranges",
  version: 1,
  type: "object",
  indexes: [
    "name",
    "streetAddress",
    "area",
    "country",
    "type"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string"
    },
    streetAddress: {
      type: "string"
    },
    area: {
      type: "string"
    },
    country: {
      type: "string"
    },
    lat: {
      type: "string"
    },
    lng: {
      type: "string"
    },
    type: {
      type: "string"
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
    .find({ selector: { rangeId: data.id } })
    .update({ $set: { rangeId: undefined } })

  await db.events
    .find({ selector: { rangeId: data.id } })
    .update({ $set: { rangeId: undefined } })
}

export default {
  collection: {
    name: "ranges",
    schema: schema,
    statics: statics,
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
