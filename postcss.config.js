module.exports = {
  plugins: [
    require("tailwindcss")("./tailwind.config.js"),
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
