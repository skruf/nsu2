// import { queryHelperUtil } from "@/utils"
import _cloneDeep from "lodash.clonedeep"

// interface Options {
//   list?: Function,
//   select?: Function,
//   create?: Function,
//   createMany?: Function,
//   removeOne?: Function,
//   removeMany?: Function,
//   editOne?: Function,
//   editMany?: Function
// }

type Options = any

interface Model {
  id: string
}

interface State {
  count?: number,
  listIsLoading?: boolean,
  listFilter?: any,
  list?: Model[],
  selectedIsLoading?: boolean,
  selected?: Model,
  createIsLoading?: boolean,
  createManyIsLoading?: boolean,
  removeOneIsLoading?: boolean,
  removeManyIsLoading?: boolean,
  editOneIsLoading?: boolean,
  editManyIsLoading?: boolean
}

interface Mutations {
  SET_LIST?: (state: State, items: Model[]) => void,
  SET_COUNT?: (state: State, count: number) => void,
  SET_LIST_LOADING?: (state: State, isLoading: boolean) => void,
  SET_LIST_FILTER?: (state: State, filter: any) => void,
  SET_SELECTED_LOADING?: (state: State, isLoading: boolean) => void,
  SET_SELECTED?: (state: State, item: Model) => void,
  SET_CREATE_LOADING?: (state: State, isLoading: boolean) => void,
  ADD_ONE?: (state: State, item: Model) => void,
  SET_CREATE_MANY_LOADING?: (state: State, isLoading: boolean) => void,
  ADD_MANY?: (state: State, result: { items: Model[], count: number }) => void,
  SET_REMOVE_LOADING?: (state: State, isLoading: boolean) => void,
  REMOVE_ONE?: (state: State, item: Model) => void,
  SET_REMOVE_MANY_LOADING?: (state: State, isLoading: boolean) => void,
  REMOVE_MANY?: (state: State, items: Model[]) => void,
  SET_EDIT_ONE_LOADING?: (state: State, isLoading: boolean) => void,
  EDIT_ONE?: (state: State, item: Model) => void,
  SET_EDIT_MANY_LOADING?: (state: State, isLoading: boolean) => void,
  EDIT_MANY?: (state: State, items: Model[]) => void
}

interface StateContext {
  commit: any,
  state?: State
}

interface Actions {
  list?: (ctx: StateContext, filter?: any) => Promise<any[]>
  select?: (ctx: StateContext, filter?: any) => Promise<any>
  create?: (ctx: StateContext, item: Record<string, unknown>) => Promise<any>
  createMany?: (ctx: StateContext, items: Record<string, unknown>[]) => Promise<any[]>
  removeOne?: (ctx: StateContext, item: Record<string, unknown>) => Promise<boolean>
  removeMany?: (ctx: StateContext, items: Record<string, unknown>[]) => Promise<boolean>
  editOne?: (ctx: StateContext, item: Record<string, unknown>) => Promise<any>
  editMany?: (ctx: StateContext, items: Record<string, unknown>[]) => Promise<any>
}

const defaultOptions = {}

