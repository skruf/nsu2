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
  <div class="">
    <events-contestants-list-table
      :event="event"
      @eventsContestantsCreateDialogOpen="eventsContestantsCreateDialogOpen"
      @eventsContestantsEditDialogOpen="eventsContestantsEditDialogOpen"
      @eventsContestantsRemoveOne="eventsContestantsRemoveOne"
      @eventsContestantsRemoveMany="eventsContestantsRemoveMany"
    />

    <events-contestants-create-dialog
      :shown.sync="eventsContestantsCreateDialogShow"
      :event="event"
      @clubsMembersCreateDialogOpen="clubsMembersCreateDialogOpen"
      @weaponsCreateDialogOpen="weaponsCreateDialogOpen"
    />

    <events-contestants-edit-dialog
      :shown.sync="eventsContestantsEditDialogShow"
      :events-contestant="eventsContestantsEditContestant"
    />

    <clubs-members-create-dialog
      :shown.sync="clubsMembersCreateDialogShown"
    />

    <weapons-create-dialog
      :shown.sync="weaponsCreateDialogShown"
    />

    <confirm ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import EventsContestantsListTable
  from "./contestants/EventsContestantsListTable.vue"
import EventsContestantsCreateDialog
  from "./contestants/EventsContestantsCreateDialog.vue"
import EventsContestantsEditDialog
  from "./contestants/EventsContestantsEditDialog.vue"
import ClubsMembersCreateDialog
  from "@/clubs/members/ClubsMembersCreateDialog.vue"
import WeaponsCreateDialog
  from "@/weapons/WeaponsCreateDialog.vue"
import Confirm
  from "@/components/Confirm.vue"

export default Vue.extend({
  name: "EventsViewTabsContestants",

  components: {
    EventsContestantsListTable,
    EventsContestantsCreateDialog,
    EventsContestantsEditDialog,
    ClubsMembersCreateDialog,
    WeaponsCreateDialog,
    Confirm
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    clubsMembersCreateDialogShown: false,
    weaponsCreateDialogShown: false,
    eventsContestantsCreateDialogShow: false,
    eventsContestantsEditDialogShow: false,
    eventsContestantsEditContestant: {}
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
      this.clubsMembersCreateDialogShown = true
    },

    weaponsCreateDialogOpen(): void {
      this.weaponsCreateDialogShown = true
    },

    eventsContestantsCreateDialogOpen(): void {
      this.eventsContestantsCreateDialogShow = true
    },

    eventsContestantsEditDialogOpen(contestant): void {
      this.eventsContestantsEditDialogShow = true
      this.eventsContestantsEditContestant = contestant
    },

    async eventsContestantsRemoveOne(contestant): Promise<void> {
      const fullName = `${contestant.clubMember.firstName} ${contestant.clubMember.lastName}`

      if(!await this.$refs.confirm.dangerous(
        this.$t("eventsContestantsActionsRemoveOneConfirmation", {
          clubMemberFullName: fullName
        })
      )) return

      try {
        await this.eventsContestantsActionsRemoveOne(contestant)
        this.$success(this.$t("eventsContestantsActionsRemoveOneSuccess", {
          clubMemberFullName: fullName
        }))
      } catch(e) {
        this.$error(e.message)
      }
    },

    async eventsContestantsRemoveMany(contestants): Promise<void> {
      const count = contestants.length

      if(!await this.$refs.confirm.dangerous(
        this.$t("eventsContestantsActionsRemoveManyConfirmation", {
          contestantsCount: count
        })
      )) return

      try {
        await this.eventsContestantsActionsRemoveMany(contestants)
        this.$success(this.$t("eventsContestantsActionsRemoveManySuccess", {
          contestantsCount: count
        }))
      } catch(e) {
        this.$error(e.message)
      }
    }
  }
})
</script>
