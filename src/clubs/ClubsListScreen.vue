<i18n>
{
  "en": {
    "screenTitle": "Clubs",
    "breadcrumbLabel1": "Clubs",
    "breadcrumbLabel2": "All",
    "createClubButton": "Create club",
    "clubsRemoveOneConfirmation": "This will remove %{clubName} and its %{clubMemberCount} members. Continue?",
    "clubsRemoveOneSuccess": "%{clubName} and its %{clubMemberCount} members were removed from the database",
    "clubsRemoveManyConfirmation": "This will remove %{clubsCount} clubs and its %{clubMemberCount} members. Continue?",
    "clubsActionsRemoveManySuccess": "%{clubsCount} clubs and its %{clubMemberCount} were removed from the database",
    "clubsRemoveOneConfirmation": "This will remove %{clubName} and its %{memberCount} members permanently. Continue?",
    "clubsActionsRemoveOneSuccess": "%{clubName} was removed from the database",
    "membersRemoveOneConfirmation": "This will remove %{fullName} from the club. Continue?",
    "membersActionsRemoveOne": "%{fullName} has been removed from the clubs database",
    "membersRemoveManyConfirmation": "This will remove %{clubMembersCount} members from the club. Continue?",
    "membersActionsRemoveManySuccess": "%{clubMembersCount} members has been removed from the clubs database"
  },
  "no": {
    "screenTitle": "Klubber",
    "breadcrumbLabelClubs": "Klubber",
    "breadcrumbLabelAll": "Alle",
    "createClubButton": "Opprett klubb",
    "clubsRemoveOneConfirmation": "Dette vil slette %{clubName} og %{clubMemberCount} medlemmer. Fortsette?",
    "clubsRemoveOneSuccess": "%{clubName} og %{clubMemberCount} medlemmer ble fjernet fra databasen",
    "clubsRemoveManyConfirmation": "Dette vil fjerne %{clubsCount} klubber og %{clubMemberCount} medlemmer. Fortsette?",
    "clubsActionsRemoveManySuccess": "%{clubsCount} klubber og %{clubMemberCount} medlemmer ble fjernet fra databasen",
    "clubsRemoveOneConfirmation": "Dette vil fjerne %{clubName} og deres %{memberCount} medlemmer permanent. Fortsette?",
    "clubsActionsRemoveOneSuccess": "%{clubName} og deres %{members} ble fjernet fra databasen",
    "membersRemoveOneConfirmation": "Dette vil fjerne %{fullName} fra klubben. Fortsette?",
    "membersActionsRemoveOne": "%{fullName} ble fjernet fra klubbens database",
    "membersRemoveManyConfirmation": "Dette vil fjerne %{clubMembersCount} medlemmer fra klubben. Fortsette?",
    "membersActionsRemoveManySuccess": "%{clubMembersCount} medlemmer ble fjernet fra klubbens database"
  }
}
</i18n>

<template>
  <div class="screen">
    <v-app-bar
      class="screen-bar"
      height="auto"
      flat
    >
      <v-toolbar-title class="screen-title">
        {{ $t("screenTitle") }}
      </v-toolbar-title>

      <v-btn
        icon
        data-testid="eventsListPrintButton"
        @click="print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="tab-container">
      <v-tabs
        v-model="activeTab"
        background-color="transparent"
        color="primary"
        class="flex-initial"
      >
        <v-tab data-testid="eventsViewScreenTabsContestantsTab">
          Klubber
        </v-tab>

        <v-tab data-testid="eventsViewScreenTabsDivisionsTab">
          Medlemmer uten klubber
        </v-tab>
      </v-tabs>
    </div>

    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <div class="container">
          <clubs-list-table
            :clubs="clubsStateList"
            :loading="clubsIsLoading"
            @createDialogOpen="clubsCreateDialogOpen"
            @editDialogOpen="clubsEditDialogOpen"
            @removeOne="clubsRemoveOne"
            @removeMany="clubsRemoveMany"
          />
        </div>
      </v-tab-item>

      <v-tab-item>
        <div class="container">
          <members-list-table
            :members="membersGetListNoClub"
            :loading="membersIsLoading"
            @createDialogOpen="membersCreateDialogOpen"
            @editDialogOpen="membersEditDialogOpen"
            @removeOne="membersRemoveOne"
            @removeMany="membersRemoveMany"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>

    <clubs-create-dialog
      :shown.sync="clubsCreateDialogShow"
    />

    <clubs-edit-dialog
      :shown.sync="clubsEditDialogShow"
      :club="clubsEditDialogClub"
    />

    <members-create-dialog
      :shown.sync="membersCreateDialogShown"
    />

    <members-edit-dialog
      :shown.sync="membersEditDialogShown"
      :member="membersEditItem"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState, mapGetters } from "vuex"
