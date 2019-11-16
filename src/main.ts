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

declare global {
  interface Window { ipc: any }
}

Vue.config.productionTip = false

;(async () => {
  await init()
  new Vue({
    i18n,
    router,
    store,
    render: (h) => h(App)
  }).$mount("#app")
})()
