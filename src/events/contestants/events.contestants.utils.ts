function computeSort(aSums, bSums, aHits, bHits) {
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

function isTotalEqual(a, b) {
  return a.total > 0 && b.total > 0 && a.total === b.total
}
function sortHits(hits) {
  return hits.sort((a, b) => b.sum - a.sum).slice(0, -3)
}
function getHits(hits) {
  return hits.reduce((p, { sum }) => {
    return { ...p, [sum]: (p[sum] || 0) + 1 }
  }, {})
}
function getSums(hits) {
  return Object.keys(hits).map(Number).sort((a, b) => b - a)
}

function compareHighestCountOfNumbers(a: number[], b: number[]) {
  let s1 = 0
  let s2 = 0

  for(const a1 of a) {
    s1 += (a1 ** 10)
  }

  for(const b1 of b) {
    s2 += (b1 ** 10)
  }

  if(s1 > s2) {
    return -1
  } else if(s2 > s1) {
    return 1
  }

  return 0
}

function sort(a, b) {
  if(!isTotalEqual(a, b)) return b.total - a.total

  const aHits = getHits(sortHits([ ...a.hits ]))
  const bHits = getHits(sortHits([ ...b.hits ]))

  const aSums = getSums(aHits)
  const bSums = getSums(bHits)

  const score = computeSort(aSums, bSums, aHits, bHits)
  if(score !== 0) return score

  if(a.measurement === undefined || a.measurement === null) {
    return b.measurement
  }
  if(b.measurement === undefined || b.measurement === null) {
    return a.measurement
  }

  const measured = b.measurement - a.measurement
  if(measured !== 0) return measured

  return compareHighestCountOfNumbers(a, b)
}

export function sortResults(results: any[]): any[] {
  return results.sort(sort)
}
