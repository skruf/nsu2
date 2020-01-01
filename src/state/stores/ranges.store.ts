import extend from "@/state/extensions"
import rangesService from "@/services/ranges.service"
import { countriesFixture } from "@/fixtures"

export const state = {
  countries: countriesFixture,
  types: [ "Utebane", "Innebane" ]
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
      list: rangesService.list,
      select: rangesService.select,
      create: rangesService.create,
      removeOne: rangesService.removeOne,
      removeMany: rangesService.removeMany,
      editOne: rangesService.editOne
    }
  },
  {
    module: "pagination"
  },
  {
    module: "sorting"
  },
  {
    module: "search",
    options: { fields: [ "name", "area" ] }
  }
]

export default extend(store, modules)
