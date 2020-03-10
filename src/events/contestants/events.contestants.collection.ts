import { RxJsonSchema } from "rxdb"
import { db } from "@/db"
import { calcTime, calcStand } from "@/utils/division.utils"
import { parseTime } from "@/utils/time.util"
import { EventsContestantsProperties, EventsContestantsDocument }
  from "./events.contestants.types"

export declare interface EventsContestantsStatics {
  count: () => Promise<number>
}

const schema: RxJsonSchema = {
  title: "Events contestants schema",
  description: "Events contestants",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    number: {
      type: "number",
      index: true
    },
    calibre: {
      type: "number",
      index: true
    },
    hits: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hit: {
            type: "number"
          },
          sum: {
            type: "number"
          }
        }
      }
    },
    total: {
      type: "number",
      index: true
    },
    notes: {
      type: "array",
      items: {
        type: "string"
      }
    },
    weaponId: {
      type: "string",
      ref: "weapons",
      index: true
    },
    eventId: {
      type: "string",
      ref: "events",
      index: true
    },
    clubMemberId: {
      type: "string",
      ref: "clubs_members",
      index: true
    },
    divisionId: {
      type: "string",
      ref: "events_divisions",
      index: true
    },
    time: {
      type: "string",
      index: true
    },
    stand: {
      type: "number",
      index: true
    }
  },
  required: [
    "number",
    "calibre",
    "weaponId",
    "eventId",
    "clubMemberId"
  ]
}

// @TODO: auto-assign divisionId
const assignNumber = async (data: EventsContestantsProperties): Promise<void> => {
  if(data.number) return

  const contestant = await db.events_contestants.findOne({
    eventId: data.eventId,
    clubMemberId: data.clubMemberId
  }).exec()

  if(contestant) {
    data.number = contestant.number
    return
  }

  const contestantsNextNumber = await db.events_contestants
    .find({ eventId: data.eventId })
    .sort({ number: -1 })
    .limit(1)
    .exec()

  if(!contestantsNextNumber.length) {
    data.number = 1
    return
  }

  data.number = contestantsNextNumber[0].number + 1
}

const sortContestantByTime = (contestants) => (
  contestants.sort((a, b) => (
    a.time.localeCompare(b.time)
  ))
)

const getFirstTime = (contestants) => (
  sortContestantByTime(contestants)[0].time
)

const getLastTime = (contestants) => (
  sortContestantByTime(contestants).reverse()[0].time
)

const assignTimeAndStandAndUpdateDivision = async (
  data: EventsContestantsProperties,
  doc: EventsContestantsDocument
): Promise<void> => {
  // dont auto-assigned when being un-assigned
  // dont auto-assign when an un-assigned contestant gets dragged
  if(!data.divisionId || (data.stand && data.time && !doc.divisionId)) return

  const division = await db.events_divisions
    .findOne({ id: data.divisionId })
    .exec()

  const contestants = await db.events_contestants
    .find({ divisionId: data.divisionId })
    .exec()

  const assignTime = () => {
    if(!data.time || data.time === "" || data.divisionId !== doc.divisionId) {
      if(!contestants.length) {
        data.time = division.startsAt
      } else {
        const nextTime = contestants.sort((a, b) => (
          a.time.localeCompare(b.time)
        ))[0].time

        data.time = calcTime(
          division.standsCount,
          nextTime,
          contestants.length
        )
      }
    }
  }

  assignTime()

  const assignStand = () => {
    if(!data.stand || data.stand === 0 || data.divisionId !== doc.divisionId) {
      if(!contestants.length) {
        data.stand = 1
      } else {
        data.stand = calcStand(
          division.standsCount,
          contestants.length
        )
      }
    }
  }

  assignStand()

  const updateDivision = async () => {
    const contestantsWithoutSelf = contestants.filter(({ id }) => id !== data.id)
    if(!contestantsWithoutSelf.length) return

    const updateDivisionStartsAt = async () => {
      const currentContestantTimes = parseTime(data.time)
      const currentContestantTime = data.time
      const filterByEarlierHours = (contestants, t) => (
        contestants.filter(({ time }) => parseTime(time).hours >= t)
      )

      const firstContestantTime = getFirstTime(contestantsWithoutSelf)
      const firstContestantTimes = parseTime(firstContestantTime)
      const morePeopleShootingAtFirstTime = filterByEarlierHours(
        contestantsWithoutSelf,
        firstContestantTimes.hours
      ).length > 1
      if(morePeopleShootingAtFirstTime) {
        await division.atomicSet("startsAt", firstContestantTime)
      }
      if(currentContestantTimes.hours < firstContestantTimes.hours) {
        await division.atomicSet("startsAt", currentContestantTime)
      }

      const filterByLaterHours = (contestants, t) => (
        contestants.filter(({ time }) => parseTime(time).hours <= t)
      )
      const lastContestantTime = getLastTime(contestantsWithoutSelf)
      const lastContestantTimes = parseTime(lastContestantTime)
      const morePeopleShootingAtLastTime = filterByLaterHours(
        contestantsWithoutSelf,
        lastContestantTimes.hours
      ).length > 1
      if(morePeopleShootingAtLastTime) {
        await division.atomicSet("endsAt", lastContestantTime)
      }
      if(currentContestantTimes.hours > lastContestantTimes.hours) {
        await division.atomicSet("endsAt", currentContestantTime)
      }
    }

    await updateDivisionStartsAt()

    const updateDivisionStandsCount = async () => {
      const furthest = Math.max(...contestantsWithoutSelf.map(({ stand }) => stand))
      if(data.stand >= furthest) {
        await division.atomicSet("standsCount", data.stand)
      } else {
        const moreFurther = contestantsWithoutSelf.filter(({ stand }) => stand >= furthest).length > 0
        if(moreFurther || doc.stand <= furthest) {
          await division.atomicSet("standsCount", furthest)
        } else {
          await division.atomicSet("standsCount", data.stand)
        }
      }
    }

    await updateDivisionStandsCount()
  }

  await updateDivision()
}

export default {
  collection: {
    name: "events_contestants",
    schema: schema
  },
  middlewares: {
    preInsert: {
      handle: assignNumber,
      parallel: false
    },
    preSave: {
      handle: assignTimeAndStandAndUpdateDivision,
      parallel: false
    }
  }
}
