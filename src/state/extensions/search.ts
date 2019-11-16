interface Options {
  action: string,
  fields: string[]
}

interface State {
  searchFilterValue?: string,
  searchFilterFields: string[],
  pageCurrent?: number
}

const defaultOptions = {
  action: "list",
  fields: []
}

export default (options?: Options) => {
  const config = { ...defaultOptions, ...options }

  const state: State = {
    searchFilterValue: null,
    searchFilterFields: config.fields
  }

  const mutations = {
    SET_SEARCH_FILTER: (state: State, search: string) => {
      state.searchFilterValue = search
      state.pageCurrent = 1
    }
  }

  const actions = {
    setSearchFilter: async ({ dispatch, commit }, search: string) => {
      commit("SET_SEARCH_FILTER", search)
      await dispatch(config.action)
    }
  }

  return {
    state,
    mutations,
    actions
  }
}
