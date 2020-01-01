<template>
  <div class="text-base leading-none inline-flex items-center">
    <template v-for="stat in stats">
      <div
        :key="stat"
        class="mr-8"
      >
        <div class="mr-2 mb-px pb-px text-sm opacity-75">
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
  data: () => ({
    stats: []
  }),
  created(): void {
    this.stats = Object.keys(this.$slots)
  }
})
</script>
