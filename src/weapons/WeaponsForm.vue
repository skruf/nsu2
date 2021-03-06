<i18n>
{
  "en": {
    "weaponsFormNumberLabel": "Number (*)",
    "weaponsFormNumberPlaceholder": "Enter a class number",
    "weaponsFormNumberError": "Number is a required field",
    "weaponsFormNameLabel": "Name (*)",
    "weaponsFormNamePlaceholder": "Enter a name",
    "weaponsFormNameError": "Name is a required field",
    "weaponsFormCategoryLabel": "Category (*)",
    "weaponsFormCategoryPlaceholder": "Select a category",
    "weaponsFormCategoryError": "Category is a required field",
    "weaponsFormConditionLabel": "Condition (*)",
    "weaponsFormConditionPlaceholder": "Select a condition",
    "weaponsFormConditionError": "Condition is a required field",
    "weaponsFormDistanceLabel": "Distance in meters (*)",
    "weaponsFormDistanceError": "Distance is a required field"
  },
  "no": {
    "weaponsFormNumberLabel": "Nummer (*)",
    "weaponsFormNumberPlaceholder": "Skriv et nummer",
    "weaponsFormNumberError": "Nummer er et påkrevd felt",
    "weaponsFormNameLabel": "Navn (*)",
    "weaponsFormNamePlaceholder": "Skriv et navn",
    "weaponsFormNameError": "Navn er et påkrevd felt",
    "weaponsFormCategoryLabel": "Kategori (*)",
    "weaponsFormCategoryPlaceholder": "Velg en kategori",
    "weaponsFormCategoryError": "Kategori er et påkrevd felt",
    "weaponsFormConditionLabel": "Tilstand (*)",
    "weaponsFormConditionPlaceholder": "Velg en tilstand",
    "weaponsFormConditionError": "Tilstand er et påkrevd felt",
    "weaponsFormDistanceLabel": "Avstand i meter (*)",
    "weaponsFormDistanceError": "Avstand er et påkrevd felt"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.number"
      :label="$t('weaponsFormNumberLabel')"
      :rules="[(v) => !!v || $t('weaponsFormNumberError')]"
      data-testid="weaponsFormNumberInput"
      class="mb-3"
      outlined
      required
    />

    <v-text-field
      v-model="value.name"
      :label="$t('weaponsFormNameLabel')"
      :rules="[(v) => !!v || $t('weaponsFormNameError')]"
      data-testid="weaponsFormNameInput"
      class="mb-3"
      outlined
      required
    />

    <v-select
      v-model="value.category"
      :items="weaponsStateCategories"
      :label="$t('weaponsFormCategoryLabel')"
      :rules="[(v) => !!v || $t('weaponsFormCategoryError')]"
      data-testid="weaponsFormCategorySelect"
      class="mb-3"
      outlined
      required
    />

    <!-- <v-select
      v-model="value.condition"
      :items="weaponsStateConditions"
      :label="$t('weaponsFormConditionLabel')"
      :rules="[(v) => !!v || $t('weaponsFormConditionError')]"
      data-testid="weaponsFormConditionSelect"
      class="mb-3"
      outlined
      required
    /> -->

    <v-select
      v-model="value.distance"
      :label="$t('weaponsFormDistanceLabel')"
      :rules="[(v) => !!v || $t('weaponsFormDistanceError')]"
      :items="[
        { l: '25 meter', v: 25 },
        { l: '50 meter', v: 50 },
        { l: '100 meter', v: 100 }
      ]"
      item-text="l"
      item-value="v"
      data-testid="weaponsFormDistanceInput"
      append-icon="expand_more"
      outlined
      required
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"
import weaponsStub from "./weapons.stub"

export default Vue.extend({
  name: "WeaponsForm",

  props: {
    value: { type: Object, default: () => weaponsStub }
  },

  computed: mapState("weapons", {
    weaponsStateCategories: "categories",
    weaponsStateConditions: "conditions"
  }),

  watch: {
    value: {
      deep: true,
      handler(data): void {
        data.distance = parseInt(data.distance)
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
