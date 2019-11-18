import Vue from "vue"

import "./plugins/moment"
import "./plugins/element"
import "./design/imports.css"
import "./design/index.styl"
import "./design/utils.css"

import { init } from "./db"
import i18n from "./i18n"
import App from "./App.vue"
import router from "./router"
import store from "./state"

import { dbTestUtil } from "@/utils"

declare global {
  interface Window {
    ipc: any
    // seedDb: () => Promise<void>,
    // resetDb: () => Promise<void>
  }
}

Vue.config.productionTip = false

;(async () => {
  const db = await init()

  if(process.env.NODE_ENV === "test") {
    // window.seedDb = async () => {
    await dbTestUtil.seed(db)
    // }
    // window.resetDb = async () => {
    //   await dbTestUtil.reset(db)
    // }
  }

  new Vue({
    i18n,
    router,
    store,
    render: (h) => h(App)
  }).$mount("#app")
})()
