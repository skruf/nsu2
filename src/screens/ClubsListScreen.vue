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
    "breadcrumbLabel1": "Klubber",
    "breadcrumbLabel2": "Alle",
    "createClubButton": "Opprett klubb",
    "clubsRemoveOneConfirmation": "Dette vil slette %{clubName} og %{clubMemberCount} medlemmer. Fortsette?",
    "clubsRemoveOneSuccess": "%{clubName} og %{clubMemberCount} medlemmer ble fjernet fra databasen",
    "clubsRemoveManyConfirmation": "Dette vil fjerne %{clubsCount} klubber og %{clubMemberCount} medlemmer. Fortsette?",
    "clubsActionsRemoveManySuccess": "%{clubsCount} klubber og %{clubMemberCount} medlemmer ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <el-container
    id="clubs-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/clubs', label: $t('breadcrumbLabel1') },
          { to: '', label: $t('breadcrumbLabel2') }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t("screenTitle") }}
        </h1>
      </div>
    </el-header>

    <el-main
      class="content"
      v-loading="clubsRemoveIsLoading"
    >
      <clubs-list-table
        @clubsOpenCreateDialog="clubsOpenCreateDialog"
        @clubsOpenEditDialog="clubsOpenEditDialog"
        @clubsRemoveOne="clubsRemoveOne"
        @clubsRemoveMany="clubsRemoveMany"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        data-testid="clubsOpenCreateDialogButton"
        @click="clubsOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> {{ $t("createClubButton") }}
      </el-button>
    </el-footer>

    <clubs-create-dialog
      :shown.sync="clubsShowCreateDialog"
    />

    <clubs-edit-dialog
      :shown.sync="clubsEditShowDialog"
      :club="clubsEditItem"
    />
  </el-container>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar.vue"
import ClubsListTable from "@/containers/ClubsListTable.vue"
import ClubsCreateDialog from "@/containers/ClubsCreateDialog.vue"
import ClubsEditDialog from "@/containers/ClubsEditDialog.vue"

export default Vue.extend({
  name: "ClubsListScreen",

  components: {
    BreadcrumbBar,
    ClubsListTable,
    ClubsCreateDialog,
    ClubsEditDialog
  },

  data: () => ({
    clubsShowCreateDialog: false,
    clubsEditShowDialog: false,
    clubsEditItem: {}
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateRemoveManyIsLoading: "removeManyIsLoading",
    }),
    clubsRemoveIsLoading() {
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

    clubsOpenCreateDialog() {
      this.clubsShowCreateDialog = true
    },

    clubsOpenEditDialog(club) {
      this.clubsEditShowDialog = true
      this.clubsEditItem = club
    },

    async clubsRemoveOne(club) {
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

    async clubsRemoveMany(clubs) {
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
