import clubsService from "./clubs.service"
import extend from "@/state/extensions"
import { countriesFixture } from "@/fixtures"

export const state = {
  countries: countriesFixture
}
const mutations = {}
const actions = {}
const getters = {}

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
      list: clubsService.list,
      select: clubsService.select,
      create: clubsService.create,
      removeOne: clubsService.removeOne,
      removeMany: clubsService.removeMany,
      editOne: clubsService.editOne
    }
  }
]

export default extend(store, modules)
