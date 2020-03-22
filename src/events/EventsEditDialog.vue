<i18n>
{
  "en": {
    "dialogTitle": "Edit event",
    "eventsActionsEditOneSuccess": "%{eventsTitle} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger stevne",
    "eventsActionsEditOneSuccess": "%{eventsTitle} ble redigert i databasen"
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
        data-testid="eventsEditDialogSubmitButton"
        :loading="eventsStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <events-form
      ref="eventsForm"
      v-model="form"
      data-testid="eventsEditDialogForm"
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
  name: "EventsEditDialog",

  components: {
    ActionDialog,
    EventsForm
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsStub }
    }
  },

  computed: mapState("events", {
    eventsStateEditOneIsLoading: "editOneIsLoading"
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
      handler(data): void {
        this.form = { ...data }
      }
    }
  },

  methods: {
    ...mapActions("events", {
      eventsActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.eventsForm.submit(async () => {
        try {
          await this.eventsActionsEditOne(this.form)
          this.$success(this.$t("eventsActionsEditOneSuccess", {
            eventsTitle: this.form.title
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
