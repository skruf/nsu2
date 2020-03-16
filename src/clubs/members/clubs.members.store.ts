import clubsMembersService from "./clubs.members.service"
import extend from "@/state/extensions"
import { countriesFixture } from "@/fixtures"

const state = {
  countries: countriesFixture,
  // listNoClub: [],
  // listNoClubIsLoading: false,
  // listNoClubCount: 0
}

const mutations = {
  // SET_LIST_NO_CLUB(state, list): void {
  //   state.listNoClub = list
  // },
  // SET_LIST_NO_CLUB_LOADING(state, loading): void {
  //   state.listNoClubIsLoading = loading
  // },
  // SET_LIST_NO_CLUB_COUNT(state, count): void {
  //   state.listNoClubCount = count
  // }
}

const actions = {
  // listNoClub: async function({ commit }): Promise<any> {
  //   commit("SET_LIST_NO_CLUB_LOADING", true)
  //   const results = await clubsMembersService.list({
  //     clubId: { $exists: false }
  //   })
  //   commit("SET_LIST_NO_CLUB", results.items)
  //   commit("SET_LIST_NO_CLUB_COUNT", results.count)
  //   commit("SET_LIST_NO_CLUB_LOADING", false)
  //   return results
  // }
}

const getters = {
  listByClubId: ({ list }) => (id) => (
    list.filter(({ clubId }) => clubId === id)
  ),
  listNoClub: (_, { listByClubId }) => (
    listByClubId(undefined)
  )
}

const store = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

const modules = [
  {
    module: "crud",
    options: {
      list: clubsMembersService.list,
      create: clubsMembersService.create,
      removeOne: clubsMembersService.removeOne,
      removeMany: clubsMembersService.removeMany,
      editOne: clubsMembersService.editOne
    }
  }
]

export default extend(store, modules)
