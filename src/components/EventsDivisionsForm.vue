<i18n>
{
  "en": {
    "eventsDivisionsFormNameLabel": "Name",
    "eventsDivisionsFormNamePlaceholder": "Enter a name",
    "eventsDivisionsFormNameError": "Name is a required field",
    "eventsDivisionsFormDayLabel": "Choose a Day",
    "eventsDivisionsFormDayPlaceholder": "Pick a day",
    "eventsDivisionsFormDayError": "Day is a required field",
    "eventsDivisionsFormTimeLabel": "Time",
    "eventsDivisionsFormTimePlaceholder": "Pick a time",
    "eventsDivisionsFormTimeError": "Time is a required field",
    "eventsDivisionsFormDistanceLabel": "Distance",
    "eventsDivisionsFormDistancePlaceholder": "Enter distance",
    "eventsDivisionsFormDistanceError": "Distance is a required field",
    "eventsDivisionsFormStandsCountLabel": "Number of lanes",
    "eventsDivisionsFormStandsCountPlaceholder": "Enter number",
    "eventsDivisionsFormStandsCountError": "Number of lanes is a required field"
  },
  "no": {
    "eventsDivisionsFormNameLabel": "Navn",
    "eventsDivisionsFormNamePlaceholder": "Skriv et navn",
    "eventsDivisionsFormNameError": "Navn er et påkrevd felt",
    "eventsDivisionsFormDayLabel": "Velg en dato",
    "eventsDivisionsFormDayPlaceholder": "Velg en dato",
    "eventsDivisionsFormDayError": "Dato er et påkrevd felt",
    "eventsDivisionsFormTimeLabel": "Klokkeslett",
    "eventsDivisionsFormTimePlaceholder": "Velg eller skriv et klokkeslett",
    "eventsDivisionsFormTimeError": "Klokkeslett er et påkrevd felt",
    "eventsDivisionsFormDistanceLabel": "Distanse",
    "eventsDivisionsFormDistancePlaceholder": "Skriv inn en distanse",
    "eventsDivisionsFormDistanceError": "Distanse er et påkrevd felt",
    "eventsDivisionsFormStandsCountLabel": "Antall baner",
    "eventsDivisionsFormStandsCountPlaceholder": "Skriv inn antall",
    "eventsDivisionsFormStandsCountError": "Antall baner er et påkrevd felt"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.name"
      :label="$t('eventsDivisionsFormNameLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormNameError')]"
      data-testid="eventsDivisionsFormNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-menu
      ref="eventsDivisionsFormDay"
      v-model="eventsDivisionsFormDayShow"
      :close-on-content-click="false"
      :return-value.sync="value.day"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :value="eventsDivisionsFormDayInput"
          :label="$t('eventsDivisionsFormDayLabel')"
          data-testid="eventsDivisionsFormDayInput"
          readonly
          outlined
          required
          v-bind="attrs"
          v-on="on"
        />
      </template>

      <v-date-picker
        v-model="value.day"
        data-testid="eventsDivisionsFormDayDatePicker"
        no-title
        scrollable
      >
        <v-spacer />

        <v-btn
          text
          color="primary"
          data-testid="eventsDivisionsFormDayCancelButton"
          @click="eventsDivisionsFormDayShow = false"
        >
          {{ $t("cancel") }}
        </v-btn>

        <v-btn
          text
          color="primary"
          data-testid="eventsDivisionsFormDaySaveButton"
          @click="$refs.eventsDivisionsFormDay.save(value.day)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-menu>

    <v-text-field
      v-model="value.time"
      :label="$t('eventsDivisionsFormTimeLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormTimeError')]"
      data-testid="eventsDivisionsFormTimeInput"
      type="time"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.distance"
      :label="$t('eventsDivisionsFormDistanceLabel')"
      :rules="[(v) => !!v || $t('eventsDivisionsFormDistanceError')]"
      data-testid="eventsDivisionsFormDistanceInput"
      type="number"
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

    <error-validation-notification
      v-model="showValidationError"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"
import { eventsDivisionsStub } from "@/stubs"
import ErrorValidationNotification from "@/components/ErrorValidationNotification.vue"
import moment from "moment"

export default Vue.extend({
  name: "EventsDivisionsForm",

  components: {
    ErrorValidationNotification
  },

  props: {
    value: { type: Object, default: (): object => eventsDivisionsStub }
  },

  data: () => ({
    showValidationError: false,
    eventsDivisionsFormDayShow: false
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateCategories: "categories",
      eventsDivisionsStateConditions: "conditions"
    }),
    eventsDivisionsFormDayInput(): string {
      return this.value.day !== ""
        ? moment(this.value.day).format("DD-MMM-YY")
        : ""
    }
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
