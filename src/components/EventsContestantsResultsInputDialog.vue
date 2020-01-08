<i18n>
{
  "en": {
    "submitSuccess": "Results for %{fullName} was updated in the database",
    "dialogTitle": "Input results for contestant"
  },
  "no": {
    "submitSuccess": "Resultater ble satt for %{fullName} i databasen",
    "dialogTitle": "Angi resultater for deltaker"
  }
}
</i18n>

<template>
  <action-dialog
    :shown.sync="visible"
    :max-width="600"
  >
    <template v-slot:title>
      {{ $t("dialogTitle") }} #{{ eventsContestant.number }}
    </template>

    <template v-slot:actions>
      <v-btn
        text
        data-testid="eventsContestantsResultsInputDialogSubmit"
        :loading="stateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <results-form-buttons
      ref="resultsFormButtons"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ResultsFormButtons from "@/components/ResultsFormButtons.vue"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "EventsContestantsResultsInputDialog",

  components: {
    ResultsFormButtons,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    eventsContestant: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: []
    }
  },

  computed: {
    ...mapState("events/contestants", {
      stateEditOneIsLoading: "editOneIsLoading"
    }),
    fullName(): string {
      if(!this.eventsContestant.clubMember) return
      return `${this.eventsContestant.clubMember.firstName} ${this.eventsContestant.clubMember.lastName}`
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    eventsContestant: {
      immediate: true,
      handler(data): void {
        if(!data.hits) return
        this.form = { hits: [ ...data.hits ] }
      }
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      actionsEditOne: "editOne"
    }),

    async submit(): Promise<void> {
      try {
        await this.actionsEditOne({
          ...this.eventsContestant,
          ...this.form
        })

        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("submitSuccess", {
            fullName: this.fullName
          })
        })
        this.close()
        this.$refs.resultsFormButtons.clear()
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
