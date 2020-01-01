<i18n>
{
  "en": {
    "breadcrumb1Label": "Clubs",
    "editClub": "Edit club",
    "removeClub": "Remove club",
    "email": "Email",
    "leader": "Leader",
    "range": "Shooting Range",
    "phoneNumber": "Phone",
    "clubsOpenWebsite": "Open website",
    "clubsMembersOpenCreateDialog": "Create member",
    "clubsRemoveOneConfirmation": "This will remove %{clubName} and its %{memberCount} members permanently. Continue?",
    "clubsActionsRemoveOneSuccess": "%{clubName} was removed from the database",
    "clubsMembersRemoveOneConfirmation": "This will remove %{fullName} from the club. Continue?",
    "clubsMembersActionsRemoveOne": "%{fullName} has been removed from the clubs database",
    "clubsMembersRemoveManyConfirmation": "This will remove %{clubMembersCount} members from the club. Continue?",
    "clubsMembersActionsRemoveManySuccess": "%{clubMembersCount} members has been removed from the clubs database"
  },
  "no": {
    "breadcrumb1Label": "Klubber",
    "editClub": "Rediger klubb",
    "removeClub": "Fjern klubb",
    "email": "Epost",
    "leader": "Leder",
    "range": "Skyttebane",
    "phoneNumber": "Telefon",
    "clubsOpenWebsite": "Åpne nettside",
    "clubsMembersOpenCreateDialog": "Opprett medlem",
    "clubsRemoveOneConfirmation": "Dette vil fjerne %{clubName} og deres %{memberCount} medlemmer permanent. Fortsette?",
    "clubsActionsRemoveOneSuccess": "%{clubName} og deres %{members} ble fjernet fra databasen",
    "clubsMembersRemoveOneConfirmation": "Dette vil fjerne %{fullName} fra klubben. Fortsette?",
    "clubsMembersActionsRemoveOne": "%{fullName} ble fjernet fra klubbens database",
    "clubsMembersRemoveManyConfirmation": "Dette vil fjerne %{clubMembersCount} medlemmer fra klubben. Fortsette?",
    "clubsMembersActionsRemoveManySuccess": "%{clubMembersCount} medlemmer ble fjernet fra klubbens database"
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
      <v-toolbar-title class="flex items-center justify-between w-full">
        <div>
          {{ clubsStateSelected.name }}

          <v-menu>
            <template v-slot:activator="{ on: { click } }">
              <v-btn
                data-testid="clubsViewDropdown"
                small
                icon
                @click.stop="click"
              >
                <v-icon>
                  more_horiz
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                :disabled="clubsStateSelected.websiteUrl !== ''"
                data-testid="clubsViewDropdownOpenEditDialog"
                @click.stop="openExternalUrlUtil(clubsStateSelected.websiteUrl)"
              >
                <v-list-item-title class="flex items-center">
                  <v-icon>
                    link
                  </v-icon>

                  <span class="ml-2">
                    Webside
                  </span>
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                data-testid="clubsViewDropdownOpenEditDialog"
                @click.stop="clubsEditDialogOpen()"
              >
                <v-list-item-title class="flex items-center">
                  <v-icon>
                    edit
                  </v-icon>

                  <span class="ml-2">
                    {{ $t("edit") }}
                  </span>
                </v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item
                data-testid="clubsViewDropdownRemoveOne"
                @click.stop="clubsRemoveOne(clubsStateSelected)"
              >
                <v-list-item-title class="flex items-center">
                  <v-icon color="red">
                    delete_forever
                  </v-icon>

                  <span class="ml-2 red--text">
                    {{ $t("remove") }}
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <data-grid>
          <template slot="Leader">
            {{ clubsStateSelected.leaderFullName }}
          </template>
          <template slot="Area">
            {{ clubsStateSelected.area }}
          </template>
          <template slot="Address">
            {{ clubsStateSelected.streetAddress }}
          </template>
          <template slot="Land">
            {{ clubsStateSelected.country }}
          </template>
        </data-grid>
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon>
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <v-breadcrumbs
      :items="[
        { to: '/clubs', text: $t('breadcrumb1Label') },
        { to: `/clubs/${clubsStateSelected.id}`,
          text: clubsStateSelected.name }
      ]"
    />

    <clubs-members-list-table
      :club="clubsStateSelected"
      @clubsMembersCreateDialogOpen="clubsMembersCreateDialogOpen"
      @clubsMembersEditDialogOpen="clubsMembersEditDialogOpen"
      @clubsMembersRemoveOne="clubsMembersRemoveOne"
      @clubsMembersRemoveMany="clubsMembersRemoveMany"
    />

    <clubs-edit-dialog
      :shown.sync="clubsEditDialogShown"
      :club="clubsStateSelected"
    />

    <clubs-members-create-dialog
      :shown.sync="clubsMembersCreateDialogShown"
      :club="clubsStateSelected"
    />

    <clubs-members-edit-dialog
      :shown.sync="clubsMembersEditDialogShown"
      :club="clubsStateSelected"
      :club-member="clubsMembersEditItem"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { openExternalUrlUtil } from "@/utils"
import ClubsEditDialog from "@/components/ClubsEditDialog.vue"
import ClubsMembersListTable from "@/components/ClubsMembersListTable.vue"
import ClubsMembersCreateDialog from "@/components/ClubsMembersCreateDialog.vue"
import ClubsMembersEditDialog from "@/components/ClubsMembersEditDialog.vue"
import DataGrid from "@/components/DataGrid.vue"

export default Vue.extend({
  name: "ClubsViewScreen",

  components: {
    ClubsEditDialog,
    ClubsMembersListTable,
    ClubsMembersCreateDialog,
    ClubsMembersEditDialog,
    DataGrid
  },

  data: () => ({
    clubsMembersCreateDialogShown: false,
    clubsEditDialogShown: false,
    clubsMembersEditDialogShown: false,
    clubsMembersEditItem: {}
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateSelectedIsLoading: "selectedIsLoading",
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateSelected: "selected",
      clubsMembersRemoveOneIsLoading: "removeOneIsLoading",
      clubsMembersRemoveManyIsLoading: "removeManyIsLoading"
    }),
    clubsIsLoading(): boolean {
      return (
        this.clubsStateSelectedIsLoading ||
        this.clubsStateRemoveOneIsLoading
      )
    },
    clubsMembersRemoveIsLoading(): boolean {
      return (
        this.clubsMembersRemoveOneIsLoading ||
        this.clubsMembersRemoveManyIsLoading
      )
    }
  },

  created() {
    this.clubsActionsSelect({ id: this.$route.params.clubId })
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsSelect: "select",
      clubsActionsRemoveOne: "removeOne"
    }),

    ...mapActions("clubs/members", {
      clubsMembersActionsRemoveOne: "removeOne",
      clubsMembersActionsRemoveMany: "removeMany"
    }),

    clubsEditDialogOpen(): void {
      this.clubsEditDialogShown = true
    },

    clubsMembersCreateDialogOpen(): void {
      this.clubsMembersCreateDialogShown = true
    },

    clubsMembersEditDialogOpen(member): void {
      this.clubsMembersEditDialogShown = true
      this.clubsMembersEditItem = member
    },

    async clubsRemoveOne(club): Promise<void> {
      try {
        await this.$confirm(
          this.$t("clubsRemoveOneConfirmation", {
            clubName: club.name,
            memberCount: club.membersCount
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
        await this.clubsActionsRemoveOne(club)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("clubsActionsRemoveOneSuccess", {
            clubName: club.name,
            memberCount: club.membersCount
          })
        })
        this.$router.push("/clubs")
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async clubsMembersRemoveOne(clubMember): Promise<void> {
      const fullName = `${clubMember.firstName} ${clubMember.lastName}`

      try {
        await this.$confirm(
          this.$t("clubsMembersRemoveOneConfirmation", { fullName: fullName }),
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
        await this.clubsMembersActionsRemoveOne(clubMember)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("clubsMembersActionsRemoveOne", { fullName })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async clubsMembersRemoveMany(clubMembers): Promise<void> {
      const clubMembersCount = clubMembers.length

      try {
        await this.$confirm(
          this.$t("clubsMembersRemoveManyConfirmation", {
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
        await this.clubsMembersActionsRemoveMany(clubMembers)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("clubsMembersActionsRemoveManySuccess", {
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
    },

    openExternalUrlUtil
  }
})
</script>
