<template>
  <v-dialog
    v-model="visible"
    content-class="pt-16 bg-white relative"
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

    <div class="p-5 pt-10">
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
    maxWidth: { type: Number, default: 500 }
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
