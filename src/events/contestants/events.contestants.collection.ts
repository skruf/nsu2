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
  indexes: [
    "number",
    "calibre",
    "total",
    "weaponId",
    "eventId",
    "clubMemberId",
    "divisionId",
    "time",
    "stand",
    "measurement"
  ],
  properties: {
    id: {
      type: "string",
      primary: true
    },
    number: {
      type: "number"
    },
    calibre: {
      type: "string"
    },
    hits: {
      type: "array",
      default: [],
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
      type: "number"
    },
    measurement: {
      type: "number"
    },
    weaponId: {
      type: "string",
      ref: "weapons"
    },
    eventId: {
      type: "string",
      ref: "events"
    },
    clubMemberId: {
      type: "string",
      ref: "clubs_members"
    },
    divisionId: {
      type: "string",
      ref: "events_divisions"
    },
    time: {
      type: "string"
    },
    stand: {
      type: "number"
    },
    colour: {
      type: "string"
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

const getRandomColor = (): string => `hsl(${Math.random() * 360}, 100%, 20%)`

// @TODO: auto-assign divisionId
const assignNumber = async (data: EventsContestantsProperties): Promise<void> => {
  if(data.number) return

  const contestant = await db.events_contestants.findOne({
    selector: {
      eventId: data.eventId,
      clubMemberId: data.clubMemberId
    }
  }).exec()

  if(contestant) {
    data.colour = contestant.colour
    data.number = contestant.number
    return
  }

  const contestantsNextNumber = await db.events_contestants
    .find({
      selector: { eventId: data.eventId },
      sort: [{ number: "desc" }],
      limit: 1
    })
    .exec()

  if(!contestantsNextNumber.length) {
    data.number = 1
    return
  }

  data.colour = getRandomColor()
  data.number = contestantsNextNumber[0].number + 1
}

const collator = new Intl.Collator("en", { usage: "sort" })

const sortContestantByTime = (contestants) => (
  contestants
    .map(({ time }) => time)
    .sort(collator.compare)
)

const getFirstTime = (contestants) => {
  return sortContestantByTime(contestants)[0]
}
const getLastTime = (contestants) => {
  return sortContestantByTime(contestants)[contestants.length - 1]
}

const assignTime = (contestants, division) => {
  if(!contestants.length) return division.startsAt
  const nextTime = getFirstTime(contestants)
  return calcTime(division.standsCount, nextTime, contestants.length)
}

const assignStand = (contestants, division) => {
  if(!contestants.length) return 1
  return calcStand(division.standsCount, contestants.length)
}

const updateDivision = async (contestants, division, data, doc): Promise<void> => {
  if(!contestants || !division) return
  const withoutSelf = contestants.filter((c) => !!c.time && c.id !== data.id)
  if(!withoutSelf.length) return

  const updateDivisionStartsAt = async (time?: string): Promise<void> => {
    const times = time ? parseTime(time) : null
    const firstTime = getFirstTime(withoutSelf)
    const firstTimes = parseTime(firstTime)

    const moreFirst = withoutSelf
      .some(({ time }) => parseTime(time).hours >= firstTimes.hours)

    if(moreFirst) {
      await division.atomicSet("startsAt", firstTime)
    }

    if(times && times.hours < firstTimes.hours) {
      await division.atomicSet("startsAt", time)
    }

    const lastContestantTime = getLastTime(withoutSelf)
    const lastContestantTimes = parseTime(lastContestantTime)
    const moreLast = withoutSelf
      .some(({ time }) => parseTime(time).hours <= lastContestantTimes.hours)

    if(moreLast) {
      await division.atomicSet("endsAt", lastContestantTime)
    }

    if(times && times.hours > lastContestantTimes.hours) {
      await division.atomicSet("endsAt", time)
    }
  }

  const updateDivisionStandsCount = async (stand?: number): Promise<void> => {
    const furthest = Math.max(...withoutSelf.map(({ stand }) => stand))

    if(stand >= furthest) {
      await division.atomicSet("standsCount", stand)
      return
    }

    const more = withoutSelf.some(({ stand }) => stand >= furthest)
    if(more || doc.stand <= furthest) {
      await division.atomicSet("standsCount", furthest)
    } else {
      await division.atomicSet("standsCount", stand)
    }
  }

  await updateDivisionStartsAt(data.time)
  await updateDivisionStandsCount(data.stand)
}

// @TODO: update division start/end/standCount when un-assigning contestants
const assignTimeAndStandAndUpdateDivision = async (
  data: EventsContestantsProperties,
  doc: EventsContestantsDocument
): Promise<void> => {
  let division = null
  let contestants = null

  if(data.divisionId) {
    division = await db.events_divisions
      .findOne({ selector: { id: data.divisionId } })
      .exec()

    contestants = await db.events_contestants
      .find({ selector: { divisionId: data.divisionId } })
      .exec()
  }

  if(data.divisionId && ((data.stand && data.time) && doc.divisionId)) {
    if(!data.time || data.time === "" || data.divisionId !== doc.divisionId) {
      data.time = assignTime(contestants, division)
    }

    if(!data.stand || data.stand === 0 || data.divisionId !== doc.divisionId) {
      data.stand = assignStand(contestants, division)
    }
  }

  if(data.divisionId && !(data.stand && data.time)) {
    data.time = assignTime(contestants, division)
    data.stand = assignStand(contestants, division)
  }

  await updateDivision(contestants, division, data, doc)
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
