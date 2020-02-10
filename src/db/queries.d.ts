import { RxQuery, RxQueryOptions } from "rxdb"
import {
  DatabaseCollections,
  DatabaseDocument,
  DatabaseCollectionsNames,
  DatabaseDocumentsProperties
} from "@/db/collections"

export declare type QueryFilter = RxQueryOptions

type QueryMethods = (
  "insert" |
  "newDocument" |
  "upsert" |
  "atomicUpsert" |
  "find" |
  "findOne" |
  "dump"
)

export declare type QueryResult = (
  DatabaseDocument | DatabaseDocumentsProperties
)

export declare type CountQuery = (
  collection: DatabaseCollectionsNames,
  filter?: QueryFilter
) => Promise<number>

export declare type FindManyQuery = (
  collection: DatabaseCollectionsNames,
  filter: QueryFilter,
  json?: boolean
) => Promise<{
  items: QueryResult[],
  count: number
}>

export declare type FindOneQuery = (
  collection: DatabaseCollectionsNames,
  filter: QueryFilter,
  json?: boolean
) => Promise<DatabaseDocument | object | null | any>

export declare type InsertQuery = (
  collection: DatabaseCollectionsNames,
  data: DatabaseDocumentsProperties | any,
  json?: boolean
) => Promise<DatabaseDocument | any>

export declare type InsertManyQuery = (
  collection: DatabaseCollectionsNames,
  items: DatabaseDocument[],
  json?: boolean
) => Promise<DatabaseDocument[] | object[]>

export declare type DestroyOneQuery = (
  collection: DatabaseCollectionsNames,
  filter: QueryFilter
) => Promise<boolean | null>

export declare type DestroyManyQuery = (
  collection: DatabaseCollectionsNames,
  filter: QueryFilter
) => Promise<any>

export declare type UpdateOneQuery = (
  collection: DatabaseCollectionsNames,
  filter: QueryFilter,
  item: DatabaseDocument | any,
  json?: boolean
) => Promise<DatabaseDocument | object | null | any>

export declare type UpdateManyQuery = (
  collection: DatabaseCollectionsNames,
  items: DatabaseDocument[] | any,
  filterKey?: string,
  json?: boolean
) => Promise<any>
