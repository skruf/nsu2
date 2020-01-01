<i18n>
{
  "en": {
    "clubsMembersFormFirstNameLabel": "First Name",
    "clubsMembersFormFirstNamePlaceholder": "Enter a first name",
    "clubsMembersFormFirstNameError": "First name is a required field",
    "clubsMembersFormLastNameLabel": "Last Name",
    "clubsMembersFormLastNamePlaceholder": "Enter a last name",
    "clubsMembersFormLastNameError": "Last name is a required field",
    "clubsMembersFormEmailAddressLabel": "Email Address",
    "clubsMembersFormEmailAddressPlaceholder": "Enter a email address",
    "clubsMembersFormEmailAddressError": "Email is a required field",
    "clubsMembersFormPhoneNumberLabel": "Phone Number",
    "clubsMembersFormPhoneNumberPlaceholder": "Enter a phone number",
    "clubsMembersFormCountryLabel": "Country",
    "clubsMembersFormCountryPlaceholder": "Select a country",
    "clubsMembersFormCountryError": "Country is a required field",
    "clubsMembersFormClubIdLabel": "Club",
    "clubsMembersFormClubIdPlaceholder": "Please select a club",
    "clubsMembersFormClubIdError": "Select a club"
  },
  "no": {
    "clubsMembersFormFirstNameLabel": "Fornavn",
    "clubsMembersFormFirstNamePlaceholder": "Skriv inn fornavn",
    "clubsMembersFormFirstNameError": "Fornavn er et påkrevd felt",
    "clubsMembersFormLastNameLabel": "Etternavn",
    "clubsMembersFormLastNamePlaceholder": "Skriv inn etternavn",
    "clubsMembersFormLastNameError": "Etternavn er et påkrevd felt",
    "clubsMembersFormEmailAddressLabel": "Epost adresse",
    "clubsMembersFormEmailAddressPlaceholder": "Skriv inn en e-post adresse",
    "clubsMembersFormEmailAddressError": "Epost adresse er et påkrevd felt",
    "clubsMembersFormPhoneNumberLabel": "Telefonnummer",
    "clubsMembersFormPhoneNumberPlaceholder": "Skriv inn et telefonnummer",
    "clubsMembersFormCountryLabel": "Land",
    "clubsMembersFormCountryPlaceholder": "Velg et land",
    "clubsMembersFormCountryError": "Lang er et påkrevd felt",
    "clubsMembersFormClubIdLabel": "Klubb",
    "clubsMembersFormClubIdPlaceholder": "Velg en klubb",
    "clubsMembersFormClubIdError": "Klubb er et påkrevd felt"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.firstName"
      :label="$t('clubsMembersFormFirstNameLabel')"
      :rules="[(v) => !!v || $t('clubsMembersFormFirstNameError')]"
      data-testid="clubsMembersFormFirstNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.lastName"
      :label="$t('clubsMembersFormLastNameLabel')"
      :rules="[(v) => !!v || $t('clubsMembersFormLastNameError')]"
      data-testid="clubsMembersFormLastNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.emailAddress"
      :label="$t('clubsMembersFormEmailAddressLabel')"
      data-testid="clubsMembersFormEmailAddressInput"
      class="mb-3"
      outlined
    />

    <v-text-field
      v-model="value.phoneNumber"
      :label="$t('clubsMembersFormPhoneNumberLabel')"
      data-testid="clubsMembersFormPhoneNumberInput"
      class="mb-3"
      outlined
    />

    <v-select
      v-model="value.country"
      :items="clubsMembersStateCountries"
      :label="$t('clubsMembersFormCountryLabel')"
      :rules="[(v) => !!v || $t('clubsMembersFormCountryError')]"
      data-testid="clubsMembersFormCountrySelect"
      class="mb-3"
      outlined
      required
    />

    <v-select
      v-model="value.clubId"
      :items="clubsStateList"
      :loading="clubsStateListIsLoading"
      :label="$t('clubsMembersFormClubIdLabel')"
      :rules="[(v) => !!v || $t('clubsMembersFormClubIdError')]"
      data-testid="clubsFormClubIdSelect"
      item-value="id"
      item-text="name"
      class="mb-3"
      outlined
      required
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
        {{ $t("close") }}
      </v-btn>
    </v-snackbar>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import { clubsMembersStub } from "@/stubs"

export default Vue.extend({
  name: "ClubsMembersForm",

  props: {
    value: { type: Object, default: (): object => clubsMembersStub },
    club: { type: Object, required: false, default: (): null => null }
  },

  data: () => ({
    showValidationError: false
  }),

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
      async handler(): Promise<void> {
        this.localForm = this.form
        await this.clubsActionsList()
        if(this.club) this.form.clubId = this.club.id
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
        : this.showValidationError = true
    },

    resetFields(): void {
      this.$refs.localForm.reset()
    }
  }
})
</script>
