export default {
  env: process.env.NODE_ENV || "development",
  seed: process.env.VUE_APP_SEED === "true" || false,
  runtime: process.env.VUE_APP_RUNTIME || "app"
}
