import { RxCollection, RxDocument } from "rxdb"

export declare interface Properties {
  id: string
  name: string
  streetAddress?: string
  area: string
  country: string
  lat?: string
  lng?: string
  type: string
  createdAt: string
  updatedAt: string
  membersCount: number
}

export declare interface Statics {
  count: () => Promise<number>
}

export declare type Document = RxDocument<Properties>
export declare type Collection = RxCollection<Properties, Statics>

export declare interface Ranges {
  Properties: Properties
  Statics: Statics
  Document: Document
  Collection: Collection
}
