import { RxJsonSchema } from "rxdb"
import { ClubsMembersProperties } from "./clubs.members.types"
import { destroyMany } from '@/db/queries'

const schema: RxJsonSchema = {
  title: "Clubs members schema",
  description: "Clubs members",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    firstName: {
      type: "string",
      index: true
    },
    lastName: {
      type: "string"
    },
    emailAddress: {
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
    "lastName",
    "country"
  ]
}

const preRemove = async (data: ClubsMembersProperties): Promise<void> => {
  await destroyMany("events_contestants", {
    clubMemberId: data.id
  })
}

export default {
  collection: {
    name: "clubs_members",
    schema: schema
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
