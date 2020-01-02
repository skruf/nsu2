import Vue from "vue"
import VueI18n from "vue-i18n"
import en from "./en.json"
import no from "./no.json"

Vue.use(VueI18n)

const locale = window.localStorage.getItem("currentLocale") || "no"

export const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: "no",
  messages: { en, no },
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  modifiers: {
    capitilize: (s): string => s.charAt(0).toUpperCase().slice(1)
  }
})

export default i18n
