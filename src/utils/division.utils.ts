import { parseTime, stringifyTime } from "@/utils/time.util"

export const calcRow = (index: number, columnLimit: number): number => (
  Math.floor(index / columnLimit)
)
export const calcTime = (columnLimit: number, startsAt: string, index: number): string => {
  const { hours, minutes } = parseTime(startsAt)
  const row = calcRow(index, columnLimit)
  return stringifyTime(hours + row, minutes)
}
export const calcStand = (columnLimit: number, index: number): number => {
  const row = calcRow(index, columnLimit)
  return (index + 1) - row * columnLimit
}
