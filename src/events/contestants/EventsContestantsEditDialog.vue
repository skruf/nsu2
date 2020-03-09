<i18n>
{
  "en": {
    "dialogTitle": "Edit %{eventsContestantName}",
    "eventsContestantsActionsEditOneSuccess": "%{eventsContestantName} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger %{eventsContestantName}",
    "eventsContestantsActionsEditOneSuccess": "%{eventsContestantName} ble redigert i databasen"
  }
}
</i18n>

<template>
  <action-dialog :shown.sync="visible">
    <template v-slot:title>
      {{ $t("dialogTitle", { eventsContestantName }) }}
    </template>

    <template v-slot:actions>
      <v-btn
        text
        data-testid="eventsContestantsEditDialogButtonSubmit"
        :loading="eventsContestantsStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <events-contestants-form
      ref="eventsContestantsForm"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import eventsContestantsStub from "./events.contestants.stub"
import EventsContestantsForm from "./EventsContestantsForm.vue"

export default Vue.extend({
  name: "EventsContestantsEditDialog",

  components: {
    ActionDialog,
    EventsContestantsForm
  },

  props: {
    shown: { type: Boolean, default: false },
    eventsContestant: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsContestantsStub }
    }
  },

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsStateEditOneIsLoading: "editOneIsLoading"
    }),
    eventsContestantName(): string {
      if(!this.eventsContestant.clubMember) return
      const { clubMember } = this.eventsContestant
      return `${clubMember.firstName} ${clubMember.lastName}`
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    eventsContestant: {
      immediate: true,
      handler(data): void {
        this.form = {
          ...data,
          currentDivisionId: data.divisionId
        }
      }
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.eventsContestantsForm.submit(async () => {
        try {
          await this.eventsContestantsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("eventsContestantsActionsEditOneSuccess", {
              eventsContestantName: this.eventsContestantName
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
