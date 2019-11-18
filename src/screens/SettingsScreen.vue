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
    "appCheckForUpdatesButton": "Check for updates",
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
    "appCheckForUpdatesButton": "Se etter oppdateringer",
    "appVersionLabel": "Versjon"
  }
}
</i18n>

<template>
  <el-container
    id="settings-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/settings', label: $t('breadcrumbSettingsLabel') },
          { to: '', label: $t('breadcrumbCurrentLabel') }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t("screenTitle") }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
        class="max-w-xs"
      >
        <el-form-item
          :label="$t('formItemLanguageLabel')"
          prop="locale"
        >
          <el-select
            v-model="form.locale"
            :placeholder="$t('formItemLanguagePlaceholder')"
          >
            <el-option
              v-for="language in languages"
              :key="language.locale"
              :label="language.label"
              :value="language.locale"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template v-if="config.runtime === 'app'">
        {{ $t("appVersionLabel") }}: {{ appVersion }}
      </template>
    </el-main>

    <el-footer
      height="auto"
      class="flex justify-between"
    >
      <div>
        <el-button
          v-if="config.runtime === 'app'"
          type="text"
          @click="checkForUpdates"
        >
          {{ $t("appCheckForUpdatesButton") }}
        </el-button>
        <el-button
          type="danger"
          @click="resetApp"
        >
          {{ $t("appResetButton") }}
        </el-button>
      </div>

      <div className="self-end">
        <el-button
          type="text"
          @click="cancel"
        >
          {{ $t("cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="save"
        >
          {{ $t("save") }}
        </el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue"
import config from "@/app.config"
import i18n from "@/i18n"
import BreadcrumbBar from "@/components/BreadcrumbBar.vue"
import { reset } from "@/db"

export default Vue.extend({
  name: "SettingsScreen",

  components: {
    BreadcrumbBar
  },

  data: () => ({
    languages: [
      { label: "English", locale: "en" },
      { label: "Norwegian", locale: "no" }
    ],
    form: { locale: "no" },
    formRules: {},
    appVersion: "",
    config: {}
  }),

  created() {
    this.config = config
    this.form.locale = i18n.locale
    if(config.runtime === "app") {
      this.appVersion = window.ipc.sendSync("GET_VERSION")
    }
  },

  methods: {
    checkForUpdates() {
      if(config.runtime === "app") {
        window.ipc.send("CHECK_FOR_UPDATES")
      }
    },
    save() {
      this.$refs.form.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        i18n.locale = this.form.locale
        window.localStorage.setItem("currentLocale", this.form.locale)
      })
    },
    cancel() {
      this.$router.push("/")
    },
    async resetApp() {
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
