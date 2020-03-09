<i18n>
{
  "en": {
    "dialogTitle": "Edit division",
    "eventsDivisionsActionsEditOneSuccess": "%{divisionDay} kl. %{divisionStartsAt} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger standplassliste",
    "eventsDivisionsActionsEditOneSuccess": "%{divisionDay} kl. %{divisionStartsAt} ble redigert i databasen"
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
        data-testid="eventsDivisionsEditDialogSubmitButton"
        :loading="eventsDivisionsStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <events-divisions-form
      ref="eventsDivisionsForm"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import EventsDivisionsForm from "./EventsDivisionsForm.vue"

export default Vue.extend({
  name: "EventsDivisionsEditDialog",

  components: {
    ActionDialog,
    EventsDivisionsForm
  },

  props: {
    shown: { type: Boolean, default: false },
    division: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...EventsDivisionsForm }
    }
  },

  computed: mapState("events/divisions", {
    eventsDivisionsStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    division: {
      immediate: true,
      handler(data): void {
        this.form = { ...data }
      }
    }
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.eventsDivisionsForm.submit(async () => {
        try {
          await this.eventsDivisionsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("eventsDivisionsActionsEditOneSuccess", {
              divisionDay: this.form.day,
              divisionStartsAt: this.form.startsAt
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
