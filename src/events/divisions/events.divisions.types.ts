import { RxCollection, RxDocument } from "rxdb"
import { EventsDocument } from "../events.types"

export declare interface EventsDivisionsProperties {
  id: string
  day: string
  startsAt: string
  distance: number
  standsCount: number
  eventId: string
  autoAssign: boolean
  createdAt: string
  updatedAt: string
  event?: EventsDocument
  contestantsCount: number
}

export declare type EventsDivisionsDocument = RxDocument<
  EventsDivisionsProperties
>
export declare type EventsDivisionsCollection = RxCollection<
  EventsDivisionsProperties
>
