import extend from "@/state/extensions"
import { eventsContestantsService } from "@/services"

const state = {}
const mutations = {}
const actions = {
  editOne: async ({ commit }, item) => {
    commit("SET_EDIT_ONE_LOADING", true)
    const edited = await eventsContestantsService.editOne(item)
    commit("EDIT_ONE", edited)
    commit("SET_EDIT_ONE_LOADING", false)
    if(item.currentDivisionId) {
      if(item.currentDivisionId !== item.divisionId) {
        commit("events/divisions/contestants/REMOVE_ONE", edited, { root: true })
      } else {
        commit("events/divisions/contestants/EDIT_ONE", edited, { root: true })
      }
    }
    return edited
  },

  removeOne: async ({ commit }, item) => {
    commit("SET_REMOVE_LOADING", true)
    await eventsContestantsService.removeOne(item)
    commit("REMOVE_ONE", item)
    commit("events/divisions/contestants/REMOVE_ONE", item, { root: true })
    commit("SET_REMOVE_LOADING", false)
    return true
  },

  removeMany: async ({ commit }, items) => {
    commit("SET_REMOVE_MANY_LOADING", true)
    await eventsContestantsService.removeMany(items)
    commit("REMOVE_MANY", items)
    commit("events/divisions/contestants/REMOVE_MANY", items, { root: true })
    commit("SET_REMOVE_MANY_LOADING", false)
    return true
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
      list: eventsContestantsService.list,
      select: eventsContestantsService.select,
      create: eventsContestantsService.create,
      createMany: eventsContestantsService.createMany,
      removeOne: eventsContestantsService.removeOne,
      removeMany: eventsContestantsService.removeMany,
      editMany: eventsContestantsService.editMany,
      editOne: eventsContestantsService.editOne
    }
  }
]

export default extend(store, modules)
