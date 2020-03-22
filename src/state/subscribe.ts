export default (store) => {
  const { dispatch } = store

  store.subscribeAction({
    after: (action, state) => {
      const { type, payload } = action

      if(
        type === "events/divisions/create" ||
        type === "events/divisions/editOne" ||
        type === "events/divisions/removeOne" ||
        type === "events/divisions/removeMany"
      ) {
        // if(!payload.autoAssign) return
        dispatch(
          "events/contestants/list",
          { filter: { eventId: state.events.selected.id } },
          { root: true }
        )
      }

      if(
        type === "events/contestants/editOne" ||
        type === "events/contestants/editMany" ||
        type === "events/contestants/removeOne" ||
        type === "events/contestants/removeMany"
      ) {
        dispatch(
          "events/divisions/list",
          { filter: { eventId: state.events.selected.id } },
          { root: true }
        )
      }

      if(
        type === "clubs/removeOne" ||
        type === "clubs/removeMany"
        // type === "clubs/members/create" ||
        // type === "clubs/members/editOne"
      ) {
        dispatch(
          "clubs/members/list",
          {},
          { root: true }
        )
      }

      if(
        type === "events/categories/editOne" ||
        type === "events/categories/removeOne" ||
        type === "events/categories/removeMany"
      ) {
        dispatch(
          "events/list",
          {},
          { root: true }
        )
      }

    }
  })
}
