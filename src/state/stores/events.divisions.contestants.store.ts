import extend from "@/state/extensions"
import {
  eventsContestantsService,
  eventsDivisionsService
} from "@/services"

// const rootDispatch = (dispatch, path, payload) => {
//   dispatch(path, payload, { root: true })
// }
// const rootCommit = (commit, path, payload) => {
//   commit(path, payload, { root: true })
// }

const state = {}
const mutations = {}
const actions = {
  reorder: ({ commit, dispatch, state }, { newIndex, oldIndex }): void => {
    const c1 = { ...state.list[newIndex], stand: oldIndex + 1 }
    const c2 = { ...state.list[oldIndex], stand: newIndex + 1 }
    dispatch("editMany", [ c1, c2 ])
    commit("events/contestants/EDIT_MANY", [ c1, c2 ], { root: true })
    // dispatch("events/divisions/contestants/list", { filter: { divisionId: c1.division.id } }, { root: true })
  },
  removeOne: async ({ commit, dispatch }, contestant): Promise<void> => {
    const contestantToRemove = { ...contestant, divisionId: undefined }
    const t = await dispatch("editOne", contestantToRemove)
    commit("REMOVE_ONE", contestantToRemove)
    commit("events/contestants/EDIT_ONE", contestantToRemove, { root: true })
    // dispatch("events/contestants/list", { filter: { contestant: c1.division.id } }, { root: true })
  },
  autoAssign: async ({ dispatch }, division): Promise<void> => {
    await eventsDivisionsService.autoAssign(division)
    dispatch("list", { filter: { divisionId: division.id } })
    dispatch("events/contestants/list", { filter: { eventId: division.eventId } }, { root: true })
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
