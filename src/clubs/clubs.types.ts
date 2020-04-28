import { RxCollection, RxDocument } from "rxdb"
import { RangesProperties } from "@/ranges/ranges.types"

export declare interface ClubsSchema {
  id: string
  name: string
  shortName: string
  leaderFullName?: string
  emailAddress?: string
  phoneNumber?: string
  streetAddress?: string
  zipCode: string
  area: string
  country?: string
  websiteUrl?: string
  rangeId?: string
}

export declare interface ClubsProperties extends ClubsSchema {
  createdAt: string
  updatedAt: string
  membersCount?: number
  range?: RangesProperties
}

export declare type ClubsDocument = RxDocument<ClubsProperties>
export declare type ClubsCollection = RxCollection<ClubsProperties>
