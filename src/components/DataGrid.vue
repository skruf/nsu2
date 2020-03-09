<template>
  <div class="text-base leading-none inline-flex items-center ml-8 print:text-sm">
    <template v-if="!loading">
      <div
        v-for="stat in stats"
        :key="stat"
        class="mr-8 last:print:mr-0"
      >
        <div class="mb-px pb-px text-sm opacity-75 print:text-xs">
          {{ stat }}
        </div>
        <slot :name="stat" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "DataGrid",
  props: {
    loading: { type: Boolean, default: false }
  },
  data: () => ({
    stats: []
  }),
  created(): void {
    this.stats = Object.keys(this.$slots)
  }
})
</script>
