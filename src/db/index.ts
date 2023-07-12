import {
  createRxDatabase,
  addRxPlugin,
  RxCollectionCreator
} from "rxdb"
import config from "@/app.config"
import rangesCollection from "@/ranges/ranges.collection"
import clubsCollection from "@/clubs/clubs.collection"
import clubsMembersCollection
  from "@/clubs/members/clubs.members.collection"
import weaponsCollection
  from "@/weapons/weapons.collection"
import eventsCollection
  from "@/events/events.collection"
import eventsCategoriesCollection
  from "@/events/categories/events.categories.collection"
import eventsDivisionsCollection
  from "@/events/divisions/events.divisions.collection"
import eventsContestantsCollection
  from "@/events/contestants/events.contestants.collection"

import { Database } from "./db.types"

import { RxDBValidatePlugin } from "rxdb/plugins/validate"
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder"
import { RxDBUpdatePlugin } from "rxdb/plugins/update"
import { RxDBEncryptionPlugin } from "rxdb/plugins/encryption"
import { RxDBMigrationPlugin } from "rxdb/plugins/migration"

addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBEncryptionPlugin)
addRxPlugin(RxDBMigrationPlugin)

export const collections = [
  rangesCollection,
  clubsCollection,
  clubsMembersCollection,
  weaponsCollection,
  eventsCollection,
  eventsCategoriesCollection,
  eventsDivisionsCollection,
  eventsContestantsCollection
]

// if(config.env !== "production") {
//   addRxPlugin(require("rxdb/plugins/dev-mode").RxDBDevModePlugin)
// }

let adapter: string

if(config.env !== "production" || process.env.VUE_APP_SEED) {
  adapter = "memory"
  addRxPlugin(require("pouchdb-adapter-memory"))
} else {
  adapter = "idb"
  addRxPlugin(require("pouchdb-adapter-idb"))
}

interface CollectionConfig {
  collection: RxCollectionCreator,
  middlewares?: {
    [key: string]: {
      handle: (data) => Promise<void>,
      parallel: boolean
    }
  }
}

const configureCollection = async (
  db: Database,
  config // CollectionConfig
): Promise<void> => {
  if(!db) return

  const timestamp = { type: "string", format: "date-time" }

  if(!config.collection.schema.indexes) {
    config.collection.schema.indexes = []
  }

  config.collection.schema.indexes.push("createdAt")
  config.collection.schema.indexes.push("updatedAt")

  config.collection.schema.properties.createdAt = timestamp
  config.collection.schema.properties.updatedAt = timestamp

  const collection = await db.collection(config.collection)

  for(const middleware in config.middlewares) {
    const { handle, parallel } = config.middlewares[middleware]
    collection[middleware](handle, parallel)
  }
}

export let db: Database = null

export const init = async (): Promise<Database> => {
  if(db !== null) return db

  try {
    db = await createRxDatabase<Database>({
      name: "nsu",
      adapter: adapter,
      password: "nsu2020nsu2020nsu2020",
      multiInstance: false,
      eventReduce: true
    })

    await Promise.all(collections.map(
      (config) => configureCollection(db, config))
    )
  } catch(e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }

  return db
}

export const reset = async (): Promise<void> => {
  await db.remove()
  db = null
  await init()
}
