<i18n>
{
  "en": {
    "dialogTitle": "Create club",
    "clubsActionsCreateSuccess": "%{clubsName} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett klubb",
    "clubsActionsCreateSuccess": "%{clubsName} ble lagt til i databasen"
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
        data-testid="clubsCreateDialogButtonSubmit"
        :loading="clubsStateCreateIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <clubs-form
      ref="clubsForm"
      v-model="form"
      data-testid="clubsCreateDialogForm"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import ClubsForm from "./ClubsForm.vue"

export default Vue.extend({
  name: "ClubsCreateDialog",

  components: {
    ActionDialog,
    ClubsForm
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: {}
    }
  },

  computed: mapState("clubs", {
    clubsStateCreateIsLoading: "createIsLoading"
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
    ...mapActions("clubs", {
      clubsActionsCreate: "create"
    }),

    submit(): void {
      this.$refs.clubsForm.submit(async () => {
        try {
          await this.clubsActionsCreate(this.form)
          this.$success(this.$t("clubsActionsCreateSuccess", {
            clubsName: this.form.name
          }))
          this.clear()
          this.close()
        } catch(e) {
          this.$error(e.message)
        }
      })
    },

    clear(): void {
      this.$refs.clubsForm.resetFields()
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
