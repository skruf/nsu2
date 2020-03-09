import extend from "@/state/extensions"
import eventsDivisionsService from "./events.divisions.service"
import { EventsDivisionsProperties } from "./events.divisions.types"

const state = {}
const mutations = {}
const actions = {
  create: async ({ commit }, item: EventsDivisionsProperties): Promise<
    EventsDivisionsProperties
  > => {
    commit("SET_CREATE_LOADING", true)
    const created = await eventsDivisionsService.create(item)
    commit("ADD_ONE", created)
    commit("SET_SELECTED", created)
    commit("SET_CREATE_LOADING", false)
    return created
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
      list: eventsDivisionsService.list,
      select: eventsDivisionsService.select,
      create: eventsDivisionsService.create,
      removeOne: eventsDivisionsService.removeOne,
      removeMany: eventsDivisionsService.removeMany,
      editOne: eventsDivisionsService.editOne
    }
  }
]

export default extend(store, modules)
