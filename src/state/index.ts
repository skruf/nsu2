import Vue from "vue"
import Vuex from "vuex"
import config from "@/app.config"
import {
  eventsStore,
  eventsCategoriesStore,
  eventsDivisionsStore,
  eventsContestantsStore,
  eventsDivisionsContestantsStore,
  clubsStore,
  clubsMembersStore,
  weaponsStore,
  rangesStore
} from "@/state/stores"

const stores = {
  events: {
    ...eventsStore,
    modules: {
      categories: eventsCategoriesStore,
      contestants: eventsContestantsStore,
      divisions: {
        ...eventsDivisionsStore,
        modules: {
          contestants: eventsDivisionsContestantsStore
        }
      }
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

export default store
