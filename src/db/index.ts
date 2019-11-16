/* eslint-disable */
import RxDB, { RxDatabase, RxCollectionCreator } from "rxdb"
import RxDBSchemaCheckModule from "rxdb/plugins/schema-check"
import RxDBErrorMessagesModule from "rxdb/plugins/error-messages"
import configs, { DatabaseCollections } from "./collections"
import router from "@/router"
import config from "@/app.config"

export type Database = RxDatabase<DatabaseCollections> | null

RxDB.plugin(RxDBErrorMessagesModule)
RxDB.plugin(RxDBSchemaCheckModule)

let adapter: string

if(config.env === "test") {
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

  for(let middleware in config.middlewares) {
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
      queryChangeDetection: false
    })

    await Promise.all(configs.map(
      (config) => configureCollection(db, config))
    )
  } catch(e) {
    router.push({
      name: "ErrorScreen",
      params: { error: e.message }
    })
  }

  return db
}

export default {
  get(): Database {
    return db
  }
}
