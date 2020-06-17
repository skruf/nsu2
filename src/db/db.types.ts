import { RxDatabase } from "rxdb"
import { RangesCollection } from "@/ranges/ranges.types"
import { ClubsCollection } from "@/clubs/clubs.types"
import { ClubsMembersCollection }
  from "@/clubs/members/clubs.members.types"
import { WeaponsCollection }
  from "@/weapons/weapons.types"
import { EventsCollection }
  from "@/events/events.types"
import { EventsCategoriesCollection }
  from "@/events/categories/events.categories.types"
import { EventsDivisionsCollection }
  from "@/events/divisions/events.divisions.types"
import { EventsContestantsCollection }
  from "@/events/contestants/events.contestants.types"

type DatabaseCollections = {
  ranges: RangesCollection,
  clubs: ClubsCollection,
  clubs_members: ClubsMembersCollection,
  weapons: WeaponsCollection,
  events: EventsCollection,
  events_categories: EventsCategoriesCollection,
  events_divisions: EventsDivisionsCollection,
  events_contestants: EventsContestantsCollection
}

export type Database = RxDatabase<DatabaseCollections>
