<style scoped>
.dialog-content {
  @apply p-5 pt-10;
  margin-top: 64px;
}
.dialog-footer {
  @apply px-5 absolute inset-x-0 bottom-0 bg-white flex items-center justify-end;
  height: 64px;
}
</style>

<template>
  <v-dialog
    v-model="visible"
    :content-class="`bg-white relative ${className ? className : ''}`"
    :max-width="maxWidth"
  >
    <v-toolbar
      dark
      color="primary"
      elevation="0"
      absolute
    >
      <v-btn
        icon
        dark
        @click="close"
      >
        <v-icon>
          close
        </v-icon>
      </v-btn>

      <v-toolbar-title class="pl-0 flex-1">
        <slot name="title" />
      </v-toolbar-title>

      <v-toolbar-items>
        <slot name="actions" />
      </v-toolbar-items>
    </v-toolbar>

    <div class="dialog-content">
      <slot />
    </div>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "ActionDialog",

  props: {
    shown: { type: Boolean, default: false },
    maxWidth: { type: Number, default: 500 },
    className: { type: String, required: false, default: "" }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    }
  },

  methods: {
    close(): void {
      this.visible = false
    }
  }
})
</script>
