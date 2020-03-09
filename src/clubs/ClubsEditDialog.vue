<i18n>
{
  "en": {
    "dialogTitle": "Edit club",
    "clubsActionsEditOneSuccess": "%{clubsName} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger klubb",
    "clubsActionsEditOneSuccess": "%{clubsName} ble redigert i databasen"
  }
}
</i18n>

<template>
  <action-dialog :shown.sync="visible">
    <template v-slot:title>
      {{ $t("dialogTitle") }}
    </template>

    <template v-slot:actions>
      <v-btn
        text
        data-testid="clubsEditDialogSubmitButton"
        :loading="clubsStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <clubs-form
      ref="clubsForm"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import ClubsForm from "./ClubsForm.vue"

export default Vue.extend({
  name: "ClubsEditDialog",

  components: {
    ActionDialog,
    ClubsForm
  },

  props: {
    shown: { type: Boolean, default: false },
    club: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: {}
    }
  },

  computed: mapState("clubs", {
    clubsStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    club: {
      immediate: true,
      handler(data): void {
        this.form = { ...data }
      }
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.clubsForm.submit(async () => {
        try {
          await this.clubsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("clubsActionsEditOneSuccess", {
              clubsName: this.form.name
            })
          })
          this.close()
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      })
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
