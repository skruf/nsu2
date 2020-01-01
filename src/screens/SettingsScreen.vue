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
      color="primary"
      dark
      flat
    >
      <v-toolbar-title class="flex items-center">
        {{ $t("screenTitle") }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon>
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <v-breadcrumbs
      :items="[
        { to: '/settings', text: $t('breadcrumbSettingsLabel') },
        { to: '/', text: $t('breadcrumbCurrentLabel') }
      ]"
    />

    <div class="p-5">
      <div
        v-if="config.runtime === 'app'"
        class="mb-10"
      >
        {{ $t("appVersionLabel") }}: {{ appVersion }}
      </div>

      <v-select
        v-model="locale"
        :items="languages"
        :label="$t('formItemLanguageLabel')"
        :placeholder="$t('formItemLanguagePlaceholder')"
        class="max-w-md"
        data-testid="settingsLanguageSelect"
        item-text="label"
        item-value="locale"
        outlined
        required
      />
    </div>

    <!-- <v-spacer /> -->

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
</template>

<script lang="ts">
import Vue from "vue"
import config from "@/app.config"
import i18n from "@/i18n"
import { reset } from "@/db"

export default Vue.extend({
  name: "SettingsScreen",

  data: () => ({
    languages: [
      { label: "English", locale: "en" },
      { label: "Norwegian", locale: "no" }
    ],
    locale: "no",
    appVersion: "",
    config: {}
  }),

  watch: {
    locale: {
      immediate: true,
      handler(v): void {
        i18n.locale = v
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
      try {
        await this.$confirm(
          this.$t("appResetConfirmation"),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
        await reset()
      } catch(e) {}
    }
  }
})
</script>
