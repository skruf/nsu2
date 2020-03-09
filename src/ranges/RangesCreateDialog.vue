<i18n>
{
  "en": {
    "dialogTitle": "Create range",
    "rangesActionsCreateSuccess": "%{rangesName} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett skyttebane",
    "rangesActionsCreateSuccess": "%{rangesName} ble lagt til i databasen"
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
        data-testid="rangesCreateDialogSubmitButton"
        :loading="rangesStateCreateIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <ranges-form
      ref="rangesForm"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import RangesForm from "@/ranges/RangesForm.vue"
import rangesStub from "./ranges.stub"

export default Vue.extend({
  name: "RangesCreateDialog",

  components: {
    RangesForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...rangesStub }
    }
  },

  computed: mapState("ranges", {
    rangesStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsCreate: "create"
    }),

    submit(): void {
      this.$refs.rangesForm.submit(async () => {
        try {
          await this.rangesActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("rangesActionsCreateSuccess", {
              rangesName: this.form.name
            })
          })
          this.clear()
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

    clear(): void {
      this.$refs.rangesForm.resetFields()
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
