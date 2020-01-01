interface Search {
  fields?: string[],
  value?: string
}

interface QueryState {
  limit?: number,
  skip?: number,
  sort?: string,
  search?: Search
}

export default (state): any => {
  const options: any = {}
  if(state.pageSize) options.limit = state.pageSize
  if(state.pageCurrent) options.skip = (state.pageCurrent - 1) * state.pageSize
  if(state.sortBy) options.sort = state.sortBy
  const search: any = {}
  if(state.searchFilterFields) search.fields = state.searchFilterFields
  if(state.searchFilterValue) search.value = state.searchFilterValue
  options.search = search
  return options
}
