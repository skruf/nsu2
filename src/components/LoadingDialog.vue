<template>
  <v-dialog
    v-model="value"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        {{ $t("loading") }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "LoadingDialog",

  props: {
    value: { type: Boolean, default: false }
  },

  // data: function() {
  //   return {
  //     visible: this.value
  //   }
  // },

  // watch: {
  //   visible(visible): void {
  //     this.$emit("input", visible)
  //   },
  //   value(visible): void {
  //     this.visible = visible
  //   }
  // }
})
</script>
