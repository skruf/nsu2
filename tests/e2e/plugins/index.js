/* eslint-disable import/no-extraneous-dependencies, global-require, arrow-body-style */
const webpack = require("@cypress/webpack-preprocessor")

module.exports = (on, config) => {
  on("file:preprocessor", webpack({
    // webpackOptions: require("@vue/cli-service/webpack.config"),
    webpackOptions: {
      resolve: {
        extensions: [ ".ts", ".js" ]
      },
      module: {
        rules: [{
          test: /\.ts$/,
          exclude: [ /node_modules/ ],
          use: [{ loader: "ts-loader" }]
        }]
      }
    },
    watchOptions: {}
  }))

  // on("task", {
  //   async "db:seed"() {
  //     await cy.window().seed()
  //   },
  //   async "db:reset"() {
  //     await cy.window().reset()
  //   }
  // })

  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js"
  })
}
