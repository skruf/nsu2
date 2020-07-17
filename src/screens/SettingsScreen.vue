<i18n>
{
  "en": {
    "screenTitle": "Settings",
    "versionHeading": "Version",
    "versionLabel": "You're running version",
    "languageHeading": "Language",
    "languagePlaceholder": "Choose language",
    "resetHeading": "Delete data",
    "resetWarning": "This will delete all data from the appliation. Because the data is stored locally on this computer, we won't be able to restore anything after deletion.",
    "resetButton": "Delete all data",
    "resetConfirmation": "This will reset the app and delete all data. Are you sure?",
    "resetSuccess": "All data were successfully removed"
  },
  "no": {
    "screenTitle": "Innstillinger",
    "versionHeading": "Versjon",
    "versionLabel": "Du kjører version",
    "languageHeading": "Språk",
    "languagePlaceholder": "Velg språk",
    "resetHeading": "Slett data",
    "resetWarning": "Dette vil slette alle opplysninger du har lagret. Ettersom alt er lagret lokalt på denne maskinen vil vi ikke ha mulighet til å gjenopprette denne informasjonen.",
    "resetButton": "Slett all data",
    "resetConfirmation": "Dette vil resette appen og slette all data. Er du sikker?",
    "resetSuccess": "All data ble slettet"
  }
}
</i18n>

<template>
  <div class="screen">
    <v-app-bar
      class="screen-bar"
      height="auto"
      flat
    >
      <v-toolbar-title class="screen-title py-3">
        {{ $t("screenTitle") }}
      </v-toolbar-title>
    </v-app-bar>

    <div class="container">
      <div class="p-6 flex border-b border-border border-solid">
        <h2 class="mb-3 font-semibold w-32">
          {{ $t("versionHeading") }}
        </h2>

        <div class="flex items-center">
          <p class="mr-2 mb-0">
            {{ $t("versionLabel") }}: {{ appVersion }}
          </p>

          <v-btn
            v-if="config.runtime === 'app'"
            data-testid="checkForUpdates"
            icon
            small
            @click="checkForUpdates"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
        </div>
      </div>

      <div class="p-6 flex border-b border-border border-solid">
        <h2 class="mb-3 font-semibold w-32">
          {{ $t("languageHeading") }}
        </h2>

        <v-select
          v-model="currentLocale"
          :items="languages"
          :placeholder="$t('languagePlaceholder')"
          class="max-w-md mb-0"
          data-testid="settingsLanguageSelect"
          item-text="label"
          item-value="locale"
          hide-details
          outlined
          required
        />
      </div>

      <div class="p-6 flex">
        <h2 class="mb-3 font-semibold w-32">
          {{ $t("resetHeading") }}
        </h2>

        <div class="p-6 border-2 border-solid border-red-500 text-red-500">
          <p class="mb-6 max-w-2xl">
            {{ $t("resetWarning") }}
          </p>

          <v-btn
            color="error"
            @click="resetApp"
          >
            {{ $t("resetButton") }}
          </v-btn>
        </div>
      </div>
    </div>

    <confirm ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import config from "@/app.config"
import i18n from "@/i18n"
import { reset } from "@/db"
import Confirm from "@/components/Confirm.vue"
import packageJson from "@/../package.json"

export default Vue.extend({
  name: "SettingsScreen",

  components: {
    Confirm
  },

  data: () => ({
    languages: [
      { label: "English", locale: "en" },
      { label: "Norwegian", locale: "no" }
    ],
    currentLocale: "no",
    appVersion: packageJson.version,
    config: {}
  }),

  watch: {
    currentLocale: {
      immediate: true,
      handler(v): void {
        i18n.locale = v
        this.$vuetify.lang.current = v
        localStorage.currentLocale = v
      }
    }
  },

  created() {
    this.config = config
    if(localStorage.currentLocale === undefined) return
    this.currentLocale = localStorage.currentLocale
  },

  methods: {
    checkForUpdates(): void {
      if(config.runtime !== "app" || !window.ipc) return
      window.ipc.send("CHECK_FOR_UPDATES")
    },

    async resetApp(): Promise<void> {
      if(!await this.$refs.confirm.dangerous(
        this.$t("resetConfirmation")
      )) return
      await reset()
      this.$success(this.$t("resetSuccess"))
    }
  }
})
</script>
