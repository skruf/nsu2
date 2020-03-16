import { RxJsonSchema } from "rxdb"
import { ClubsSchema, ClubsProperties } from "./clubs.types"
import { db } from "@/db"

const schema: RxJsonSchema<ClubsSchema> = {
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
  await db.events
    .find({ organizerId: data.id })
    .update({ $set: { organizerId: undefined } })

  await db.clubs_members
    .find({ clubId: data.id })
    .update({ $set: { clubId: undefined } })
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
