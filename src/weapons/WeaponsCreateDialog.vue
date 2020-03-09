<i18n>
{
  "en": {
    "dialogTitle": "Create weapon",
    "weaponsActionsCreateSuccess": "%{weaponsName} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett våpen",
    "weaponsActionsCreateSuccess": "%{weaponsName} ble lagt til i databasen"
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
        data-testid="weaponsCreateDialogSubmitButton"
        :loading="weaponsStateCreateIsLoading"
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
import ActionDialog from "@/components/ActionDialog.vue"
import WeaponsForm from "./WeaponsForm.vue"
import weaponsStub from "./weapons.stub"

export default Vue.extend({
  name: "WeaponsCreateDialog",

  components: {
    ActionDialog,
    WeaponsForm
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...weaponsStub }
    }
  },

  computed: mapState("weapons", {
    weaponsStateCreateIsLoading: "createIsLoading"
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
    ...mapActions("weapons", {
      weaponsActionsCreate: "create"
    }),

    submit(): void {
      this.$refs.weaponsForm.submit(async () => {
        try {
          await this.weaponsActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("weaponsActionsCreateSuccess", {
              weaponsName: this.form.name
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
      this.$refs.weaponsForm.resetFields()
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
