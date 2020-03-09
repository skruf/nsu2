import { RxCollection, RxDocument } from "rxdb"

export declare interface EventsCategoriesProperties {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export declare type EventsCategoriesDocument = RxDocument<
  EventsCategoriesProperties
>
export declare type EventsCategoriesCollection = RxCollection<
  EventsCategoriesProperties
>
