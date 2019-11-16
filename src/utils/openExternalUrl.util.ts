import config from "../app.config"

export default (url) => {
  if(config.runtime === "web") {
    window.open(url)
    return
  }
  window.ipc.send("OPEN_EXTERNAL_URL", url)
}
