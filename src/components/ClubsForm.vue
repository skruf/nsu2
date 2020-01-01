<i18n>
{
  "en": {
    "clubsFormNameLabel": "Name",
    "clubsFormNamePlaceholder": "Name",
    "clubsFormNameError": "Name is a required field",
    "clubsFormShortNameLabel": "Short name",
    "clubsFormShortNamePlaceholder": "Enter a short name",
    "clubsFormShortNameError": "Short name is a required field",
    "clubsFormLeaderFullNameLabel": "Leader",
    "clubsFormLeaderFullNamePlaceholder": "Enter a name",
    "clubsFormEmailAddressLabel": "Email",
    "clubsFormEmailAddressPlaceholder": "Enter an email address",
    "clubsFormPhoneNumberLabel": "Phone Number",
    "clubsFormPhoneNumberPlaceholder": "Enter a Phone Number",
    "clubsFormStreetAddressLabel": "Address",
    "clubsFormStreetAddressPlaceholder": "Enter an address",
    "clubsFormAreaLabel": "Area",
    "clubsFormAreaPlaceholder": "Enter an area",
    "clubsFormAreaError": "Area is a required field",
    "clubsFormCountryLabel": "Country",
    "clubsFormCountryPlaceholder": "Select a country",
    "clubsFormCountryError": "Country is a required field",
    "clubsFormWebsiteUrlLabel": "Website URL",
    "clubsFormWebsiteUrlPlaceholder": "Enter a website url",
    "clubsFormRangeIdLabel": "Range",
    "clubsFormRangeIdPlaceholder": "Select a shooting range"
  },
  "no": {
    "clubsFormNameLabel": "Navn",
    "clubsFormNamePlaceholder": "Navn",
    "clubsFormNameError": "Navn er et påkrevet felt",
    "clubsFormShortNameLabel": "Kortnavn",
    "clubsFormShortNamePlaceholder": "Skriv inn ett kortnavn",
    "clubsFormShortNameError": "Kortnavn er et påkrevet felt",
    "clubsFormLeaderFullNameLabel": "Leder",
    "clubsFormLeaderFullNamePlaceholder": "Skriv inn et navn",
    "clubsFormEmailAddressLabel": "Epost",
    "clubsFormEmailAddressPlaceholder": "Skriv inn en epost adresse",
    "clubsFormPhoneNumberLabel": "Telefonnummer",
    "clubsFormPhoneNumberPlaceholder": "Skriv inn ett telefonnummer",
    "clubsFormStreetAddressLabel": "Adresse",
    "clubsFormStreetAddressPlaceholder": "Skriv inn en adresse",
    "clubsFormAreaLabel": "Område",
    "clubsFormAreaPlaceholder": "Skriv inn et område",
    "clubsFormAreaError": "Område er et påkrevet felt",
    "clubsFormCountryLabel": "Land",
    "clubsFormCountryPlaceholder": "Velg et land",
    "clubsFormCountryError": "Land er et påkrevet felt",
    "clubsFormWebsiteUrlLabel": "Webside URL",
    "clubsFormWebsiteUrlPlaceholder": "Skriv inn en url til webside",
    "clubsFormRangeIdLabel": "Skyttebane",
    "clubsFormRangeIdPlaceholder": "Velg en skyttebane"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.name"
      :label="$t('clubsFormNameLabel')"
      :rules="[(v) => !!v || $t('clubsFormNameError')]"
      :placeholder="$t('clubsFormNamePlaceholder')"
      data-testid="clubsFormNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.shortName"
      :label="$t('clubsFormShortNameLabel')"
      :rules="[(v) => !!v || $t('clubsFormShortNameError')]"
      :placeholder="$t('clubsFormShortNamePlaceholder')"
      data-testid="clubsFormShortNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.leaderFullName"
      :label="$t('clubsFormLeaderFullNameLabel')"
      :placeholder="$t('clubsFormLeaderFullNamePlaceholder')"
      data-testid="clubsFormLeaderFullNameInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.emailAddress"
      :label="$t('clubsFormEmailAddressLabel')"
      :placeholder="$t('clubsFormEmailAddressPlaceholder')"
      data-testid="clubsFormEmailAddressInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.phoneNumber"
      :label="$t('clubsFormPhoneNumberLabel')"
      :placeholder="$t('clubsFormPhoneNumberPlaceholder')"
      data-testid="clubsFormPhoneNumberInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.streetAddress"
      :label="$t('clubsFormStreetAddressLabel')"
      :placeholder="$t('clubsFormStreetAddressPlaceholder')"
      data-testid="clubsFormStreetAddressInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.area"
      :label="$t('clubsFormAreaLabel')"
      :rules="[(v) => !!v || $t('clubsFormAreaError')]"
      :placeholder="$t('clubsFormAreaPlaceholder')"
      data-testid="clubsFormAreaInput"
      class="mb-3"
      outlined
      required
    />

    <v-select
      v-model="value.country"
      :items="clubsStateCountries"
      :label="$t('clubsFormCountryLabel')"
      :rules="[(v) => !!v || $t('clubsFormCountryError')]"
      :placeholder="$t('clubsFormCountryPlaceholder')"
      data-testid="clubsFormCountrySelect"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.websiteUrl"
      :label="$t('clubsFormWebsiteUrlLabel')"
      :placeholder="$t('clubsFormWebsiteUrlPlaceholder')"
      data-testid="clubsFormWebsiteUrlInput"
      class="mb-3"
      outlined
    />

    <v-select
      v-model="value.rangeId"
      :items="rangesStateList"
      :loading="rangesStateListIsLoading"
      :label="$t('clubsFormRangeIdLabel')"
      :placeholder="$t('clubsFormRangeIdPlaceholder')"
      item-text="name"
      item-value="id"
      data-testid="clubsFormRangeIdSelect"
      class="mb-3"
      outlined
    />

    <v-snackbar
      v-model="showValidationError"
      color="error"
      multi-line
      right
      top
    >
      <v-icon
        color="white"
        class="mr-4"
      >
        error
      </v-icon>

      {{ $t("validationError") }}

      <v-btn
        text
        @click="showValidationError = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import { clubsStub } from "@/stubs"

export default Vue.extend({
  name: "ClubsForm",

  props: {
    value: { type: Object, default: () => clubsStub }
  },

  data: () => ({
    showValidationError: false
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateCountries: "countries"
    }),
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list"
    })
  },

  created() {
    this.rangesActionsList()
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsList: "list"
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
