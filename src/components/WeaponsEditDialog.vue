<i18n>
{
  "en": {
    "dialogTitle": "Edit weapon",
    "weaponsActionsEditOneSuccess": "%{weaponsName} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger våpen",
    "weaponsActionsEditOneSuccess": "%{weaponsName} ble redigert i databasen"
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
        data-testid="weaponsEditDialogSubmitButton"
        :loading="weaponsStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <weapons-form
      ref="weaponsForm"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { weaponsStub } from "@/stubs"
import WeaponsForm from "@/components/WeaponsForm.vue"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "WeaponsEditDialog",

  components: {
    WeaponsForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    weapon: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...weaponsStub }
    }
  },

  computed: mapState("weapons", {
    weaponsStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    weapon: {
      immediate: true,
      handler(data): void {
        this.form = { ...data }
      }
    }
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.weaponsForm.submit(async () => {
        try {
          await this.weaponsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("weaponsActionsEditOneSuccess", {
              weaponsName: this.form.name
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
