import { RxJsonSchema } from "rxdb"
import { WeaponsProperties } from "./weapons.types"
import { destroyMany } from "@/db/queries"
import { db } from "@/db"

const schema: RxJsonSchema = {
  title: "Weapons schema",
  description: "Weapons",
  version: 0,
  type: "object",
  indexes: [
    "number",
    "name",
    "category",
    "distance"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    number: {
      type: "string"
    },
    name: {
      type: "string"
    },
    category: {
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
    "distance"
  ]
}

const preRemove = async (data: WeaponsProperties): Promise<void> => {
  await destroyMany(db.events_contestants, {
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
