<i18n>
{
  "en": {
    "eventsContestantsActionsRemoveOneConfirmation": "This will remove %{clubMemberFullName} from the event. Continue?",
    "eventsContestantsActionsRemoveOneSuccess": "%{clubMemberFullName} was removed from the event",
    "eventsContestantsActionsRemoveManyConfirmation": "This will remove %{contestantsCount} participants from the event. Continue?",
    "eventsContestantsActionsRemoveManySuccess": "%{contestantsCount} participants was removed from the event"
  },
  "no": {
    "eventsContestantsActionsRemoveOneConfirmation": "Dette vil fjerne %{clubMemberFullName} fra stevnet. Fortsette?",
    "eventsContestantsActionsRemoveOneSuccess": "%{clubMemberFullName} ble fjernet fra stevnet",
    "eventsContestantsActionsRemoveManyConfirmation": "Dette vil fjerne %{contestantsCount} deltakere fra stevnet. Fortsette?",
    "eventsContestantsActionsRemoveManySuccess": "%{contestantsCount} deltakere ble fjernet fra stevnet"
  }
}
</i18n>

<template>
  <div class="screen-wrapper pt-3">
    <events-contestants-list-table
      :event="event"
      @eventsContestantsManageDialogOpen="eventsContestantsManageDialogOpen"
      @eventsContestantsEditDialogOpen="eventsContestantsEditDialogOpen"
      @eventsContestantsRemoveOne="eventsContestantsRemoveOne"
      @eventsContestantsRemoveMany="eventsContestantsRemoveMany"
    />

    <events-contestants-manager-dialog
      :shown.sync="eventsContestantsManageDialogShow"
      :event="event"
      @clubsMembersCreateDialogOpen="clubsMembersCreateDialogOpen"
    />

    <events-contestants-edit-dialog
      :shown.sync="eventsContestantsEditDialogShow"
      :events-contestant="eventsContestantsEditContestant"
    />

    <clubs-members-create-dialog
      :shown.sync="clubsMembersCreateDialogShow"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import EventsContestantsListTable from "@/components/EventsContestantsListTable.vue"
import EventsContestantsManagerDialog from "@/components/EventsContestantsManagerDialog.vue"
import EventsContestantsEditDialog from "@/components/EventsContestantsEditDialog.vue"
import ClubsMembersCreateDialog from "@/components/ClubsMembersCreateDialog.vue"

export default Vue.extend({
  name: "EventsViewTabsContestants",

  components: {
    EventsContestantsListTable,
    EventsContestantsManagerDialog,
    EventsContestantsEditDialog,
    ClubsMembersCreateDialog
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsContestantsManageDialogShow: false,
    eventsContestantsEditDialogShow: false,
    eventsContestantsEditContestant: {},
    clubsMembersCreateDialogShow: false
  }),

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsContestantsStateRemoveManyIsLoading: "removeManyIsLoading"
    })
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsRemoveOne: "removeOne",
      eventsContestantsActionsRemoveMany: "removeMany"
    }),

    clubsMembersCreateDialogOpen(): void {
      this.clubsMembersCreateDialogShow = true
    },

    eventsContestantsManageDialogOpen(): void {
      this.eventsContestantsManageDialogShow = true
    },

    eventsContestantsEditDialogOpen(contestant): void {
      this.eventsContestantsEditDialogShow = true
      this.eventsContestantsEditContestant = contestant
    },

    async eventsContestantsRemoveOne(contestant): Promise<void> {
      const fullName = `${contestant.clubMember.firstName} ${contestant.clubMember.lastName}`

      try {
        await this.$confirm(
          this.$t("eventsContestantsActionsRemoveOneConfirmation", {
            clubMemberFullName: fullName
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
        await this.eventsContestantsActionsRemoveOne(contestant)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsContestantsActionsRemoveOneSuccess", {
            clubMemberFullName: fullName
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

    async eventsContestantsRemoveMany(contestants): Promise<void> {
      const count = contestants.length
      try {
        await this.$confirm(
          this.$t("eventsContestantsActionsRemoveManyConfirmation", {
            contestantsCount: count
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
        await this.eventsContestantsActionsRemoveMany(contestants)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsContestantsActionsRemoveManySuccess", {
            contestantsCount: count
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
