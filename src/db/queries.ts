import { getIdUtil, getTimestampUtil, promiseSequenceUtil } from "@/utils"
import { db } from "@/db"
import {
  BuildQuery,
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

const buildQuery: BuildQuery = async (
  collection, method, filter, options = {}
) => {
  let query = filter

  if(options.search && options.search.value) {
    const $or: any = []
    options.search.fields.forEach((field) => {
      $or.push({
        [field]: {
          $regex: new RegExp(
            `${options.search ? options.search.value : ""}`,
            "gi"
          )
        }
      })
    })
    query = {
      $and: [ { $or } ]
    }
    if(Object.keys(filter).length) query.$and.push(filter)
  }

  let operation: any = db[collection][method](query)

  if(options.sort) {
    // @TODO: bugfix sorting while searching
    if(options.search && options.search.value) {
    } else {
      operation = operation.sort(options.sort)
    }
  }

  if(options.skip && typeof options.skip === "number") {
    operation = operation.skip(options.skip)
  }

  if(options.limit && typeof options.limit === "number") {
    operation = operation.limit(options.limit)
  }

  return operation
}

export const count: CountQuery = async (
  collection, filter, defaultOptions = {}
) => {
  const options = { ...defaultOptions, skip: false, limit: false }
  const query = await buildQuery(collection, "find", filter, options)
  const docs = await query.exec()
  return docs.length
}

export const findMany: FindManyQuery = async (
  collection, filter, options = {}, json = false
) => {
  const query = await buildQuery(collection, "find", filter, options)
  const docs = await query.exec()
  const amount = await count(collection, filter, options)
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
  // const docs = await Promise.all(
  //   items.map((item: any) => insert(collection, item, json))
  // )

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
  collection, filter, options = {}
) => {
  const docs: any = await findMany(collection, filter, options, false)
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
