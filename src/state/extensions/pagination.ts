interface Options {
  action: string
}

interface State {
  pageSize: number,
  pageCurrent: number
}

const defaultOptions = {
  action: "list"
}

export default (options?: Options) => {
  const config = { ...defaultOptions, ...options }

  const state: State = {
    pageSize: 15,
    pageCurrent: 1
  }

  const mutations = {
    SET_PAGE_SIZE: (state: State, size: number) => {
      state.pageSize = size
      state.pageCurrent = 1
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
