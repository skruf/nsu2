import { RxJsonSchema } from "rxdb"
import { ClubsMembersProperties } from "./clubs.members.types"
import { destroyMany } from '@/db/queries'
import { db } from "@/db"

const schema: RxJsonSchema = {
  title: "Clubs members schema",
  description: "Clubs members",
  version: 1,
  type: "object",
  indexes: [
    "firstName"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    firstName: {
      type: "string"
    },
    lastName: {
      type: "string"
    },
    emailAddress: {
      type: "string"
    },
    streetAddress: {
      type: "string"
    },
    country: {
      type: "string"
    },
    phoneNumber: {
      type: "string"
    },
    clubId: {
      type: "string",
      ref: "clubs"
    }
  },
  required: [
    "firstName",
    "lastName"
  ]
}

const preRemove = async (data: ClubsMembersProperties): Promise<void> => {
  await destroyMany(db.events_contestants, {
    clubMemberId: data.id
  })
}

export default {
  collection: {
    name: "clubs_members",
    schema: schema,
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
