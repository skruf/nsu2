import RxDB, { RxDatabase, RxCollectionCreator } from "rxdb"
import RxDBSchemaCheckModule from "rxdb/plugins/schema-check"
import RxDBErrorMessagesModule from "rxdb/plugins/error-messages"
import router from "@/router"
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

export type Database = RxDatabase | null

RxDB.plugin(RxDBErrorMessagesModule)
RxDB.plugin(RxDBSchemaCheckModule)

let adapter: string

if(config.env !== "production" || process.env.VUE_APP_SEED) {
  adapter = "memory"
  RxDB.plugin(require("pouchdb-adapter-memory"))
} else {
  adapter = "idb"
  RxDB.plugin(require("pouchdb-adapter-idb"))
}

interface CollectionConfig {
  collection: RxCollectionCreator,
  middlewares?: {
    [key: string]: {
      handle: Function,
      parallel: boolean
    }
  }
}

const configureCollection = async (
  db: Database,
  config: CollectionConfig
): Promise<void> => {
  if(!db) return

  const timestamp = { type: "string", format: "date-time" }
  config.collection.schema.properties.updatedAt = timestamp
  config.collection.schema.properties.createdAt = {
    ...timestamp,
    index: true
  }

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
    db = await RxDB.create<Database>({
      name: "nsu",
      adapter: adapter,
      password: "nsu2020nsu2020nsu2020",
      multiInstance: false,
      queryChangeDetection: true
    })

    await Promise.all(collections.map(
      (config) => configureCollection(db, config))
    )
  } catch(e) {
    console.error(e)
    router.push({
      name: "ErrorScreen",
      params: { error: e.message }
    })
  }

  return db
}

export const reset = async (): Promise<void> => {
  await db.remove()
  db = null
  await init()
}
