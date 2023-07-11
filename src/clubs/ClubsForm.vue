<i18n>
{
  "en": {
    "nameLabel": "Name (*)",
    "namePlaceholder": "Name",
    "nameError": "Name is a required field",
    "shortNameLabel": "Short name (*)",
    "shortNamePlaceholder": "Enter a short name",
    "shortNameError": "Short name is a required field",
    "zipCodeLabel": "Zip Code (*)",
    "zipCodePlaceholder": "Enter a zip code",
    "zipCodeError": "Zip Code is a required field",
    "areaLabel": "Area (*)",
    "areaPlaceholder": "Enter an area",
    "areaError": "Area is a required field",
    "leaderFullNameLabel": "Leader",
    "leaderFullNamePlaceholder": "Enter a name",
    "emailAddressLabel": "Email",
    "emailAddressPlaceholder": "Enter an email address",
    "phoneNumberLabel": "Phone Number",
    "phoneNumberPlaceholder": "Enter a Phone Number",
    "streetAddressLabel": "Address",
    "streetAddressPlaceholder": "Enter an address",
    "countryLabel": "Country (*)",
    "countryPlaceholder": "Select a country",
    "countryError": "Country is a required field",
    "websiteUrlLabel": "Website URL",
    "websiteUrlPlaceholder": "Enter a website url",
    "rangeIdLabel": "Range",
    "rangeIdPlaceholder": "Select a shooting range"
  },
  "no": {
    "nameLabel": "Navn (*)",
    "namePlaceholder": "Navn",
    "nameError": "Navn er et påkrevet felt",
    "shortNameLabel": "Kortnavn (*)",
    "shortNamePlaceholder": "Skriv inn ett kortnavn",
    "shortNameError": "Kortnavn er et påkrevet felt",
    "zipCodeLabel": "Postnummer (*)",
    "zipCodePlaceholder": "Skriv inn et postnummer",
    "zipCodeError": "Postnummer er et påkrevet felt",
    "areaLabel": "Område (*)",
    "areaPlaceholder": "Skriv inn et område",
    "areaError": "Område er et påkrevet felt",
    "leaderFullNameLabel": "Leder",
    "leaderFullNamePlaceholder": "Skriv inn et navn",
    "emailAddressLabel": "Epost",
    "emailAddressPlaceholder": "Skriv inn en epost adresse",
    "phoneNumberLabel": "Telefonnummer",
    "phoneNumberPlaceholder": "Skriv inn ett telefonnummer",
    "streetAddressLabel": "Adresse",
    "streetAddressPlaceholder": "Skriv inn en adresse",
    "countryLabel": "Land (*)",
    "countryPlaceholder": "Velg et land",
    "countryError": "Land er et påkrevet felt",
    "websiteUrlLabel": "Webside URL",
    "websiteUrlPlaceholder": "Skriv inn en url til webside",
    "rangeIdLabel": "Skyttebane",
    "rangeIdPlaceholder": "Velg en skyttebane"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.name"
      :label="$t('nameLabel')"
      :rules="[(v) => !!v || $t('nameError')]"
      :placeholder="$t('namePlaceholder')"
      data-testid="clubsFormNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.shortName"
      :label="$t('shortNameLabel')"
      :rules="[(v) => !!v || $t('shortNameError')]"
      :placeholder="$t('shortNamePlaceholder')"
      data-testid="clubsFormShortNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.zipCode"
      :label="$t('zipCodeLabel')"
      :rules="[(v) => !!v || $t('zipCodeError')]"
      :placeholder="$t('zipCodePlaceholder')"
      data-testid="clubsFormZipCodeInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.area"
      :label="$t('areaLabel')"
      :rules="[(v) => !!v || $t('areaError')]"
      :placeholder="$t('areaPlaceholder')"
      data-testid="clubsFormAreaInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.leaderFullName"
      :label="$t('leaderFullNameLabel')"
      :placeholder="$t('leaderFullNamePlaceholder')"
      data-testid="clubsFormLeaderFullNameInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.emailAddress"
      :label="$t('emailAddressLabel')"
      :placeholder="$t('emailAddressPlaceholder')"
      data-testid="clubsFormEmailAddressInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.phoneNumber"
      :label="$t('phoneNumberLabel')"
      :placeholder="$t('phoneNumberPlaceholder')"
      data-testid="clubsFormPhoneNumberInput"
      class="mb-3"
      outlined
    />

    <v-textarea
      v-model="value.streetAddress"
      :label="$t('streetAddressLabel')"
      :placeholder="$t('streetAddressPlaceholder')"
      data-testid="clubsFormStreetAddressInput"
      class="mb-3"
      outlined
      rows="2"
    />

    <v-select
      v-model="value.country"
      :items="clubsStateCountries"
      :label="$t('countryLabel')"
      :rules="[(v) => !!v || $t('countryError')]"
      :placeholder="$t('countryPlaceholder')"
      data-testid="clubsFormCountrySelect"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.websiteUrl"
      :label="$t('websiteUrlLabel')"
      :placeholder="$t('websiteUrlPlaceholder')"
      data-testid="clubsFormWebsiteUrlInput"
      class="mb-3"
      outlined
    />

    <v-select
      v-model="value.rangeId"
      :items="rangesStateList"
      :loading="rangesStateListIsLoading"
      :label="$t('rangeIdLabel')"
      :placeholder="$t('rangeIdPlaceholder')"
      item-text="name"
      item-value="id"
      data-testid="clubsFormRangeIdSelect"
      class="mb-3"
      outlined
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import clubsStub from "./clubs.stub"

export default Vue.extend({
  name: "ClubsForm",

  props: {
    value: { type: Object, default: () => clubsStub }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateCountries: "countries"
    }),
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list"
    })
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(data): void {
        this.$emit("input", data)
      }
    }
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
        : this.$error(this.$t("validationError"))
    },

    resetFields(): void {
      this.$refs.localForm.reset()
    }
  }
})
</script>
