import { RxJsonSchema } from "rxdb"
import { db } from "@/db"
import { calcTime, calcStand } from "@/utils/division.utils"
import { parseTime, stringifyTime } from "@/utils/time.util"
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

// @TODO: auto-assign stand/time/divisionId
const assignNumber = async (
  data: EventsContestantsProperties
): Promise<void> => {
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
    a.time.localeCompare(b.time, "en", { sensitivity: "base" })
  ))
)

const getFirstTime = (contestants) => (
  sortContestantByTime(contestants)[0].time
)

const getLastTime = (contestants) => (
  sortContestantByTime(contestants).reverse()[0].time
)

const filterContestantsByTime = (contestants, t) => (
  contestants.filter(({ time }) => time === t)
)

const assignTimeAndStand = async (
  data: EventsContestantsProperties,
  doc: EventsContestantsDocument
): Promise<void> => {
  // dont auto-assigned when being un-assigned
  if(!data.divisionId) return
  // dont auto-assign when an un-assigned contestant gets dragged to a slot
  if(data.stand && data.time && !doc.divisionId) return

  const division = await db.events_divisions
    .findOne({ id: data.divisionId })
    .exec()
  const contestants = await db.events_contestants
    .find({ divisionId: data.divisionId })
    .exec()

  if(!data.time || data.time === "" || data.divisionId !== doc.divisionId) {
    if(!contestants.length) {
      data.time = division.startsAt
    } else {
      const nextTime = contestants.sort((a, b) => (
        a.time.localeCompare(b.time, "en", { sensitivity: "base" })
      ))[0].time

      data.time = calcTime(
        division.standsCount,
        nextTime,
        contestants.length
      )
    }
  }

  const currentContestantTimes = parseTime(data.time)
  const currentContestantTime = data.time

  const firstContestantTime = getFirstTime(contestants)
  const firstContestantTimes = parseTime(firstContestantTime)

  const filterContestantsByHour = (contestants, t) => (
    contestants.filter(({ time }) => parseTime(time).hours >= t)
  )

  const morePeopleShootingAtFirstTime = filterContestantsByHour(contestants, firstContestantTimes.hours).length > 1
  // const noMorePeopleShootingAtFirstTime = !morePeopleShootingAtFirstTime

  // console.log(`f: ${firstContestantTimes.hours} - c: ${currentContestantTimes.hours} - n: ${noMorePeopleShootingAtFirstTime}`)

  // f: 6
  // c: 7
  // n: true

  // lowest number unless no more people, then first number

  let t = firstContestantTime

  if(currentContestantTimes.hours !== firstContestantTimes.hours) {
    t = currentContestantTime
  }

  await division.atomicSet("startsAt", t)

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

  const furthest = Math.max(...contestants.map(({ stand }) => stand))

  const moreFurther = contestants.filter(({ stand }) => stand >= furthest).length > 0

  console.log(contestants.filter(({ stand }) => stand >= furthest).length)

  if(data.stand > furthest) {
    // if nobody else is shooting at last stand, then set it to data.stand
    await division.atomicSet("standsCount", data.stand)
  }

  if(data.stand < furthest) {
    if(moreFurther) {
      if(contestants.filter(({ stand }) => stand >= furthest).length === 1) {
        const unique = [ ...new Set(contestants.map(({ stand }) => stand)) ]
        const n = unique.sort()[unique.length - 2]

        if(data.stand > n) {
          await division.atomicSet("standsCount", data.stand)
        } else {
          await division.atomicSet("standsCount", n)
        }
      }
    } else {
      await division.atomicSet("standsCount", data.stand)
    }
  }

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
      handle: assignTimeAndStand,
      parallel: false
    }
  }
}
