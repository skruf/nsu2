<i18n>
{
  "en": {
    "eventsCategoriesFormNameLabel": "Name",
    "eventsCategoriesFormNamePlaceholder": "Enter a name",
    "eventsCategoriesFormNameError": "Name is a required field"
  },
  "no": {
    "eventsCategoriesFormNameLabel": "Navn",
    "eventsCategoriesFormNamePlaceholder": "Skriv et navn",
    "eventsCategoriesFormNameError": "Navn er et påkrevd felt"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.name"
      :label="$t('eventsCategoriesFormNameLabel')"
      :rules="[(v) => !!v || $t('eventsCategoriesFormNameError')]"
      data-testid="eventsCategoriesFormNameInput"
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
import eventsCategoriesStub from "./events.categories.stub"

export default Vue.extend({
  name: "EventsCategoriesForm",

  props: {
    value: { type: Object, default: (): object => eventsCategoriesStub }
  },

  data: () => ({
    showValidationError: false
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
