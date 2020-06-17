import { RxJsonSchema } from "rxdb"
import { ClubsSchema, ClubsProperties } from "./clubs.types"
import { db } from "@/db"

const schema: RxJsonSchema<ClubsSchema> = {
  title: "Clubs schema",
  description: "Clubs",
  version: 0,
  type: "object",
  indexes: [
    "name",
    "shortName",
    "zipCode"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string"
    },
    shortName: {
      type: "string"
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
    zipCode: {
      type: "string"
    },
    area: {
      type: "string"
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
    "zipCode",
    "area"
  ]
}

const preRemove = async (data: ClubsProperties): Promise<void> => {
  await db.events
    .find({ selector: { organizerId: data.id } })
    .update({ $set: { organizerId: undefined } })

  await db.clubs_members
    .find({ selector: { clubId: data.id } })
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
