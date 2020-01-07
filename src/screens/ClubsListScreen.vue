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
    "clubsActionsRemoveManySuccess": "%{clubsCount} clubs and its %{clubMemberCount} were removed from the database"
  },
  "no": {
    "screenTitle": "Klubber",
    "breadcrumbLabelClubs": "Klubber",
    "breadcrumbLabelAll": "Alle",
    "createClubButton": "Opprett klubb",
    "clubsRemoveOneConfirmation": "Dette vil slette %{clubName} og %{clubMemberCount} medlemmer. Fortsette?",
    "clubsRemoveOneSuccess": "%{clubName} og %{clubMemberCount} medlemmer ble fjernet fra databasen",
    "clubsRemoveManyConfirmation": "Dette vil fjerne %{clubsCount} klubber og %{clubMemberCount} medlemmer. Fortsette?",
    "clubsActionsRemoveManySuccess": "%{clubsCount} klubber og %{clubMemberCount} medlemmer ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div>
    <v-app-bar
      color="primary"
      dark
      flat
    >
      <v-toolbar-title class="screen-title">
        {{ $t("screenTitle") }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        icon
        data-testid="eventsListPrintButton"
        @click="print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <v-breadcrumbs
      :items="[
        { to: '/clubs', text: $t('breadcrumbLabelClubs') },
        { to: '', text: $t('breadcrumbLabelAll') }
      ]"
    />

    <div v-loading="clubsRemoveIsLoading">
      <clubs-list-table
        @clubsCreateDialogOpen="clubsCreateDialogOpen"
        @clubsEditDialogOpen="clubsEditDialogOpen"
        @clubsRemoveOne="clubsRemoveOne"
        @clubsRemoveMany="clubsRemoveMany"
      />
    </div>

    <clubs-create-dialog
      :shown.sync="clubsCreateDialogShow"
    />

    <clubs-edit-dialog
      :shown.sync="clubsEditDialogShow"
      :club="clubsEditDialogClub"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ClubsListTable from "@/components/ClubsListTable.vue"
import ClubsCreateDialog from "@/components/ClubsCreateDialog.vue"
import ClubsEditDialog from "@/components/ClubsEditDialog.vue"

export default Vue.extend({
  name: "ClubsListScreen",

  components: {
    ClubsListTable,
    ClubsCreateDialog,
    ClubsEditDialog
  },

  data: () => ({
    clubsCreateDialogShow: false,
    clubsEditDialogShow: false,
    clubsEditDialogClub: {}
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateRemoveManyIsLoading: "removeManyIsLoading",
    }),
    clubsRemoveIsLoading(): boolean {
      return (
        this.clubsStateRemoveOneIsLoading ||
        this.clubsStateRemoveManyIsLoading
      )
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsRemoveOne: "removeOne",
      clubsActionsRemoveMany: "removeMany"
    }),

    clubsCreateDialogOpen(): void {
      this.clubsCreateDialogShow = true
    },

    clubsEditDialogOpen(club): void {
      this.clubsEditDialogShow = true
      this.clubsEditDialogClub = club
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
    }
  }
})
</script>
