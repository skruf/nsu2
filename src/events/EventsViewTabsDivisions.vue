<i18n>
{
  "en": {
    "eventsDivisionsRemoveOneConfirmation": "This will remove %{divisionName} permanently. Continue?",
    "eventsDivisionsRemoveOneSuccess": "%{divisionName} was removed from the database"
  },
  "no": {
    "eventsDivisionsRemoveOneConfirmation": "Dette vil fjerne %{divisionName} permanent. Fortsette?",
    "eventsDivisionsRemoveOneSuccess": "%{divisionName} ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="">
    <events-divisions-scheduler
      @eventsDivisionsCreateDialogOpen="eventsDivisionsCreateDialogOpen"
      @eventsDivisionsEditDialogOpen="eventsDivisionsEditDialogOpen"
      @eventsDivisionsRemoveOne="eventsDivisionsRemoveOne"
      @eventsContestantsEditDialogOpen="eventsContestantsEditDialogOpen"
      @eventsContestantsCreateDialogOpen="eventsContestantsCreateDialogOpen"
    />

    <events-contestants-edit-dialog
      :shown.sync="eventsContestantsEditDialogShow"
      :events-contestant="eventsContestantsEditDialogContestant"
    />

    <events-divisions-create-dialog
      :shown.sync="eventsDivisionsCreateDialogShown"
      :event="event"
    />

    <events-divisions-edit-dialog
      :shown.sync="eventsDivisionsEditDialogShown"
      :division="eventsDivisionsEditDialogDivision"
    />

    <action-dialog :shown.sync="eventsContestantsCreateDialogShow">
      <template v-slot:title>
        Add contestant
        <!-- {{ $t("dialogTitle") }} -->
      </template>

      <template v-slot:actions>
        <v-btn text>
          {{ $t("save") }}
        </v-btn>
      </template>

      <div>
        add contestant.. {{ eventsContestantsCreateDialogShowTimeAndStand.time }} / {{ eventsContestantsCreateDialogShowTimeAndStand.stand }}
      </div>
    </action-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import EventsDivisionsCreateDialog from "./divisions/EventsDivisionsCreateDialog.vue"
import EventsDivisionsEditDialog from "./divisions/EventsDivisionsEditDialog.vue"
import EventsDivisionsScheduler from "./divisions/EventsDivisionsScheduler.vue"
import EventsContestantsEditDialog from "./contestants/EventsContestantsEditDialog.vue"

export default Vue.extend({
  name: "EventsViewTabsDivisions",

  components: {
    ActionDialog,
    EventsDivisionsCreateDialog,
    EventsDivisionsEditDialog,
    EventsDivisionsScheduler,
    EventsContestantsEditDialog
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsDivisionsCreateDialogShown: false,
    eventsDivisionsEditDialogShown: false,
    eventsDivisionsEditDialogDivision: {},
    eventsContestantsEditDialogShow: false,
    eventsContestantsEditDialogContestant: {},
    eventsContestantsCreateDialogShow: false,
    eventsContestantsCreateDialogShowTimeAndStand: {}
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateRemoveOneIsLoading: "removeOneIsLoading"
    })
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsRemoveOne: "removeOne"
    }),

    eventsDivisionsCreateDialogOpen(): void {
      this.eventsDivisionsCreateDialogShown = true
    },

    eventsDivisionsEditDialogOpen(division): void {
      this.eventsDivisionsEditDialogDivision = division
      this.eventsDivisionsEditDialogShown = true
    },

    eventsContestantsEditDialogOpen(contestant): void {
      this.eventsContestantsEditDialogShow = true
      this.eventsContestantsEditDialogContestant = contestant
    },

    eventsContestantsCreateDialogOpen({ time, stand }): void {
      this.eventsContestantsCreateDialogShow = true
      this.eventsContestantsCreateDialogShowTimeAndStand = { time, stand }
    },

    async eventsDivisionsRemoveOne(division): Promise<void> {
      try {
        await this.$confirm(
          this.$t("eventsDivisionsRemoveOneConfirmation", {
            divisionName: division.name
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.eventsDivisionsActionsRemoveOne(division)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsDivisionsRemoveOneSuccess", {
            divisionName: division.name
          })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    }
  }
})
</script>
