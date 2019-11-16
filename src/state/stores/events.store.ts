import eventsService from "@/services/events.service"
import extend from "@/state/extensions"
import { queryHelperUtil } from "@/utils"

const state = {
  fetchMode: ""
}

const mutations = {
  SET_FETCH_MODE: (state, fetchMode) => {
    state.fetchMode = fetchMode
  }
}

const actions = {
  list: async ({ commit, state }, filter = {}) => {
    commit("SET_LIST_LOADING", true)
    const config = queryHelperUtil(state)
    const results = await eventsService.list(filter, config, state.fetchMode)
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
