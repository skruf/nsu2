<i18n>
{
  "en": {
    "title": "Set measurement",
    "placeholder": "Enter a number (mm)"
  },
  "no": {
    "title": "Sett mål",
    "placeholder": "Skriv inn ett tall (mm)"
  }
}
</i18n>

<template>
  <action-dialog :shown.sync="visible">
    <template v-slot:title>
      {{ $t("title") }}
    </template>

    <template v-slot:actions>
      <v-btn
        text
        data-testid="eventsContestantsResultsMeasurementSubmitEditButton"
        :loading="eventsContestantsEditOneIsLoading"
        @click="submit(measurement)"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <v-text-field
      v-if="hasContestant"
      v-model="measurement"
      :placeholder="this.$t('placeholder')"
      :min="0"
      hide-details
      data-testid="eventsContestantsResultsMeasurementEditInput"
      class="-mt-6 pt-0"
      type="number"
      autofocus
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "EventsContestantsMeasurements",

  components: {
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data() {
    return {
      visible: this.shown,
      measurement: 0
    }
  },

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsEditOneIsLoading: "editOneIsLoading",
      eventsContestantsStateSelected: "selected"
    }),
    hasContestant(): boolean {
      return Object.keys(this.eventsContestantsStateSelected).length > 1
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.measurement = this.eventsContestantsStateSelected.measurement
      this.visible = visible
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsEditOne: "editOne"
    }),
    async submit(measurement: string): Promise<void> {
      await this.eventsContestantsActionsEditOne({
        ...this.eventsContestantsStateSelected,
        measurement: parseInt(measurement) || 0
      })
      this.close()
    },
    close(): void {
      this.visible = false
    }
  }
})
</script>
