import Vue from "vue"

import "./plugins/moment"
import "./plugins/element"

import { init } from "./db"
import i18n from "./i18n"
import App from "./App.vue"
import router from "./router"
import store from "./state"

import vuetify from "./plugins/vuetify"
import "roboto-fontface/css/roboto/roboto-fontface.css"
import "material-design-icons-iconfont/dist/material-design-icons.css"
import "./design/imports.css"

import {
  dbTestUtil, openExternalUrlUtil, printUtil
} from "@/utils"

Vue.config.productionTip = false

Vue.prototype.openExternalUrl = openExternalUrlUtil
Vue.prototype.print = printUtil

;(async (): Promise<void> => {
  const db = await init()

  if(process.env.NODE_ENV !== "production") {
    await dbTestUtil.seed(db)
    window.ready = true

    // window.seedDb = async () => {
    //   await dbTestUtil.seed(db)
    // }
    // window.resetDb = async () => {
    //   await dbTestUtil.reset(db)
    // }
  }

  new Vue({
    i18n,
    router,
    store,
    vuetify,
    render: (h) => h(App)
  }).$mount("#app")
})()
