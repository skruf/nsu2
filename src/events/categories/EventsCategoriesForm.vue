<i18n>
{
  "en": {
    "eventsCategoriesFormNameLabel": "Name (*)",
    "eventsCategoriesFormNamePlaceholder": "Enter a name",
    "eventsCategoriesFormNameError": "Name is a required field"
  },
  "no": {
    "eventsCategoriesFormNameLabel": "Navn (*)",
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

    <error-validation-notification
      v-model="showValidationError"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import eventsCategoriesStub from "./events.categories.stub"
import ErrorValidationNotification
  from "@/components/ErrorValidationNotification.vue"

export default Vue.extend({
  name: "EventsCategoriesForm",

  components: {
    ErrorValidationNotification
  },

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
