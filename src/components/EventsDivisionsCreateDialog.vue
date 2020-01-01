<i18n>
{
  "en": {
    "dialogTitle": "Create division",
    "eventsDivisionsActionsCreateSuccess": "%{divisionName} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett standplassliste",
    "eventsDivisionsActionsCreateSuccess": "%{divisionName} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <action-dialog :shown.sync="visible">
    <template v-slot:toolbar-title>
      <span class="headline mb-6">
        {{ $t("dialogTitle") }}
      </span>
    </template>

    <template v-slot:toolbar-items>
      <v-btn
        text
        data-testid="eventsDivisionsCreateDialogSubmitButton"
        :loading="eventsDivisionsStateCreateIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <template v-slot:content>
      <events-divisions-form
        ref="eventsDivisionsForm"
        v-model="form"
      />
    </template>
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { eventsDivisionsStub } from "@/stubs"
import EventsDivisionsForm from "@/components/EventsDivisionsForm.vue"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "EventsDivisionsCreateDialog",

  components: {
    EventsDivisionsForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsDivisionsStub }
    }
  },

  computed: mapState("events/divisions", {
    eventsDivisionsStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    event: {
      immediate: true,
      handler(event): void {
        this.form.eventId = event.id
      }
    }
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsCreate: "create"
    }),

    submit(): void {
      this.$refs.eventsDivisionsForm.submit(async () => {
        try {
          await this.eventsDivisionsActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("eventsDivisionsActionsCreateSuccess", {
              divisionName: this.form.name
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
      this.$refs.eventsDivisionsForm.resetFields()
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
