<template>
  <v-snackbar
    v-model="visible"
    color="error"
    multi-line
    right
    top
  >
    <v-icon
      color="white"
      class="mr-4"
    >
      error
    </v-icon>

    {{ $t("validationError") }}

    <v-btn
      text
      data-testid="errorValidationNotificationCloseButton"
      @click="close"
    >
      {{ $t("close") }}
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "ErrorValidationNotification",

  props: {
    value: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.value
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("input", visible)
    },
    value(visible): void {
      this.visible = visible
    }
  },

  methods: {
    close(): void {
      this.visible = false
    }
  }
})
</script>>
