const computeSort = (aSums, bSums, aHits, bHits) => {
  const bHighest = bSums[0]
  const aHighest = aSums[0]

  if(!bHighest || !aHighest) return 0

  const highestDelta = bHighest - aHighest
  if(highestDelta !== 0) {
    return highestDelta
  }

  const highestCountDelta = bHits[bHighest] - aHits[aHighest]
  if(highestCountDelta !== 0) {
    return highestCountDelta
  }

  return computeSort(
    aSums.slice(1),
    bSums.slice(1),
    aHits,
    bHits
  )
}

const isTotalEqual = (a, b) => a.total > 0 && b.total > 0 && a.total === b.total
const sortHits = (hits) => hits.sort((a, b) => b.sum - a.sum).slice(0, -3)
const getHits = (hits) => hits.reduce((p, { sum }) => ({ ...p, [sum]: (p[sum] || 0) + 1 }), {})
const getSums = (hits) => Object.keys(hits).map(Number).sort((a, b) => b - a)

const sort = (a, b) => {
  if(!isTotalEqual(a, b)) return b.total - a.total

  const aHits = getHits(sortHits([ ...a.hits ]))
  const bHits = getHits(sortHits([ ...b.hits ]))

  const aSums = getSums(aHits)
  const bSums = getSums(bHits)

  const score = computeSort(
    aSums,
    bSums,
    aHits,
    bHits
  )

  if(score !== 0) return score

  if(a.measurement === undefined || a.measurement === null) return b.measurement
  if(b.measurement === undefined || b.measurement === null) return a.measurement

  return a.measurement - b.measurement
}

export const sortResults = (results: any[]): any[] => results.sort(sort)
