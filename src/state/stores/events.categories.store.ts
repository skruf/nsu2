import { eventsCategoriesService } from "@/services"
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
      list: eventsCategoriesService.list,
      select: eventsCategoriesService.select,
      create: eventsCategoriesService.create,
      removeOne: eventsCategoriesService.removeOne,
      removeMany: eventsCategoriesService.removeMany,
      editOne: eventsCategoriesService.editOne
    }
  }
]

export default extend(store, modules)
