interface Options {
  action: string
}

interface State {
  sortBy: string
}

const defaultOptions = {
  action: "list"
}

export default (options?: Options) => {
  const config = { ...defaultOptions, ...options }

  const state: State = {
    sortBy: "-createdAt"
  }

  const mutations = {
    SET_SORTING: (state: State, { prop, order }) => {
      state.sortBy = prop
      if(order === "ascending") {
        state.sortBy = `-${state.sortBy}`
      }
    }
  }

  const actions = {
    setSorting: async ({ commit, dispatch }, sorting: string) => {
      commit("SET_SORTING", sorting)
      await dispatch(config.action)
    }
  }

  return {
    state,
    mutations,
    actions
  }
}
