<i18n>
{
  "en": {
    "updateChecking": "Looking for updates...",
    "updateAvailable": "A new update is available!",
    "updateNotAvailable": "You have the newest version",
    "updateError": "An error occurred when updating",
    "updateDownloaded": "An update was downloaded. Installation will start in 5 seconds"
  },
  "no": {
    "updateChecking": "Ser etter oppdateringer...",
    "updateAvailable": "En ny oppdatering er tilgjengelig!",
    "updateNotAvailable": "Du har den nyeste versjonen",
    "updateError": "En feil oppstod under oppdateringen",
    "updateDownloaded": "En oppdatering ble lastet ned. Installasjonen vil starte om 5 sekunder"
  }
}
</i18n>

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
import config from "@/app.config"

export default Vue.extend({
  name: "Nsu",

  components: {
    AppSidebar
  },

  created() {
    if(config.runtime === "web" || !window.ipc) return
    window.ipc.send("APP_STARTED")
    window.ipc.on("SET_UPDATE_STATUS", (e, status) => {
      switch(status.type) {
        case "UPDATE_CHECKING":
          this.$info(this.$t("updateChecking"))
          break
        case "UPDATE_AVAILABLE":
          this.$info(this.$t("updateAvailable"))
          break
        case "UPDATE_NOT_AVAILABLE":
          this.$info(this.$t("updateNotAvailable"))
          break
        case "UPDATE_ERROR":
          this.$error(this.$t("updateError"))
          break
        case "UPDATE_DOWNLOADED":
          this.$success(this.$t("updateDownloaded"))
          break
      }
    })
  }
})
</script>
