module.exports = {
  plugins: [
    require("tailwindcss")("./tailwind.config.js"),
    // require("@fullhuman/postcss-purgecss")({
    //   content: [
    //     "./src/**/*.html",
    //     "./src/**/*.vue"
    //   ],
    //   whitelist: [ "html", "body" ],
    //   whitelistPatterns: [
    //     /^page-/,
    //     /^slide-/,
    //     /^swiper-/,
    //     /^fade-/,
    //     /^el-/,
    //     /^cell/,
    //     // /^el-table/,
    //     // /^el-button/,
    //     // /^el-switch/,
    //     // /^el-form/,
    //     // /^el-input/,
    //     // /^el-dialog/,
    //     // /^el-modal/,
    //     // /^el-notification/,
    //     // /^el-message/,
    //     // /^el-icon/,
    //     /^v-/,
    //     /^is-/,
    //     /^has-/
    //   ]
    // })
  ]
}
