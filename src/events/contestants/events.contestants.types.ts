import { RxCollection, RxDocument } from "rxdb"
import { WeaponsDocument } from "@/weapons/weapons.types"
import { EventsDocument } from "@/events/events.types"
import { ClubsMembersDocument } from "@/clubs/members/clubs.members.types"
import { EventsDivisionsDocument } from "../divisions/events.divisions.types"
import { EventsContestantsStatics } from "./events.contestants.collection"

export declare interface EventsContestantsProperties {
  id: string
  number: number
  day: string
  time: string
  stand: number
  calibre: number
  condition: string
  hits: { hit: number, sum: number }[]
  total: number
  measurement: number
  weaponId: string
  eventId: string
  divisionId: string
  clubMemberId: string
  colour: string
  createdAt: string
  updatedAt: string
  weapon?: WeaponsDocument
  event?: EventsDocument
  division?: EventsDivisionsDocument
  clubMember?: ClubsMembersDocument
}

export declare type EventsContestantsDocument = RxDocument<
  EventsContestantsProperties
>
export declare type EventsContestantsCollection = RxCollection<
  EventsContestantsProperties,
  EventsContestantsStatics
>
