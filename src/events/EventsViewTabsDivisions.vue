<i18n>
{
  "en": {
    "eventsDivisionsRemoveOneConfirmation": "This will remove %{day} %{time} - %{distance} meters permanently. Continue?",
    "eventsDivisionsRemoveOneSuccess": "%{day} %{time} - %{distance} meters was removed from the database"
  },
  "no": {
    "eventsDivisionsRemoveOneConfirmation": "Dette vil fjerne %{day} %{time} - %{distance} meter permanent. Fortsette?",
    "eventsDivisionsRemoveOneSuccess": "%{day} %{time} - %{distance} meter ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div>
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

    <!-- <action-dialog :shown.sync="eventsContestantsCreateDialogShow">
      <template v-slot:title>
        Add contestant
      </template>

      <template v-slot:actions>
        <v-btn text>
          {{ $t("save") }}
        </v-btn>
      </template>

      <div>
        add contestant.. {{ eventsContestantsCreateDialogShowTimeAndStand.time }} / {{ eventsContestantsCreateDialogShowTimeAndStand.stand }}
      </div>
    </action-dialog> -->

    <confirm ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
// import ActionDialog
//   from "@/components/ActionDialog.vue"
import EventsDivisionsCreateDialog
  from "./divisions/EventsDivisionsCreateDialog.vue"
import EventsDivisionsEditDialog
  from "./divisions/EventsDivisionsEditDialog.vue"
import EventsDivisionsScheduler
  from "./divisions/EventsDivisionsScheduler.vue"
import EventsContestantsEditDialog
  from "./contestants/EventsContestantsEditDialog.vue"
import Confirm
  from "@/components/Confirm.vue"

export default Vue.extend({
  name: "EventsViewTabsDivisions",

  components: {
    // ActionDialog,
    EventsDivisionsCreateDialog,
    EventsDivisionsEditDialog,
    EventsDivisionsScheduler,
    EventsContestantsEditDialog,
    Confirm
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
      const texts = {
        day: division.day,
        time: division.time,
        distance: division.distance
      }

      if(!await this.$refs.confirm.dangerous(
        this.$t("eventsDivisionsRemoveOneConfirmation", texts)
      )) return

      try {
        await this.eventsDivisionsActionsRemoveOne(division)
        this.$success(this.$t("eventsDivisionsRemoveOneSuccess", texts))
      } catch(e) {
        this.$error(e.message)
      }
    }
  }
})
</script>
