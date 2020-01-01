interface Options {
  action: string
}

interface State {
  pageSize: number,
  pageCurrent: number,
  count?: number
}

const defaultOptions = {
  action: "list"
}

export default (options?: Options): any => {
  const config = { ...defaultOptions, ...options }

  const state: State = {
    pageSize: 150,
    pageCurrent: 1
  }

  const mutations = {
    SET_PAGE_SIZE: (state: State, size: number) => {
      state.pageCurrent = 1
      if(size > 1) state.pageSize = size
      else state.pageSize = state.count || 9999
    },
    SET_PAGE_CURRENT: (state: State, pageCurrent: number) => {
      state.pageCurrent = pageCurrent
    }
  }

  const actions = {
    setPageSize: async ({ commit, dispatch }, pageSize: number) => {
      commit("SET_PAGE_SIZE", pageSize)
      await dispatch(config.action)
    },
    setPageCurrent: async ({ commit, dispatch }, pageCurrent: number) => {
      commit("SET_PAGE_CURRENT", pageCurrent)
      await dispatch(config.action)
    }
  }

  return {
    state,
    mutations,
    actions
  }
}
