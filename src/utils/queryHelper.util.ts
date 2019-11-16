type QueryState = {
  limit?: number,
  skip?: number,
  sort?: string,
  search?: {
    fields?: string[],
    value?: string
  }
}

export default (state): any => ({
  limit: state.pageSize,
  skip: (state.pageCurrent - 1) * state.pageSize,
  sort: state.sortBy,
  search: {
    fields: state.searchFilterFields,
    value: state.searchFilterValue || null
  }
})
