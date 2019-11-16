import Vue from "vue"
import Vuex from "vuex"
import config from "@/app.config"
import {
  eventsStore,
  eventsDivisionsStore,
  eventsContestantsStore,
  clubsStore,
  clubsMembersStore,
  weaponsStore,
  rangesStore
} from "@/state/stores"

const stores = {
  events: {
    ...eventsStore,
    // modules: {
    //   participants: eventsParticipantsStore,
    //   divisions: eventsDivisionsStore,
    //   contestants: {
    //     ...eventsContestantsStore,
    //     modules: {
    //       results: eventsContestantsResultsStore
    //     }
    //   }
    // }
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
