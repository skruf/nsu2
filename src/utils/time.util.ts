export const parseTimeInput = (s) => ({
  hours: parseInt(s.split(":")[0], 10),
  minutes: parseInt(s.split(":")[1], 10)
})

export const formatTime = (minutes) => {
  let endsAtHour: string | number = Math.floor(minutes / 60)
  let endsAtMinute: string | number = minutes % 60
  endsAtHour = (endsAtHour < 10) ? `0${endsAtHour}` : endsAtHour
  endsAtMinute = (endsAtMinute < 10) ? `0${endsAtMinute}` : endsAtMinute
  return `${endsAtHour}:${endsAtMinute}`
}

export const toMinutes = (hours, minutes) => (hours * 60) + minutes

export default {
  parseTimeInput,
  formatTime,
  toMinutes
}
