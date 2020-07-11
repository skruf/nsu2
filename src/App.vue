<style lang="stylus" scoped>
</style>

<template>
  <v-app>
    <app-sidebar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import AppSidebar from "@/components/AppSidebar.vue"
// import config from "@/app.config"

export default Vue.extend({
  name: "Nsu",

  components: {
    AppSidebar
  },

  created() {
    // if(config.runtime === "web") return

    // console.log(window.ipc)

    // window.ipc.send("APP_STARTED")
    // window.ipc.on("SET_UPDATE_STATUS", (e, status) => {
    //   let title = "Oppdatering"
    //   let message

    //   switch(status.type) {
    //     case "UPDATE_CHECKING":
    //       message = "Ser etter oppdateringer"
    //       break
    //     case "UPDATE_AVAILABLE":
    //       message = "En ny oppdatering er tilgjengelig!"
    //       break
    //     case "UPDATE_NOT_AVAILABLE":
    //       message = "Du har den nyeste versjonen"
    //       break
    //     case "UPDATE_ERROR":
    //       message = "En feil oppstod under oppdatering"
    //       break
    //     case "UPDATE_DOWNLOADED":
    //       message = "En oppdatering ble lastet ned. Installerer og restarter om 5 sekunder."
    //       break
    //   }

    //   this.$notify.info({ title, message })
    // })
  }
})
</script>
