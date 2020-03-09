import { RxCollection, RxDocument } from "rxdb"
import { ClubsDocument } from "@/clubs/clubs.types"
import { RangesDocument } from "@/ranges/ranges.types"
import { EventsCategoriesDocument } from "./categories/events.categories.types"

export declare interface EventsProperties {
  id: string
  title: string
  startsAt: string
  endsAt: string
  approbated?: boolean
  categoryId?: string
  organizerId?: string
  rangeId?: string
  createdAt: string
  updatedAt: string
  club?: ClubsDocument
  range?: RangesDocument
  category?: EventsCategoriesDocument
}

export declare type EventsDocument = RxDocument<
  EventsProperties
>
export declare type EventsCollection = RxCollection<
  EventsProperties
>
