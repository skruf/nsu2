import eventsDivisionsService from "@/services/events.divisions.service"
import extend from "@/state/extensions"

const state = {}
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
