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
  <div>
    <!-- <div class="flex">
      <div class="">
        <events-divisions-contestants-list-table
          v-if="division"
          :division="division"
        />
      </div>

      <div class="w-64 border-l border-gray-300">
        <events-divisions-list-menu
          @eventsDivisionsCreateDialogOpen="eventsDivisionsCreateDialogOpen"
          @eventsDivisionsListMenuDivisionSelect="setSelectedDivision"
        />
      </div>
    </div> -->

    <events-divisions-list-table
      :event="event"
      @eventsDivisionsContestantsListDialogOpen="eventsDivisionsContestantsListDialogOpen"
      @eventsDivisionsCreateDialogOpen="eventsDivisionsCreateDialogOpen"
      @eventsDivisionsEditDialogOpen="eventsDivisionsEditDialogOpen"
      @eventsDivisionsRemoveOne="eventsDivisionsRemoveOne"
      @eventsDivisionsRemoveMany="eventsDivisionsRemoveMany"
    />

    <events-divisions-contestants-list-dialog
      :shown.sync="eventsDivisionsContestantsListDialogShown"
      :division="eventsDivisionsContestantsListDialogDivision"
      @eventsContestantsEditDialogOpen="eventsContestantsEditDialogOpen"
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

    <!--
    <events-divisions-assignment-dialog
      v-if="division"
      :shown.sync="eventsDivisionsAssignmentDialogShown"
      :division="division"
    />
    -->

    <!-- <events-contestants-manager-dialog
      v-if="!eventsStateSelectedIsLoading"
      :shown.sync="eventsContestantsShowManageDialog"
      :event="eventsStateSelected"
      @clubsMembersOpenCreateDialog="clubsMembersOpenCreateDialog"
    /> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import EventsDivisionsListTable from "@/components/EventsDivisionsListTable.vue"
import EventsDivisionsCreateDialog from "@/components/EventsDivisionsCreateDialog.vue"
import EventsDivisionsEditDialog from "@/components/EventsDivisionsEditDialog.vue"
import EventsDivisionsContestantsListDialog from "@/components/EventsDivisionsContestantsListDialog.vue"
import EventsContestantsEditDialog from "@/components/EventsContestantsEditDialog.vue"

// import EventsDivisionsListMenu from "@/components/EventsDivisionsListMenu.vue"
// import EventsDivisionsContestantsListTable from "@/components/EventsDivisionsContestantsListTable.vue"

export default Vue.extend({
  name: "EventsViewTabsDivisions",

  components: {
    EventsDivisionsListTable,
    EventsDivisionsCreateDialog,
    EventsDivisionsEditDialog,
    EventsDivisionsContestantsListDialog,
    EventsContestantsEditDialog
    // EventsDivisionsListMenu,
    // EventsDivisionsContestantsListTable
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsDivisionsCreateDialogShown: false,
    eventsDivisionsEditDialogShown: false,
    eventsDivisionsEditDialogDivision: {},
    eventsDivisionsContestantsListDialogShown: false,
    eventsDivisionsContestantsListDialogDivision: {},
    eventsContestantsEditDialogShow: false,
    eventsContestantsEditDialogContestant: {}
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsDivisionsStateRemoveManyIsLoading: "removeManyIsLoading"
    })
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsRemoveOne: "removeOne",
      eventsDivisionsActionsRemoveMany: "removeMany"
    }),

    eventsDivisionsCreateDialogOpen(): void {
      this.eventsDivisionsCreateDialogShown = true
    },

    eventsDivisionsEditDialogOpen(division): void {
      this.eventsDivisionsEditDialogDivision = division
      this.eventsDivisionsEditDialogShown = true
    },

    eventsDivisionsContestantsListDialogOpen(division): void {
      this.eventsDivisionsContestantsListDialogShown = true
      this.eventsDivisionsContestantsListDialogDivision = division
    },

    eventsContestantsEditDialogOpen(contestant): void {
      this.eventsContestantsEditDialogShow = true
      this.eventsContestantsEditDialogContestant = contestant
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
    },

    async eventsDivisionsRemoveMany(divisions): Promise<void> {
      console.log(divisions)
    },

    // eventsDivisionsAssignmentDialogOpen() {
    //   this.eventsDivisionsAssignmentDialogShown = true
    // },

    // setSelectedDivision(division) {
    //   this.division = division
    // },
  }
})
</script>
