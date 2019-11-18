import rangesCollection, {
  RangesCollection,
  RangesDocument,
  RangesProperties
} from "./ranges.collection"
import weaponsCollection, {
  WeaponsCollection,
  WeaponsDocument,
  WeaponsProperties
} from "./weapons.collection"
import clubsCollection, {
  ClubsCollection,
  ClubsDocument,
  ClubsProperties
} from "./clubs.collection"
import clubsMembersCollection, {
  ClubsMembersCollection,
  ClubsMembersDocument,
  ClubsMembersProperties
} from "./clubs.members.collection"
import eventsCollection, {
  EventsCollection,
  EventsDocument,
  EventsProperties
} from "./events.collection"
import eventsCategoriesCollection, {
  EventsCategoriesCollection,
  EventsCategoriesDocument,
  EventsCategoriesProperties
} from "./events.categories.collection"
import eventsDivisionsCollection, {
  EventsDivisionsCollection,
  EventsDivisionsDocument,
  EventsDivisionsProperties
} from "./events.divisions.collection"
import eventsContestantsCollection, {
  EventsContestantsCollection,
  EventsContestantsDocument,
  EventsContestantsProperties
} from "./events.contestants.collection"

export declare type DatabaseCollectionsNames = (
  "ranges" |
  "weapons" |
  "clubs" |
  "clubs_members" |
  "events" |
  "events_categories" |
  "events_divisions" |
  "events_contestants"
)

export declare interface DatabaseCollections {
  "ranges": RangesCollection
  "weapons": WeaponsCollection
  "clubs": ClubsCollection
  "clubs_members": ClubsMembersCollection
  "events": EventsCollection
  "events_categories": EventsCategoriesCollection
  "events_divisions": EventsDivisionsCollection
  "events_contestants": EventsContestantsCollection
}

export declare type DatabaseDocument = (
  RangesDocument |
  WeaponsDocument |
  ClubsDocument |
  ClubsMembersDocument |
  EventsDocument |
  EventsCategoriesDocument |
  EventsDivisionsDocument |
  EventsContestantsDocument
)

export declare type DatabaseDocumentsProperties = (
  RangesProperties |
  WeaponsProperties |
  ClubsProperties |
  ClubsMembersProperties |
  EventsProperties |
  EventsCategoriesProperties |
  EventsDivisionsProperties |
  EventsContestantsProperties
)

export default [
  rangesCollection,
  weaponsCollection,
  clubsCollection,
  clubsMembersCollection,
  eventsCollection,
  eventsCategoriesCollection,
  eventsDivisionsCollection,
  eventsContestantsCollection
]