export default (options?: Options) => {
  const config = { ...defaultOptions, ...options }

  const state: State = {}
  const mutations: Mutations = {}
  const actions: Actions = {}

  if(
    config.list ||
    config.create ||
    config.createMany ||
    config.removeOne ||
    config.removeMany ||
    config.editOne
  ) {
    state.count = 0
  }

  if(config.list || config.createMany || config.editMany) {
    mutations.SET_LIST = (state, items) => {
      state.list = items
    }
    mutations.SET_COUNT = (state, count) => {
      state.count = count
    }
  }

  if(config.list) {
    state.listIsLoading = false
    // state.listFilter = {}
    state.list = []

    mutations.SET_LIST_LOADING = (state, loading): void => {
      state.listIsLoading = loading
    }
    // mutations.SET_LIST_FILTER = (state, listFilter): void => {
    //   state.listFilter = listFilter
    // }

    actions.list = async function({ commit }, params = {}): Promise<any> {
      const { filter } = params
      commit("SET_LIST_LOADING", true)
      const listFilter = _cloneDeep(filter)
      const results = await config.list(listFilter)
      commit("SET_LIST", results.items)
      commit("SET_COUNT", results.count)
      commit("SET_LIST_LOADING", false)
      return results
    }
  }

  if(config.select) {
    state.selectedIsLoading = false
    state.selected = { id: "" }

    mutations.SET_SELECTED_LOADING = (state, loading) => {
      state.selectedIsLoading = loading
    }
    mutations.SET_SELECTED = (state, item) => {
      state.selected = item
    }

    actions.select = async ({ commit }, filter) => {
      commit("SET_SELECTED_LOADING", true)
      const item = await config.select(filter)
      commit("SET_SELECTED", item)
      commit("SET_SELECTED_LOADING", false)
      return item
    }
  }

  if(config.create) {
    state.createIsLoading = false

    mutations.SET_CREATE_LOADING = (state, loading) => {
      state.createIsLoading = loading
    }

    mutations.ADD_ONE = (state, item) => {
      state.list.unshift(item)
      // state.list = [ item, ...state.list ]
      state.count += 1

      // const options = queryHelperUtil(state)
      // if(state.list.length > options.limit) {
      //   state.list.pop()
      // }
    }

    actions.create = async ({ commit }, item) => {
      commit("SET_CREATE_LOADING", true)
      const created = await config.create(item)
      commit("ADD_ONE", created)
      commit("SET_CREATE_LOADING", false)
      return created
    }
  }

  if(config.createMany) {
    state.createManyIsLoading = false

    mutations.SET_CREATE_MANY_LOADING = (state, loading) => {
      state.createManyIsLoading = loading
    }

    mutations.ADD_MANY = (state, added) => {
      added.items.forEach((i) => state.list.unshift(i))
      state.count += added.count

      // const options = queryHelperUtil(state)
      // if(state.list.length > options.limit) {
      //   state.list.splice()
      // }
    }

    actions.createMany = async ({ commit }, items) => {
      commit("SET_CREATE_MANY_LOADING", true)
      const added = await config.createMany(items)
      commit("ADD_MANY", added)
      commit("SET_CREATE_MANY_LOADING", false)
      return added
    }
  }

  if(config.removeOne) {
    state.removeOneIsLoading = false

    mutations.SET_REMOVE_LOADING = (state, loading) => {
      state.removeOneIsLoading = loading
    }

    mutations.REMOVE_ONE = (state, item) => {
      state.list.splice(
        state.list.findIndex(({ id }) => item.id === id), 1
      )
      state.count -= 1
      if(state.selected && state.selected.id === item.id) {
        state.selected = { id: "" }
      }
    }

    actions.removeOne = async ({ commit }, item) => {
      commit("SET_REMOVE_LOADING", true)
      await config.removeOne(item)
      commit("REMOVE_ONE", item)
      commit("SET_REMOVE_LOADING", false)
      // if(actions.list) await actions.list({ commit, state })
      return true
    }
  }

  if(config.removeMany) {
    state.removeManyIsLoading = false

    mutations.SET_REMOVE_MANY_LOADING = (state, loading) => {
      state.removeManyIsLoading = loading
    }

    mutations.REMOVE_MANY = (state, items) => {
      items.forEach((item) => {
        state.list.splice(
          state.list.findIndex(({ id }) => item.id === id), 1
        )

        if(state.selected && state.selected.id === item.id) {
          state.selected = { id: "" }
        }
      })

      state.count -= items.length
    }

    actions.removeMany = async ({ commit, state }, items) => {
      commit("SET_REMOVE_MANY_LOADING", true)
      await config.removeMany(items)
      commit("REMOVE_MANY", items)
      commit("SET_REMOVE_MANY_LOADING", false)
      // if(actions.list) await actions.list({ commit, state })
      return true
    }
  }

  if(config.editOne) {
    state.editOneIsLoading = false

    mutations.SET_EDIT_ONE_LOADING = (state, loading) => {
      state.editOneIsLoading = loading
    }

    mutations.EDIT_ONE = (state, item) => {
      const index = state.list.findIndex(({ id }) => item.id === id)
      const list = state.list
      list[index] = item
      state.list = [ ...list ]
      if(state.selected && state.selected.id === item.id) {
        state.selected = item
      }
    }

    actions.editOne = async ({ commit }, item) => {
      commit("SET_EDIT_ONE_LOADING", true)
      const edited = await config.editOne(item)
      commit("EDIT_ONE", edited)
      commit("SET_EDIT_ONE_LOADING", false)
      return edited
    }
  }

  if(config.editMany) {
    state.editManyIsLoading = false

    mutations.SET_EDIT_MANY_LOADING = (state, loading) => {
      state.editManyIsLoading = loading
    }

    mutations.EDIT_MANY = (state, items) => {
      const list = state.list.map(
        (item) => items.filter((i) => i.id === item.id)[0] || item
      )
      state.list = [ ...list ]
    }

    actions.editMany = async ({ commit }, items) => {
      commit("SET_EDIT_MANY_LOADING", true)
      const edited = await config.editMany(items)
      commit("EDIT_MANY", edited)
      commit("SET_EDIT_MANY_LOADING", false)
      return edited
    }
  }

  return {
    state,
    mutations,
    actions
  }
}
