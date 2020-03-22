import clubsMembersService from "./clubs.members.service"
import extend from "@/state/extensions"
import { countriesFixture } from "@/fixtures"

const state = {
  countries: countriesFixture
}

const mutations = {}
const actions = {}

const getters = {
  listByClubId: ({ list }) => (id) => (
    list.filter(({ clubId }) => clubId === id)
  ),
  listNoClub: ({ list }) => (
    list.filter(({ clubId }) => !clubId || clubId === "")
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
