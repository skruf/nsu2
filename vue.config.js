module.exports = {
  publicPath: "",
  outputDir: "bundle",
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },
  transpileDependencies: [
    "vuetify"
  ]
}
