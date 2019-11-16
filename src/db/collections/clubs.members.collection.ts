import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "@/db/queries"
import { ClubsProperties } from "@/db/collections/clubs.collection"

export declare interface ClubsMembersProperties {
  id: string
  firstName: string
  lastName: string
  emailAddress?: string
  phoneNumber?: string
  country?: string
  clubId: string
  createdAt: string
  updatedAt: string
  club?: ClubsProperties
}

export declare type ClubsMembersDocument = RxDocument<
  ClubsMembersProperties
>
export declare type ClubsMembersCollection = RxCollection<
  ClubsMembersProperties
>

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
    "country",
    "clubId"
  ]
}

// const preRemove = async (data: ClubsMembersProperties) => {
//   await destroyMany("events_participants", {
//     memberId: data.id
//   })
// }

export default {
  collection: {
    name: "clubs_members",
    schema: schema
  },
  // middlewares: {
  //   preRemove: {
  //     handle: preRemove,
  //     parallel: false
  //   }
  // }
}
