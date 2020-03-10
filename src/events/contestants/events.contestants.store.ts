import extend from "@/state/extensions"
import eventsContestantsService from "./events.contestants.service"

const state = {}
const mutations = {}
const actions = {}

const getters = {
  assigned: ({ list }) => (
    list.filter(({ stand, time }) => stand && time)
  ),
  assignedByDivisionId: (_, { assigned }) => (divisionId) => (
    assigned.filter((item) => item.divisionId === divisionId)
  ),
  unAssignedByWeaponDistance: ({ list }) => (weaponDistance) => (
    list.filter((c) => !c.stand && !c.time && c.weapon.distance === weaponDistance)
  ),
  timesByDivisionId: (_, { assignedByDivisionId }) => (divisionId) => (
    [ ...new Set(assignedByDivisionId(divisionId).sort((a, b) => (
      a.time.localeCompare(b.time)
    )).map(({ time }) => time)) ]
  ),
  standsByDivisionId: (_, { assignedByDivisionId }) => (divisionId) => (
    [ ...new Set(assignedByDivisionId(divisionId).map(({ stand }) => stand)) ].sort()
  ),
  scheduleByDivisionId: (_, { assignedByDivisionId }) => (divisionId) => (
    assignedByDivisionId(divisionId).reduce((c, v) => {
      c[v.time] = c[v.time] || {}
      c[v.time][v.stand] = c[v.time][v.stand] || {}
      c[v.time][v.stand] = v
      return c
    }, {})
  )
}

const store = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

const modules = [
  {
    module: "crud",
    options: {
      list: eventsContestantsService.list,
      select: eventsContestantsService.select,
      create: eventsContestantsService.create,
      createMany: eventsContestantsService.createMany,
      removeOne: eventsContestantsService.removeOne,
      removeMany: eventsContestantsService.removeMany,
      editMany: eventsContestantsService.editMany,
      editOne: eventsContestantsService.editOne
    }
  }
]

export default extend(store, modules)
