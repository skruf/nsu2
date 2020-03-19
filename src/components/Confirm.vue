<template>
  <v-dialog
    v-model="show"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar
        :color="options.color"
        dark
        dense
        flat
      >
        <v-toolbar-title class="white--text">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text
        v-show="!!message"
        class="pa-4"
      >
        {{ message }}
      </v-card-text>

      <v-card-actions class="pt-0">
        <v-spacer />

        <v-btn
          text
          color="grey darken-3"
          data-testid="confirmCancel"
          @click.native="cancel"
        >
          {{ this.$t("cancel") }}
        </v-btn>

        <v-btn
          text
          data-testid="confirmAgree"
          :color="options.color"
          @click.native="agree"
        >
          {{ this.$t("confirmButtonText") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm" />
 *
 * Call it:
 * this.$refs.confirm.open("Delete", "Are you sure?", { color: "red" }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open("Delete", "Are you sure?", { color: "red" })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */
import Vue from "vue"

export default Vue.extend({
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: "primary",
      width: 290,
      zIndex: 200
    }
  }),
  computed: {
    show: {
      get(): boolean {
        return this.dialog
      },
      set(value): void {
        this.dialog = value
        if(value === false) this.cancel()
      }
    }
  },
  methods: {
    dangerous(message: string): Promise<boolean> {
      return this.open("Vennligst bekreft", message, {
        color: "red"
      })
    },
    open(
      title: string,
      message: string,
      options: {
        color: string,
        width: number,
        zIndex: number
      }
    ): Promise<boolean> {
      this.dialog = true
      this.title = title
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree(): void {
      this.resolve(true)
      this.dialog = false
    },
    cancel(): void {
      this.resolve(false)
      this.dialog = false
    }
  }
})
</script>
