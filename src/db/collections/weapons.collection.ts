import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
// import { destroyMany } from "@/db/queries"

export declare interface WeaponsProperties {
  id: string
  number: string
  name: string
  category: string
  condition: string
  distance: number
  createdAt: string
  updatedAt: string
}

export declare type WeaponsDocument = RxDocument<WeaponsProperties>
export declare type WeaponsCollection = RxCollection<WeaponsProperties>

const schema: RxJsonSchema = {
  title: "Weapons schema",
  description: "Weapons",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    number: {
      type: "string",
      index: true
    },
    name: {
      type: "string",
      index: true
    },
    category: {
      type: "string",
      index: true
    },
    condition: {
      type: "string"
    },
    distance: {
      type: "number"
    }
  },
  required: [
    "number",
    "name",
    "category",
    "condition",
    "distance"
  ]
}

// const preRemove = async (data: WeaponsProperties) => {
//   await destroyMany("events_participants_weapons", {
//     classId: data.id
//   })
// }

export default {
  collection: {
    name: "weapons",
    schema: schema
  },
  // middlewares: {
  //   preRemove: {
  //     handle: preRemove,
  //     parallel: false
  //   }
  // }
}
