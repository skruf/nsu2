<i18n>
{
  "en": {
    "eventsContestantsFormWeaponIdPlaceholder": "Weapon",
    "eventsContestantsFormWeaponIdError": "Weapon is a required field",
    "eventsContestantsFormCalibreLabel": "Calibre",
    "eventsContestantsFormCalibreError": "Calibre is a required field",
    "eventsContestantsFormDivisionIdLabel": "Division"
  },
  "no": {
    "eventsContestantsFormWeaponIdPlaceholder": "Våpen",
    "eventsContestantsFormWeaponIdError": "Våpen er et påkrevd felt",
    "eventsContestantsFormCalibreLabel": "Kaliber",
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
      :label="$t('eventsContestantsFormWeaponIdPlaceholder')"
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
      type="number"
      class="mb-3"
      outlined
      required
    />

    <v-select
      v-model="value.divisionId"
      :items="eventsDivisionsStateList"
      :loading="eventsDivisionsStateListIsLoading"
      :label="$t('eventsContestantsFormDivisionIdLabel')"
      data-testid="eventsContestantsFormDivisionIdSelect"
      item-value="id"
      item-text="name"
      outlined
    />

    <error-validation-notification
      :shown.sync="showValidationError"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import { eventsContestantsStub } from "@/stubs"
import ErrorValidationNotification from "@/components/ErrorValidationNotification.vue"

export default Vue.extend({
  name: "EventsContestantsForm",

  components: {
    ErrorValidationNotification
  },

  props: {
    value: { type: Object, default: (): object => eventsContestantsStub }
  },

  data: () => ({
    showValidationError: false
  }),

  computed: {
    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateList: "list"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateList: "list"
    })
  },

  watch: {
    value: {
      deep: true,
      handler(data): void {
        data.calibre = parseInt(data.calibre)
        this.$emit("input", data)
      }
    }
  },

  created() {
    this.weaponsActionsList({
      filter: {}, options: { limit: false }
    })
    this.eventsDivisionsActionsList({
      filter: { eventId: this.value.eventId }, options: { limit: false }
    })
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsList: "list"
    }),

    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list"
    }),

    submit(cb): void {
      this.$refs.localForm.validate()
        ? cb()
        : this.showValidationError = true
    },

    resetFields(): void {
      this.$refs.localForm.reset()
    }
  }
})
</script>
