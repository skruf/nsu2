import { db } from "@/db"
import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"

export declare interface RangesProperties {
  id: string
  name: string
  streetAddress?: string
  area: string
  country: string
  lat?: string
  lng?: string
  type: string
  createdAt: string
  updatedAt: string
}

interface RangesStatics {
  count: () => Promise<number>
}

export declare type RangesDocument = RxDocument<RangesProperties>
export declare type RangesCollection = RxCollection<RangesProperties, RangesStatics>

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
      type: "string"
    },
    area: {
      type: "string"
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
  const clubs = await db.clubs.find({ rangeId: data.id })
  await clubs.update({ $set: { rangeId: "" } })

  const events = await db.events.find({ rangeId: data.id })
  await events.update({ $set: { rangeId: "" } })
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
