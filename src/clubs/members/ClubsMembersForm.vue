<i18n>
{
  "en": {
    "firstNameLabel": "First Name (*)",
    "firstNamePlaceholder": "Enter a first name",
    "firstNameError": "First name is a required field",
    "lastNameLabel": "Last Name (*)",
    "lastNamePlaceholder": "Enter a last name",
    "lastNameError": "Last name is a required field",
    "emailAddressLabel": "Email Address",
    "emailAddressPlaceholder": "Enter a email address",
    "emailAddressError": "Email is a required field",
    "streetAddressLabel": "Street Address",
    "phoneNumberLabel": "Phone Number",
    "phoneNumberPlaceholder": "Enter a phone number",
    "countryLabel": "Country",
    "countryPlaceholder": "Select a country",
    "countryError": "Country is a required field",
    "clubIdLabel": "Club",
    "clubIdPlaceholder": "Please select a club",
    "clubIdError": "Select a club"
  },
  "no": {
    "firstNameLabel": "Fornavn (*)",
    "firstNamePlaceholder": "Skriv inn fornavn",
    "firstNameError": "Fornavn er et påkrevd felt",
    "lastNameLabel": "Etternavn (*)",
    "lastNamePlaceholder": "Skriv inn etternavn",
    "lastNameError": "Etternavn er et påkrevd felt",
    "emailAddressLabel": "Epost adresse",
    "emailAddressPlaceholder": "Skriv inn en e-post adresse",
    "emailAddressError": "Epost adresse er et påkrevd felt",
    "streetAddressLabel": "Adresse",
    "phoneNumberLabel": "Telefonnummer",
    "phoneNumberPlaceholder": "Skriv inn et telefonnummer",
    "countryLabel": "Land",
    "countryPlaceholder": "Velg et land",
    "countryError": "Lang er et påkrevd felt",
    "clubIdLabel": "Klubb",
    "clubIdPlaceholder": "Velg en klubb",
    "clubIdError": "Klubb er et påkrevd felt"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.firstName"
      :label="$t('firstNameLabel')"
      :rules="[(v) => !!v || $t('firstNameError')]"
      data-testid="firstNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.lastName"
      :label="$t('lastNameLabel')"
      :rules="[(v) => !!v || $t('lastNameError')]"
      data-testid="lastNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.emailAddress"
      :label="$t('emailAddressLabel')"
      data-testid="emailAddressInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.phoneNumber"
      :label="$t('phoneNumberLabel')"
      data-testid="phoneNumberInput"
      class="mb-3"
      outlined
    />

    <v-textarea
      v-model="value.streetAddress"
      :label="$t('streetAddressLabel')"
      data-testid="streetAddressInput"
      class="mb-3"
      outlined
      rows="2"
    />

    <v-select
      v-model="value.country"
      :items="clubsMembersStateCountries"
      :label="$t('countryLabel')"
      data-testid="CountrySelect"
      class="mb-3"
      outlined
    />

    <v-select
      v-model="value.clubId"
      :items="clubsStateList"
      :loading="clubsStateListIsLoading"
      :label="$t('clubIdLabel')"
      data-testid="clubsFormClubIdSelect"
      item-value="id"
      item-text="name"
      class="mb-3"
      outlined
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import clubsMembersStub from "./clubs.members.stub"

export default Vue.extend({
  name: "ClubsMembersForm",

  props: {
    value: { type: Object, default: (): object => clubsMembersStub },
    club: { type: Object, required: false, default: (): null => null }
  },

  computed: {
    ...mapState("clubs/members", {
      clubsMembersStateCountries: "countries"
    }),
    ...mapState("clubs", {
      clubsStateList: "list",
      clubsStateListIsLoading: "listIsLoading"
    })
  },

  watch: {
    club: {
      immediate: true,
      handler(): void {
        this.clubsActionsList()
        if(!this.club) return
        this.value.clubId = this.club.id
      }
    },
    value: {
      deep: true,
      handler(data): void {
        this.$emit("input", data)
      }
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsList: "list"
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
