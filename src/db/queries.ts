import { RxCollection, MangoQuerySelector } from "rxdb"
import {
  getIdUtil,
  getTimestampUtil,
  promiseSequenceUtil
} from "@/utils"

// export declare type Collection = (
//   "events" |
//   "events_categories" |
//   "events_contestants" |
//   "events_divisions" |
//   "clubs" |
//   "clubs_members" |
//   "weapons" |
//   "ranges"
// )

// export type Filter<T> = RxQueryOptions<T> | { [P in keyof T]?: T[P] }

export const count = async <T>(
  collection: RxCollection,
  filter: MangoQuerySelector<T> = {}
): Promise<number> => {
  const { length } = await collection.find({
    selector: filter
  }).exec()
  return length
}

export const findMany = async <T>(
  collection: RxCollection,
  filter: MangoQuerySelector<T> = {},
  json = false
): Promise<{
  items: T[],
  count: number
}> => {
  const docs = await collection.find({
    selector: filter
  }).exec()
  const amount = await count<T>(collection)
  return {
    items: json ? docs.map((doc) => doc.toJSON()) : docs,
    count: amount
  }
}

export const findOne = async <T>(
  collection: RxCollection,
  filter: MangoQuerySelector<T>,
  json = false
): Promise<T | null> => {
  const doc = await collection.findOne({
    selector: filter
  }).exec()
  if(!doc) return null
  return json ? doc.toJSON() : doc
}

export const insert = async <T>(
  collection: RxCollection,
  data: T,
  json = false
): Promise<T> => {
  const timestamp = getTimestampUtil()
  const doc = await collection.insert({
    ...data,
    id: getIdUtil(),
    createdAt: timestamp,
    updatedAt: timestamp
  })
  return json ? doc.toJSON() : doc
}

export const insertMany = async <T>(
  collection: RxCollection,
  items: T[],
  json = false
): Promise<T[]> => {
  const docs = await promiseSequenceUtil(
    items.map(
      (item) => (): Promise<T> => insert(collection, item, json)
    )
  )
  return docs
}

export const destroyOne = async <T>(
  collection: RxCollection,
  filter: MangoQuerySelector<T>
): Promise<boolean | null> => {
  const doc = await collection.findOne({
    selector: filter
  }).exec()
  if(!doc) return null
  const result = await doc.remove()
  return result
}

export const destroyMany = async <T>(
  collection: RxCollection,
  filter: MangoQuerySelector<T>
): Promise<boolean[]> => {
  const docs = await findMany<T>(collection, filter, false)
  const result = await Promise.all(
    docs.items.map((doc: any) => doc.remove())
  )
  return result
}

export const updateOne = async <T>(
  collection: RxCollection,
  filter: MangoQuerySelector<T>,
  item: T,
  json = false
): Promise<T> => {
  const doc = await collection.findOne({
    selector: filter
  }).exec()
  if(!doc) return null
  await doc.atomicUpdate((old: T) => ({
    ...old,
    ...{
      ...item,
      updatedAt: getTimestampUtil()
    }
  }))
  return json ? doc.toJSON() : doc
}

export const updateMany = async <T>(
  collection: RxCollection,
  items: T[],
  filterKey = "id",
  json = false
): Promise<T[]> => {
  const docs = await Promise.all(
    items.map((item: any) => updateOne(
      collection, { [filterKey]: item[filterKey] }, item, json
    ))
  )
  return docs
}
