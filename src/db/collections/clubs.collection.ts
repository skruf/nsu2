import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany, findMany, updateMany } from "@/db/queries"
import { EventsDocument } from "@/db/collections/events.collection"
import { RangesProperties } from "@/db/collections/ranges.collection"

export declare interface ClubsProperties {
  id: string
  name: string
  shortName: string
  leaderFullName?: string
  emailAddress?: string
  phoneNumber?: string
  streetAddress?: string
  area: string
  country?: string
  websiteUrl?: string
  rangeId?: string
  createdAt: string
  updatedAt: string
  membersCount?: number
  range?: RangesProperties
}

export declare type ClubsDocument = RxDocument<
  ClubsProperties
>
export declare type ClubsCollection = RxCollection<
  ClubsProperties
>

const schema: RxJsonSchema = {
  title: "Clubs schema",
  description: "Clubs",
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
    shortName: {
      type: "string",
      index: true
    },
    leaderFullName: {
      type: "string"
    },
    emailAddress: {
      type: "string"
    },
    phoneNumber: {
      type: "string"
    },
    streetAddress: {
      type: "string"
    },
    area: {
      type: "string",
      index: true
    },
    country: {
      type: "string"
    },
    websiteUrl: {
      type: "string"
    },
    rangeId: {
      type: "string",
      ref: "ranges"
    }
  },
  required: [
    "name",
    "shortName",
    "area"
  ]
}

const preRemove = async (data: ClubsProperties): Promise<void> => {
  await destroyMany("clubs_members", { clubId: data.id })

  const { items: events } = await findMany("events", {
    organizerId: data.id
  }, true)

  await updateMany("events", events.map(
    (event: EventsDocument) => ({ ...event, organizerId: "" })
  ))
}

export default {
  collection: {
    name: "clubs",
    schema: schema
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
