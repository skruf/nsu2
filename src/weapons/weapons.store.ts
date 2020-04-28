import weaponsService from "./weapons.service"
import extend from "@/state/extensions"
import { weaponsCategoriesFixture, weaponsConditionsFixture }
  from "@/fixtures"

const state = {
  categories: weaponsCategoriesFixture,
  conditions: weaponsConditionsFixture,
  sortBy: "name"
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
      list: weaponsService.list,
      select: weaponsService.select,
      create: weaponsService.create,
      removeOne: weaponsService.removeOne,
      removeMany: weaponsService.removeMany,
      editOne: weaponsService.editOne
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
    options: { fields: [ "name" ] }
  }
]

export default extend(store, modules)
