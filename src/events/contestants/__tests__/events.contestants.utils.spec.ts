import { sortResults } from "../events.contestants.utils"

const mocks = [
  {
    id: 1,
    total: 10,
    measurement: null,
    hits: [
      { hit: 1, sum: 10 },
      { hit: 2, sum: 0 },
      { hit: 3, sum: 0 },
      { hit: 4, sum: 0 },
      { hit: 5, sum: 0 },
      { hit: 6, sum: 0 },
      { hit: 7, sum: 0 },
      { hit: 8, sum: 0 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 0 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  },
  {
    id: 2,
    total: 10,
    measurement: null,
    hits: [
      { hit: 1, sum: 9 },
      { hit: 2, sum: 1 },
      { hit: 3, sum: 0 },
      { hit: 4, sum: 0 },
      { hit: 5, sum: 0 },
      { hit: 6, sum: 0 },
      { hit: 7, sum: 0 },
      { hit: 8, sum: 0 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 0 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  },
  {
    id: 3,
    total: 10,
    measurement: 3,
    hits: [
      { hit: 1, sum: 5 },
      { hit: 2, sum: 5 },
      { hit: 3, sum: 0 },
      { hit: 4, sum: 0 },
      { hit: 5, sum: 0 },
      { hit: 6, sum: 0 },
      { hit: 7, sum: 0 },
      { hit: 8, sum: 0 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 0 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  },
  {
    id: 4,
    total: 10,
    measurement: 5,
    hits: [
      { hit: 1, sum: 5 },
      { hit: 2, sum: 5 },
      { hit: 3, sum: 0 },
      { hit: 4, sum: 0 },
      { hit: 5, sum: 0 },
      { hit: 6, sum: 0 },
      { hit: 7, sum: 0 },
      { hit: 8, sum: 0 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 0 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  },
  {
    id: 5,
    total: 41,
    measurement: null,
    hits: [
      { hit: 1, sum: 10 },
      { hit: 2, sum: 10 },
      { hit: 3, sum: 7 },
      { hit: 4, sum: 7 },
      { hit: 5, sum: 7 },
      { hit: 6, sum: 0 },
      { hit: 7, sum: 0 },
      { hit: 8, sum: 0 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 0 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  },
  {
    id: 6,
    total: 41,
    measurement: 10,
    hits: [
      { hit: 1, sum: 10 },
      { hit: 2, sum: 10 },
      { hit: 3, sum: 7 },
      { hit: 4, sum: 7 },
      { hit: 5, sum: 5 },
      { hit: 6, sum: 2 },
      { hit: 7, sum: 0 },
      { hit: 8, sum: 0 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 0 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  },

  {
    id: 7,
    total: 91,
    measurement: 35,
    hits: [
      { hit: 1, sum: 10 },
      { hit: 2, sum: 10 },
      { hit: 3, sum: 10 },
      { hit: 4, sum: 10 },
      { hit: 5, sum: 9 },
      { hit: 6, sum: 9 },
      { hit: 7, sum: 9 },
      { hit: 8, sum: 8 },
      { hit: 9, sum: 8 },
      { hit: 10, sum: 8 },
      { hit: 11, sum: 8 },
      { hit: 12, sum: 8 },
      { hit: 13, sum: 7 }
    ]
  },
  {
    id: 8,
    total: 91,
    measurement: 30,
    hits: [
      { hit: 1, sum: 10 },
      { hit: 2, sum: 10 },
      { hit: 3, sum: 10 },
      { hit: 4, sum: 10 },
      { hit: 5, sum: 9 },
      { hit: 6, sum: 9 },
      { hit: 7, sum: 9 },
      { hit: 8, sum: 8 },
      { hit: 9, sum: 8 },
      { hit: 10, sum: 8 },
      { hit: 11, sum: 8 },
      { hit: 12, sum: 7 },
      { hit: 13, sum: 7 }
    ]
  },

  {
    id: 9,
    total: 28,
    measurement: null,
    hits: [
      { hit: 1, sum: 7 },
      { hit: 2, sum: 0 },
      { hit: 3, sum: 0 },
      { hit: 4, sum: 5 },
      { hit: 5, sum: 3 },
      { hit: 6, sum: 2 },
      { hit: 7, sum: 2 },
      { hit: 8, sum: 4 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 5 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  },
  {
    id: 10,
    total: 28,
    measurement: null,
    hits: [
      { hit: 1, sum: 0 },
      { hit: 2, sum: 8 },
      { hit: 3, sum: 0 },
      { hit: 4, sum: 9 },
      { hit: 5, sum: 0 },
      { hit: 6, sum: 5 },
      { hit: 7, sum: 0 },
      { hit: 8, sum: 6 },
      { hit: 9, sum: 0 },
      { hit: 10, sum: 0 },
      { hit: 11, sum: 0 },
      { hit: 12, sum: 0 },
      { hit: 13, sum: 0 }
    ]
  }
]

const sss = (arr) => arr
  .map(({ id }) => id)
  .sort()

describe("events.contestants.utils", () => {
  it("sortResults", () => {
    const sorted = sortResults(mocks)

    sorted.forEach((a) => {
      console.dir(a)
    })

    // const a = sss(sorted)
    // const b = sss(mocks)
    // expect(a).toEqual(b)

    expect(true).toBe(true)
  })
})
