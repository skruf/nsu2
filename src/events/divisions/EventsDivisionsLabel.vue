<i18n>
{
  "en": {
    "notAssigned": "Not assigned"
  },
  "no": {
    "notAssigned": "Ikke tildelt"
  }
}
</i18n>

<template>
  <span v-bind="$attrs">
    {{ text }}
  </span>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "EventsDivisionsLabel",
  props: {
    division: { type: Object, required: true },
    prefix: { type: Boolean, default: false }
  },
  computed: {
    text(): string {
      const prefix = this.prefix
        ? `${this.$t("division")}: `
        : ""

      return this.division && this.division.day
        ? prefix + `${this.$date(this.division.day).format("DD MMM YYYY")} - ${this.division.distance} meter`
        : prefix + `${this.$t("notAssigned")}`
    }
  }
})
</script>
