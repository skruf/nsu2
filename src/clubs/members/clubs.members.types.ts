import { RxCollection, RxDocument } from "rxdb"
import { ClubsProperties } from "../clubs.types"

export declare interface ClubsMembersSchema {
  id: string
  firstName: string
  lastName: string
  emailAddress?: string
  streetAddress?: string
  phoneNumber?: string
  country?: string
  clubId: string
}

export declare interface ClubsMembersProperties extends ClubsMembersSchema {
  createdAt: string
  updatedAt: string
  club?: ClubsProperties
}

export declare type ClubsMembersDocument = RxDocument<ClubsMembersProperties>
export declare type ClubsMembersCollection = RxCollection<ClubsMembersProperties>
