interface Options {
  action: string,
  fields: string[]
}

export declare interface SearchState {
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

  const state: SearchState = {
    searchFilterValue: null,
    searchFilterFields: config.fields
  }

  const mutations = {
    SET_SEARCH_FILTER: (state: SearchState, search: string) => {
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

  const getters = {
    getSearch: (state: SearchState): { fields: string[], value: string } | null => (
      state.searchFilterFields && state.searchFilterValue
        ? ({ fields: state.searchFilterFields, value: state.searchFilterValue })
        : null
    )
    // getSearch: (state: SearchState): { fields: string[], value: string } => ({
    //   fields: state.searchFilterFields ? state.searchFilterFields : [],
    //   value: state.searchFilterValue ? state.searchFilterValue : ""
    // })
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}
