// const glob = require("glob")
// const path = require("path")

module.exports = {
  plugins: [
    require("tailwindcss")("./tailwind.config.js"),

    // require("@fullhuman/postcss-purgecss")({
    //   paths: glob.sync([
    //     path.join(__dirname, './public/index.html'),
    //     path.join(__dirname, './**/*.vue'),
    //     path.join(__dirname, './src/**/*.js'),
    //     path.join(__dirname, './node_modules/vuetify/src/**/*.ts')
    //   ])
    // })

    // require("@fullhuman/postcss-purgecss")({
    //   content: [
    //     "./src/**/*.html",
    //     "./src/**/*.vue"
    //   ],
    //   whitelistPatterns: [
    //     /^v-*/,
    //     /^theme-*/,
    //     /^application--*/,
    //     /^material-icons/,
    //     /^notranslate/
    //   ],
    //   whitelistPatternsChildren: [
    //     /^v-*/,
    //     /^theme-*/,
    //     /^application--*/,
    //     /^material-icons/,
    //     /^notranslate/
    //   ],
    //   whitelist: [
    //     "spacer",
    //     "primary",
    //     "secondary",
    //     "accent",
    //     "error",
    //     "warning",
    //     "info",
    //     "success"
    //   ]

    //   // content: [
    //   //   "./src/**/*.html",
    //   //   "./src/**/*.vue"
    //   // ],
    //   // whitelist: [ "html", "body" ],
    //   // whitelistPatterns: [
    //   //   /^page-/,
    //   //   /^slide-/,
    //   //   /^swiper-/,
    //   //   /^fade-/,
    //   //   /^el-/,
    //   //   /^cell/,
    //   //   // /^el-table/,
    //   //   // /^el-button/,
    //   //   // /^el-switch/,
    //   //   // /^el-form/,
    //   //   // /^el-input/,
    //   //   // /^el-dialog/,
    //   //   // /^el-modal/,
    //   //   // /^el-notification/,
    //   //   // /^el-message/,
    //   //   // /^el-icon/,
    //   //   /^v-/,
    //   //   /^is-/,
    //   //   /^has-/
    //   // ]
    // })
  ]
}
