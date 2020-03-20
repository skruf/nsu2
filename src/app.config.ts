export default {
  env: process.env.NODE_ENV || "development",
  seed: process.env.VUE_APP_SEED || false,
  runtime: "web"
  // runtime: process.env.RUN_ENV || "app"
}
