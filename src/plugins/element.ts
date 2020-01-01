import Vue from "vue"
// import Element from "element-ui"
// import "element-ui/lib/theme-chalk/index.css"
// import lang from "element-ui/lib/locale/lang/en"
// import locale from "element-ui/lib/locale"
// locale.use(lang)
// Vue.use(Element)

import { Loading, MessageBox, Notification } from "element-ui"

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
