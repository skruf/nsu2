interface Options {
  action: string
}

interface State {
  sortBy: string
  sortDesc: boolean
}

const defaultOptions = {
  action: "list"
}

export default (options?: Options) => {
  const config = { ...defaultOptions, ...options }

  const state: State = {
    sortBy: "-createdAt",
    sortDesc: false
  }

  const mutations = {
    SET_SORTING: (state: State, prop = "-createdAt"): void => {
      state.sortBy = prop
    },
    SET_ORDER: (state: State, sortDesc: string): void => {
      if(sortDesc) state.sortBy = `-${state.sortBy}`
    }
  }

  const actions = {
    setSorting: async ({ commit, dispatch }, sorting: string): Promise<void> => {
      commit("SET_SORTING", sorting)
      await dispatch(config.action)
    },
    setOrder: async ({ commit, dispatch }, order: string): Promise<void> => {
      commit("SET_ORDER", order)
      await dispatch(config.action)
    },
  }

  return {
    state,
    mutations,
    actions
  }
}
