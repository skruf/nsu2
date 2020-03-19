<i18n>
{
  "en": {
    "dialogTitle": "Create division",
    "eventsDivisionsActionsCreateSuccess": "%{divisionDay} kl. %{divisionStartsAt} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett standplassliste",
    "eventsDivisionsActionsCreateSuccess": "%{divisionDay} kl. %{divisionStartsAt} ble lagt til i databasen"
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
        data-testid="eventsDivisionsCreateDialogSubmitButton"
        :loading="eventsDivisionsStateCreateIsLoading"
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
import eventsDivisionsStub from "./events.divisions.stub"
import EventsDivisionsForm from "./EventsDivisionsForm.vue"

export default Vue.extend({
  name: "EventsDivisionsCreateDialog",

  components: {
    ActionDialog,
    EventsDivisionsForm
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
          this.$success(this.$t("eventsDivisionsActionsCreateSuccess", {
            divisionDay: this.form.day,
            divisionStartsAt: this.form.startsAt
          }))
          this.clear()
          this.close()
        } catch(e) {
          this.$error(e.message)
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
