import { RxCollection, RxDocument } from "rxdb"

export declare interface WeaponsProperties {
  id: string
  number: string
  name: string
  category: string
  condition: string
  distance: number
  createdAt: string
  updatedAt: string
}

export declare type WeaponsDocument = RxDocument<WeaponsProperties>
export declare type WeaponsCollection = RxCollection<WeaponsProperties>
