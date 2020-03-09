import { RxCollection, RxDocument } from "rxdb"
import { RangesStatics } from "./ranges.collection"

export declare interface RangesProperties {
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

export declare type RangesDocument = RxDocument<RangesProperties>
export declare type RangesCollection = RxCollection<RangesProperties, RangesStatics>
