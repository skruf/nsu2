export const parseTimeInput = (s: string): { hours: number, minutes: number } => ({
  hours: parseInt(s.split(":")[0], 10),
  minutes: parseInt(s.split(":")[1], 10)
})

export const formatTime = (minutes: number): string => {
  let endsAtHour: string | number = Math.floor(minutes / 60)
  let endsAtMinute: string | number = minutes % 60
  endsAtHour = (endsAtHour < 10) ? `0${endsAtHour}` : endsAtHour
  endsAtMinute = (endsAtMinute < 10) ? `0${endsAtMinute}` : endsAtMinute
  return `${endsAtHour}:${endsAtMinute}`
}

export const toMinutes = (
  hours: number, minutes: number
): number => (
  (hours * 60) + minutes
)

export const parseTime = (
  timeString: string
): {
  hours: number,
  minutes: number
} => {
  const parse = (v: string): number => parseInt(v, 10)
  const hoursAndMinutes = timeString.split(":")
  return {
    hours: parse(hoursAndMinutes[0]),
    minutes: parse(hoursAndMinutes[1])
  }
}

export const stringifyTime = (hours: number, minutes: number): string => {
  const hh = hours < 10 ? `0${hours}` : hours
  const mm = minutes < 10 ? `0${minutes}` : minutes
  return `${hh}:${mm}`
}

export default {
  parseTimeInput,
  formatTime,
  toMinutes,
  parseTime,
  stringifyTime
}
