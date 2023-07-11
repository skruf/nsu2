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
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import eventsCategoriesStub from "./events.categories.stub"

export default Vue.extend({
  name: "EventsCategoriesForm",

  props: {
    value: { type: Object, default: () => eventsCategoriesStub }
  },

  watch: {
    value: {
      deep: true,
      handler(data): void {
        this.$emit("input", data)
      }
    }
  },

  methods: {
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
