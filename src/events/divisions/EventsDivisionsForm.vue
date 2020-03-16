<i18n>
{
  "en": {
    "eventsDivisionsFormDayLabel": "Choose a Day",
    "eventsDivisionsFormDayPlaceholder": "Pick a day",
    "eventsDivisionsFormDayError": "Day is a required field",
    "eventsDivisionsFormTimePlaceholder": "Pick or enter a time",
    "eventsDivisionsFormStartsAtLabel": "Starts",
    "eventsDivisionsFormStartsAtError": "Starts is a required field",
    "eventsDivisionsFormEndsAtLabel": "Ends",
    "eventsDivisionsFormEndsAtError": "Ends is a required field",
    "eventsDivisionsFormDistanceLabel": "Distance",
    "eventsDivisionsFormDistancePlaceholder": "Enter distance",
    "eventsDivisionsFormDistanceError": "Distance is a required field",
    "eventsDivisionsFormStandsCountLabel": "Number of lanes",
    "eventsDivisionsFormStandsCountPlaceholder": "Enter number",
    "eventsDivisionsFormStandsCountError": "Number of lanes is a required field",
    "eventsDivisionsFormAutoAssignLabel": "Automatically assign contestants"
  },
  "no": {
    "eventsDivisionsFormDayLabel": "Velg en dato",
    "eventsDivisionsFormDayPlaceholder": "Velg en dato",
    "eventsDivisionsFormDayError": "Dato er et påkrevd felt",
    "eventsDivisionsFormTimePlaceholder": "Velg eller skriv et klokkeslett",
    "eventsDivisionsFormStartsAtLabel": "Starter",
    "eventsDivisionsFormStartsAtError": "Starter er et påkrevd felt",
    "eventsDivisionsFormEndsAtLabel": "Slutter",
    "eventsDivisionsFormEndsAtError": "Slutter er et påkrevd felt",
    "eventsDivisionsFormDistanceLabel": "Distanse",
    "eventsDivisionsFormDistancePlaceholder": "Skriv inn en distanse",
    "eventsDivisionsFormDistanceError": "Distanse er et påkrevd felt",
    "eventsDivisionsFormStandsCountLabel": "Antall baner",
    "eventsDivisionsFormStandsCountPlaceholder": "Skriv inn antall",
    "eventsDivisionsFormStandsCountError": "Antall baner er et påkrevd felt",
    "eventsDivisionsFormAutoAssignLabel": "Automatisk tildel deltakere"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <date-picker
      v-model="value.day"
      :label="$t('eventsDivisionsFormDayLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormDayError')]"
      data-testid="eventsDivisionsFormDayInput"
      class-name="mb-3"
      required
    />

    <v-text-field
      v-model="value.startsAt"
      :label="$t('eventsDivisionsFormStartsAtLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormStartsAtError')]"
      data-testid="eventsDivisionsFormStartsAtInput"
      type="time"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.endsAt"
      :label="$t('eventsDivisionsFormEndsAtLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormEndsAtError')]"
      data-testid="eventsDivisionsFormEndsAtInput"
      type="time"
      class="mb-3"
      outlined
      required
    />

    <v-select
      v-model="value.distance"
      :label="$t('eventsDivisionsFormDistanceLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormDistanceError')]"
      :items="[
        { l: '25 meter', v: 25 },
        { l: '50 meter', v: 50 },
        { l: '100 meter', v: 100 }
      ]"
      item-text="l"
      item-value="v"
      data-testid="eventsDivisionsFormDistanceInput"
      append-icon="expand_more"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.standsCount"
      :label="$t('eventsDivisionsFormStandsCountLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormStandsCountError')]"
      data-testid="eventsDivisionsFormStandsCountInput"
      type="number"
      class="mb-3"
      outlined
      required
    />

    <v-switch
      v-model="value.autoAssign"
      :label="$t('eventsDivisionsFormAutoAssignLabel')"
      data-testid="eventsDivisionsFormAutoAssignSwitch"
    />

    <error-validation-notification
      v-model="showValidationError"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"
import eventsDivisionsStub from "./events.divisions.stub"
import DatePicker from "@/components/DatePicker.vue"
import ErrorValidationNotification
  from "@/components/ErrorValidationNotification.vue"

export default Vue.extend({
  name: "EventsDivisionsForm",

  components: {
    DatePicker,
    ErrorValidationNotification
  },

  props: {
    value: { type: Object, default: (): object => eventsDivisionsStub }
  },

  data: () => ({
    showValidationError: false
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateCategories: "categories",
      eventsDivisionsStateConditions: "conditions"
    })
  },

  watch: {
    value: {
      deep: true,
      handler(data): void {
        data.distance = parseInt(data.distance)
        data.standsCount = parseInt(data.standsCount)
        this.$emit("input", data)
      }
    }
  },

  methods: {
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
