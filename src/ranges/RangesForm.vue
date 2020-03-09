<i18n>
{
  "en": {
    "rangesFormNameLabel": "Name",
    "rangesFormNamePlaceholder": "Enter a name",
    "rangesFormNameError": "Name is a required field",
    "rangesFormAreaLabel": "Area",
    "rangesFormAreaPlaceholder": "Enter an area",
    "rangesFormAreaError": "Area is a required field",
    "rangesFormStreetAddressLabel": "Address",
    "rangesFormStreetAddressPlaceholder": "Enter a address",
    "rangesFormCountryLabel": "Country",
    "rangesFormCountryPlaceholder": "Select a country",
    "rangesFormCountryError": "Country is a required field",
    "rangesFormLatLabel": "Latitude",
    "rangesFormLatPlaceholder": "Enter coordinates",
    "rangesFormLngLabel": "Longitude",
    "rangesFormLngPlaceholder": "Enter coordinates",
    "rangesFormTypeLabel": "Type",
    "rangesFormTypePlaceholder": "Select a type",
    "rangesFormTypeError": "Type is a required field"
  },
  "no": {
    "rangesFormNameLabel": "Navn",
    "rangesFormNamePlaceholder": "Skriv et navn",
    "rangesFormNameError": "Navn er et påkrevd felt",
    "rangesFormAreaLabel": "Område",
    "rangesFormAreaPlaceholder": "Skriv et område",
    "rangesFormAreaError": "Område er et påkrevd felt",
    "rangesFormStreetAddressLabel": "Adresse",
    "rangesFormStreetAddressPlaceholder": "Skriv en adresse",
    "rangesFormCountryLabel": "Land",
    "rangesFormCountryPlaceholder": "Velg et land",
    "rangesFormCountryError": "Land er et påkrevd felt",
    "rangesFormLatLabel": "Breddegrad",
    "rangesFormLatPlaceholder": "Skriv inn koordinater",
    "rangesFormLngLabel": "Lengdegrad",
    "rangesFormLngPlaceholder": "Skriv inn koordinater",
    "rangesFormTypeLabel": "Type",
    "rangesFormTypePlaceholder": "Velg en type",
    "rangesFormTypeError": "Type er et påkrevd felt"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.name"
      :label="$t('rangesFormNameLabel')"
      :rules="[(v) => !!v || $t('rangesFormNameError')]"
      data-testid="rangesFormNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.area"
      :label="$t('rangesFormAreaLabel')"
      :rules="[(v) => !!v || $t('rangesFormAreaError')]"
      data-testid="rangesFormAreaInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.streetAddress"
      :label="$t('rangesFormStreetAddressLabel')"
      data-testid="rangesFormStreetAddressInput"
      class="mb-3"
      outlined
    />

    <v-select
      v-model="value.country"
      :items="rangesStateCountries"
      :label="$t('rangesFormCountryLabel')"
      :rules="[(v) => !!v || $t('rangesFormCountryError')]"
      data-testid="rangesFormCountrySelect"
      class="mb-3"
      outlined
      required
    />

    <div class="flex mb-3">
      <v-text-field
        v-model="value.lat"
        :label="$t('rangesFormLatLabel')"
        data-testid="rangesFormLatInput"
        class="mr-2"
        outlined
      />

      <v-text-field
        v-model="value.lng"
        :label="$t('rangesFormLngLabel')"
        data-testid="rangesFormLngInput"
        class="ml-2"
        outlined
      />
    </div>

    <v-select
      v-model="value.type"
      :items="rangesStateTypes"
      :label="$t('rangesFormTypeLabel')"
      :rules="[(v) => !!v || $t('rangesFormTypeError')]"
      data-testid="rangesFormTypeSelect"
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
import ErrorValidationNotification
  from "@/components/ErrorValidationNotification.vue"
import rangesStub from "./ranges.stub"

export default Vue.extend({
  name: "RangesForm",

  components: {
    ErrorValidationNotification
  },

  props: {
    value: { type: Object, default: (): object => rangesStub }
  },

  data: () => ({
    showValidationError: false
  }),

  computed: mapState("ranges", {
    rangesStateCountries: "countries",
    rangesStateTypes: "types"
  }),

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
