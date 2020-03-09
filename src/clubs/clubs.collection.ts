import { RxJsonSchema } from "rxdb"
import { destroyMany, findMany, updateMany } from "@/db/queries"
import { ClubsSchema, ClubsProperties } from "./clubs.types"

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
  await destroyMany("clubs_members", { clubId: data.id })

  const { items: events } = await findMany("events", {
    organizerId: data.id
  }, true)

  await updateMany("events", events.map(
    (event) => ({ ...event, organizerId: "" })
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
