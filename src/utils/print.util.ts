import config from "../app.config"

export default (): void => {
  if(config.runtime === "web") {
    window.print()
  } else {
  }
}
