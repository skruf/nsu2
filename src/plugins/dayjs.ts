import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/nb"

dayjs.locale("nb")

const fn = (date: string): Dayjs => dayjs(date)

export default (Vue) => {
  Vue.filter("date", (date, format = "DD MMM YYYY") => (
    fn(date).format(format)
  ))
  Vue.mixin({ methods: { $date: fn } })
}
