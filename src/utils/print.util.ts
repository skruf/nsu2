// import config from "../app.config"

export default (): void => {
  setTimeout(window.print)
  // if(config.runtime === "web") {
  //   window.print()
  // } else {
  //   window.ipc.send("PRINT_WINDOW", "test")
  // }
}
