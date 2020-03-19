<i18n>
{
  "en": {
    "screenTitle": "Your current settings",
    "breadcrumbSettingsLabel": "Settings",
    "breadcrumbCurrentLabel": "Current",
    "formItemLanguageLabel": "Language",
    "formItemLanguagePlaceholder": "Choose language",
    "appResetConfirmation": "This will reset the app and delete all data. Are you sure?",
    "appResetButton": "Delete all data",
    "appCheckForUpdatesButton": "Update",
    "appVersionLabel": "Version"
  },
  "no": {
    "screenTitle": "Dine innstillinger",
    "breadcrumbSettingsLabel": "Innstillinger",
    "breadcrumbCurrentLabel": "Nåværende",
    "formItemLanguageLabel": "Språk",
    "formItemLanguagePlaceholder": "Velg språk",
    "appResetConfirmation": "Dette vil resette appen og slette all data. Er du sikker?",
    "appResetButton": "Slett all data",
    "appCheckForUpdatesButton": "Oppdater",
    "appVersionLabel": "Versjon"
  }
}
</i18n>

<template>
  <div>
    <v-app-bar
      class="screen-bar"
      height="auto"
      flat
    >
      <v-toolbar-title class="screen-title">
        {{ $t("screenTitle") }}
      </v-toolbar-title>
    </v-app-bar>

    <div class="screen-wrapper">
      <v-breadcrumbs
        :items="[
          { to: '/settings', text: $t('breadcrumbSettingsLabel') },
          { to: '/', text: $t('breadcrumbCurrentLabel') }
        ]"
      />

      <div
        v-if="config.runtime === 'app'"
        class="mb-10"
      >
        {{ $t("appVersionLabel") }}: {{ appVersion }}
      </div>

      <v-select
        v-model="currentLocale"
        :items="languages"
        :label="$t('formItemLanguageLabel')"
        :placeholder="$t('formItemLanguagePlaceholder')"
        class="max-w-md mb-10 mt-5"
        data-testid="settingsLanguageSelect"
        item-text="label"
        item-value="locale"
        outlined
        required
      />

      <div class="flex justify-end pb-5">
        <v-btn
          v-if="config.runtime === 'app'"
          text
          @click="checkForUpdates"
        >
          {{ $t("appCheckForUpdatesButton") }}
        </v-btn>

        <v-btn
          color="error"
          @click="resetApp"
        >
          {{ $t("appResetButton") }}
        </v-btn>
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
    appVersion: "",
    config: {}
  }),

  watch: {
    currentLocale: {
      immediate: true,
      handler(v): void {
        i18n.locale = v
        this.$vuetify.lang.current = v
        window.localStorage.setItem("currentLocale", v)
      }
    }
  },

  created() {
    this.config = config
    // if(config.runtime !== "app") return
    // this.appVersion = window.ipc.sendSync("GET_VERSION")
  },

  methods: {
    checkForUpdates(): void {
      if(config.runtime !== "app") return
      window.ipc.send("CHECK_FOR_UPDATES")
    },

    cancel(): void {
      this.$router.push("/")
    },

    async resetApp(): Promise<void> {
      if(!await this.$refs.confirm.dangerous(
        this.$t("appResetConfirmation")
      )) return

      await reset()
    }
  }
})
</script>
