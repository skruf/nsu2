<i18n>
{
  "en": {
    "dialogTitle": "Create event",
    "eventsActionsCreateSuccess": "%{eventTitle} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett stevne",
    "eventsActionsCreateSuccess": "%{eventTitle} ble lagt til i databasen"
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
        data-testid="eventsCreateDialogSubmitButton"
        :loading="eventsStateCreateIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <events-form
      ref="eventsForm"
      v-model="form"
      data-testid="eventsCreateDialogForm"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import eventsStub from "./events.stub"
import EventsForm from "./EventsForm.vue"

export default Vue.extend({
  name: "EventsCreateDialog",

  components: {
    EventsForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsStub }
    }
  },

  computed: mapState("events", {
    eventsStateCreateIsLoading: "createIsLoading"
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
    ...mapActions("events", {
      eventsActionsCreate: "create"
    }),

    submit(): void {
      this.$refs.eventsForm.submit(async () => {
        try {
          await this.eventsActionsCreate(this.form)
          this.$success(this.$t("eventsActionsCreateSuccess", {
            eventTitle: this.form.title
          }))
          this.clear()
          this.close()
        } catch(e) {
          this.$error(e.message)
        }
      })
    },

    clear(): void {
      this.$refs.eventsForm.resetFields()
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
