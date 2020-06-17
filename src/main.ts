import Vue from "vue"
import vuetify from "./plugins/vuetify"
import "material-design-icons-iconfont/dist/material-design-icons.css"
import "./styles.css"

import Dayjs from "./plugins/dayjs"
import Toasted from "./plugins/toasted"

import { init } from "./db"
import i18n from "./i18n"
import App from "./App.vue"
import router from "./router"
import store from "./state"
import { openExternalUrlUtil, printUtil } from "@/utils"
import config from "./app.config"

Vue.config.productionTip = false

Vue.prototype.openExternalUrl = openExternalUrlUtil
Vue.prototype.$print = printUtil

Vue.use(Dayjs)
Vue.use(Toasted)

;(async (): Promise<void> => {
  const db = await init()

  if(config.seed) {
    const dbTestUtil = require("@/utils/db.test.util").default
    await dbTestUtil.seedAll(db)
  }

  if(config.env !== "production") {
    window.db = db
  }

  new Vue({
    i18n,
    router,
    store,
    vuetify,
    render: (h) => h(App)
  }).$mount("#app")
})()