import ClubsListTable from "./ClubsListTable.vue"
import ClubsCreateDialog from "./ClubsCreateDialog.vue"
import ClubsEditDialog from "./ClubsEditDialog.vue"
import MembersListTable
  from "./members/ClubsMembersListTable.vue"
import MembersCreateDialog
  from "./members/ClubsMembersCreateDialog.vue"
import MembersEditDialog
  from "./members/ClubsMembersEditDialog.vue"

export default Vue.extend({
  name: "ClubsListScreen",

  components: {
    ClubsListTable,
    ClubsCreateDialog,
    ClubsEditDialog,
    MembersListTable,
    MembersCreateDialog,
    MembersEditDialog
  },

  data: () => ({
    activeTab: 0,
    clubsCreateDialogShow: false,
    clubsEditDialogShow: false,
    clubsEditDialogClub: {},
    membersCreateDialogShown: false,
    membersEditDialogShown: false,
    membersEditItem: {}
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateList: "list",
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateRemoveManyIsLoading: "removeManyIsLoading",
    }),

    ...mapState("clubs/members", {
      membersStateListIsLoading: "listIsLoading",
      membersStateRemoveOneIsLoading: "removeOneIsLoading",
      membersStateRemoveManyIsLoading: "removeManyIsLoading"
    }),

    ...mapGetters("clubs/members", {
      membersGetListNoClub: "listNoClub"
    }),

    clubsIsLoading(): boolean {
      return (
        this.clubsStateListIsLoading ||
        this.clubsStateRemoveOneIsLoading ||
        this.clubsStateRemoveManyIsLoading
      )
    },

    membersIsLoading(): boolean {
      return (
        this.membersStateListIsLoading ||
        this.membersStateRemoveOneIsLoading ||
        this.membersStateRemoveManyIsLoading
      )
    }
  },

  created() {
    this.clubsActionsList()
    this.membersActionsList()
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsList: "list",
      clubsActionsRemoveOne: "removeOne",
      clubsActionsRemoveMany: "removeMany"
    }),

    ...mapActions("clubs/members", {
      membersActionsList: "list",
      membersActionsRemoveOne: "removeOne",
      membersActionsRemoveMany: "removeMany"
    }),

    clubsCreateDialogOpen(): void {
      this.clubsCreateDialogShow = true
    },

    clubsEditDialogOpen(club): void {
      this.clubsEditDialogShow = true
      this.clubsEditDialogClub = club
    },

    membersCreateDialogOpen(): void {
      this.membersCreateDialogShown = true
    },

    membersEditDialogOpen(member): void {
      this.membersEditItem = member
      this.membersEditDialogShown = true
    },

    async clubsRemoveOne(club): Promise<void> {
      try {
        await this.$confirm(
          this.$t("clubsRemoveOneConfirmation", {
            club: club.name,
            clubMemberCount: club.membersCount
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.clubsActionsRemoveOne(club)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("clubsRemoveOneSuccess", {
              clubName: club.name,
              clubMemberCount: club.membersCount
            })
          })
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      } catch(e) {}
    },

    async clubsRemoveMany(clubs): Promise<void> {
      const clubsCount = clubs.length
      const clubMemberCount = clubs.reduce(
        (total, { membersCount }) => total + membersCount, 0
      )

      try {
        await this.$confirm(
          this.$t("clubsRemoveManyConfirmation", {
            clubsCount,
            clubMemberCount
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
        await this.clubsActionsRemoveMany(clubs)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("clubsActionsRemoveManySuccess", {
            clubsCount,
            clubMemberCount
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

    async membersRemoveOne(clubMember): Promise<void> {
      const fullName = `${clubMember.firstName} ${clubMember.lastName}`

      try {
        await this.$confirm(
          this.$t("membersRemoveOneConfirmation", { fullName }),
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
        await this.membersActionsRemoveOne(clubMember)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("membersActionsRemoveOne", { fullName })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async membersRemoveMany(clubMembers): Promise<void> {
      const clubMembersCount = clubMembers.length

      try {
        await this.$confirm(
          this.$t("membersRemoveManyConfirmation", {
            clubMembersCount
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
        await this.membersActionsRemoveMany(clubMembers)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("membersActionsRemoveManySuccess", {
            clubMembersCount
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
