import extend from "@/state/extensions"
import eventsService from "./events.service"

const state = {}
const mutations = {}

const actions = {
  list: async ({ commit, state }, filter = {}): Promise<void> => {
    commit("SET_LIST_LOADING", true)
    const results = await eventsService.list(filter)
    commit("SET_LIST", results.items)
    commit("SET_COUNT", results.count)
    commit("SET_LIST_LOADING", false)
  }
}

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
      list: eventsService.list,
      select: eventsService.select,
      create: eventsService.create,
      removeOne: eventsService.removeOne,
      removeMany: eventsService.removeMany,
      editOne: eventsService.editOne
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
    options: { fields: [ "title" ] }
  }
]

export default extend(store, modules)
