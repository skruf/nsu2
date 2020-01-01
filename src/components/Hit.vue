<template>
  <span
    class="w-6 py-2 bg-gray-300 mx-px rounded text-xs font-semibold flex justify-center items-center"
    :style="`background-color:${bg};`"
  >
    {{ h.sum }}
  </span>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "Hit",

  props: {
    value: { type: Number, default: 0 }
  },

  computed: {
    bg(): string {
      switch(true) {
        case (this.value === 10):
          return "#9dffb4"
        case (this.value === 9):
          return "#eee"
        case (this.value >= 6):
          return "#eee"
        case (this.value >= 3):
          return "#eee"
        case (this.value >= 1):
          return "#eee"
        default:
          return "#f2f2f2"
      }
    }
  }
})
</script>
