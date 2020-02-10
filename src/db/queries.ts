import { getIdUtil, getTimestampUtil, promiseSequenceUtil } from "@/utils"
import { db } from "@/db"
import {
  CountQuery,
  FindManyQuery,
  FindOneQuery,
  InsertQuery,
  InsertManyQuery,
  DestroyOneQuery,
  DestroyManyQuery,
  UpdateOneQuery,
  UpdateManyQuery
} from "@/db/queries.d"

export const count: CountQuery = async (collection, filter = {}) => {
  const { length } = await db[collection].find(filter).exec()
  return length
}

export const findMany: FindManyQuery = async (
  collection, filter, json = false
) => {
  const docs: any = await db[collection].find(filter).exec()
  const amount = await count(collection)
  return {
    items: json ? docs.map((doc) => doc.toJSON()) : docs,
    count: amount
  }
}

export const findOne: FindOneQuery = async (
  collection, filter, json = false
) => {
  const doc = await db[collection].findOne(filter).exec()
  if(!doc) return null
  return json ? doc.toJSON() : doc
}

export const insert: InsertQuery = async (
  collection, data, json = false
) => {
  const timestamp = getTimestampUtil()
  data.id = getIdUtil()
  data.createdAt = timestamp
  data.updatedAt = timestamp
  const doc = await db[collection].insert(data)
  return json ? doc.toJSON() : doc
}

export const insertMany: InsertManyQuery = async (
  collection, items, json = false
) => {
  const docs = await promiseSequenceUtil(
    items.map((item: any) => () => insert(collection, item, json))
  )
  return docs
}

export const destroyOne: DestroyOneQuery = async (
  collection, filter
) => {
  const doc = await db[collection].findOne(filter).exec()
  if(!doc) return null
  const result = await doc.remove()
  return result
}

export const destroyMany: DestroyManyQuery = async (
  collection, filter
) => {
  const docs: any = await findMany(collection, filter, false)
  const result = await Promise.all(
    docs.items.map((doc: any) => doc.remove())
  )
  return result
}

export const updateOne: UpdateOneQuery = async (
  collection, filter, item, json = false
) => {
  const doc = await db[collection].findOne(filter).exec()
  if(!doc) return null
  item.updatedAt = getTimestampUtil()
  await doc.atomicUpdate((old: any) => ({ ...old, ...item }))
  return json ? doc.toJSON() : doc
}

export const updateMany: UpdateManyQuery = async (
  collection, items, filterKey = "id", json = false
) => {
  const docs = await Promise.all(
    items.map((item: any) => updateOne(
      collection, { [filterKey]: item[filterKey] }, item, json
    ))
  )
  return docs
}
