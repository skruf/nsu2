<i18n>
{
  "en": {
    "eventsContestantsFormWeaponIdLabel": "Class (*)",
    "eventsContestantsFormWeaponIdError": "Class is a required field",
    "eventsContestantsFormCalibreLabel": "Calibre (*)",
    "eventsContestantsFormCalibreError": "Calibre is a required field",
    "eventsContestantsFormDivisionIdLabel": "Division"
  },
  "no": {
    "eventsContestantsFormWeaponIdLabel": "Klasse (*)",
    "eventsContestantsFormWeaponIdError": "Klasse er et påkrevd felt",
    "eventsContestantsFormCalibreLabel": "Kaliber (*)",
    "eventsContestantsFormCalibreError": "Kaliber er et påkrevd felt",
    "eventsContestantsFormDivisionIdLabel": "Standplassliste"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-autocomplete
      v-model="value.weaponId"
      :items="weaponsStateList"
      :loading="weaponsStateListIsLoading"
      item-text="name"
      item-value="id"
      :label="$t('eventsContestantsFormWeaponIdLabel')"
      :rules="[(v) => !!v || $t('eventsContestantsFormWeaponIdError')]"
      data-testid="eventsContestantsFormWeaponIdSelect"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.calibre"
      :label="$t('eventsContestantsFormCalibreLabel')"
      :rules="[(v) => !!v || $t('eventsContestantsFormCalibreError')]"
      data-testid="eventsContestantsFormCalibreInput"
      class="mb-3"
      outlined
      required
    />

    <!-- <v-select
      v-model="value.divisionId"
      :items="eventsDivisionsStateList"
      :loading="eventsDivisionsStateListIsLoading"
      :label="$t('eventsContestantsFormDivisionIdLabel')"
      :item-text="formatDivision"
      item-value="id"
      data-testid="eventsContestantsFormDivisionIdSelect"
      outlined
    /> -->
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import eventsContestantsStub from "./events.contestants.stub"

export default Vue.extend({
  name: "EventsContestantsForm",

  props: {
    value: { type: Object, default: () => eventsContestantsStub }
  },

  computed: {
    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateList: "list"
    }),
    // ...mapState("events/divisions", {
    //   eventsDivisionsStateListIsLoading: "listIsLoading",
    //   eventsDivisionsStateList: "list"
    // })
  },

  watch: {
    value: {
      deep: true,
      handler(data): void {
        this.$emit("input", data)
      }
    }
  },

  created() {
    this.weaponsActionsList({
      filter: {}, options: { limit: false }
    })
    // this.eventsDivisionsActionsList({
    //   filter: { eventId: this.value.eventId }
    // })
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsList: "list"
    }),

    // ...mapActions("events/divisions", {
    //   eventsDivisionsActionsList: "list"
    // }),

    submit(cb): void {
      this.$refs.localForm.validate()
        ? cb()
        : this.$error(this.$t("validationError"))
    },

    resetFields(): void {
      this.$refs.localForm.reset()
    },

    // formatDivision({ day, time, distance }): string {
    //   return `${this.$date(day).format("ddd, DD/MMM")} - ${distance} meter`
    // }
  }
})
</script>
