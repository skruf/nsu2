<template>
  <v-autocomplete
    v-model="selection"
    v-bind="$attrs"
    :items="items"
    item-value="id"
    multiple
    chips
    single-line
    dense
    small-chips
    outlined
    hide-details
    clearable
    append-icon="expand_more"
  >
    <!-- deletable-chips -->
    <template v-slot:selection="{ item, index }">
      <!-- close -->
      <v-chip
        v-if="index === 0"
        small
        label
        color="primary"
      >
        <slot v-bind="item" />
      </v-chip>
      <span
        v-if="index === 1"
        class="grey--text caption"
      >
        (+{{ selection.length - 1 }} til)
      </span>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "TableFilterSelect",
  props: {
    value: { type: Array, required: true },
    items: { type: Array, required: true }
  },
  data: function() {
    return {
      selection: []
    }
  },
  watch: {
    selection(v): void {
      this.$emit("input", v)
    }
  },
  created() {
    this.selection = this.value
  }
})
</script>
