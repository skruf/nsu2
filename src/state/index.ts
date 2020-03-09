import Vue from "vue"
import Vuex from "vuex"
import config from "@/app.config"
import subscribe from "./subscribe"
import rangesStore from "@/ranges/ranges.store"
import clubsStore from "@/clubs/clubs.store"
import clubsMembersStore from "@/clubs/members/clubs.members.store"
import weaponsStore from "@/weapons/weapons.store"
import eventsStore from "@/events/events.store"
import eventsCategoriesStore from "@/events/categories/events.categories.store"
import eventsDivisionsStore from "@/events/divisions/events.divisions.store"
import eventsContestantsStore from "@/events/contestants/events.contestants.store"

const stores = {
  events: {
    ...eventsStore,
    modules: {
      categories: eventsCategoriesStore,
      contestants: eventsContestantsStore,
      divisions: eventsDivisionsStore
    }
  },
  clubs: {
    ...clubsStore,
    modules: {
      members: clubsMembersStore
    }
  },
  weapons: weaponsStore,
  ranges: rangesStore
}

Vue.config.devtools = true
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: config.env !== "production",
  modules: stores
})

subscribe(store)

export default store
