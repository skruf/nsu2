import { RxJsonSchema } from "rxdb"
import { WeaponsProperties } from "./weapons.types"
import { destroyMany } from "@/db/queries"

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
    // condition: {
    //   type: "string",
    //   index: true
    // },
    distance: {
      type: "number",
      index: true
    }
  },
  required: [
    "number",
    "name",
    "category",
    // "condition",
    "distance"
  ]
}

const preRemove = async (data: WeaponsProperties): Promise<void> => {
  await destroyMany("events_contestants", {
    weaponId: data.id
  })
}

export default {
  collection: {
    name: "weapons",
    schema: schema
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
