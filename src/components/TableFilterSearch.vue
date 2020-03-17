<template>
  <div class="w-full max-w-xs">
    <v-text-field
      v-model="search"
      v-bind="$attrs"
      prepend-inner-icon="search"
      outlined
      dense
      hide-details
      single-line
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "TableFilterSearch",
  props: {
    value: { type: String, required: true }
  },
  data() {
    return {
      search: ""
    }
  },
  watch: {
    search(v): void {
      this.$emit("input", v)
    }
  },
  created() {
    this.search = this.value
  }
})
</script>
