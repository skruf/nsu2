<i18n>
{
  "en": {
    "dialogTitle": "Edit range",
    "rangesActionsEditOneSuccess": "%{rangesName} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger skyttebane",
    "rangesActionsEditOneSuccess": "%{rangesName} ble redigert i databasen"
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
        data-testid="rangesEditDialogSubmitButton"
        :loading="rangesStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <ranges-form
      ref="rangesForm"
      v-model="form"
      data-testid="rangesEditDialogForm"
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
  name: "RangesEditDialog",

  components: {
    RangesForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    range: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...rangesStub }
    }
  },

  computed: mapState("ranges", {
    rangesStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    range: {
      immediate: true,
      handler(data): void {
        this.form = { ...data }
      }
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.rangesForm.submit(async () => {
        try {
          await this.rangesActionsEditOne(this.form)
          this.$success(this.$t("rangesActionsEditOneSuccess", {
            rangesName: this.form.name
          }))
          this.close()
        } catch(e) {
          this.$error(e.message)
        }
      })
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
