import Vue from "vue"
import Vuetify from "vuetify/lib"
import no from "vuetify/src/locale/no"

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        // primary: "#b3315f",
        // primary: "#2a2c4b",
        primary: "#181F48",
        secondary: "#424242",
        accent: "#003c9e",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      }
    }
  },
  lang: {
    locales: { no },
    current: "no"
  },
  icons: {
    iconfont: "md"
  }
})
