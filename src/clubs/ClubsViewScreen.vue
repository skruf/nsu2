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
    "membersOpenCreateDialog": "Create member",
    "clubsRemoveOneConfirmation": "This will remove %{clubName} and its %{memberCount} members permanently. Continue?",
    "clubsActionsRemoveOneSuccess": "%{clubName} was removed from the database",
    "membersRemoveOneConfirmation": "This will remove %{fullName} from the club. Continue?",
    "membersActionsRemoveOne": "%{fullName} has been removed from the clubs database",
    "membersRemoveManyConfirmation": "This will remove %{clubMembersCount} members from the club. Continue?",
    "membersActionsRemoveManySuccess": "%{clubMembersCount} members has been removed from the clubs database"
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
    "membersOpenCreateDialog": "Opprett medlem",
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
        <div class="print:mb-2 print:text-2xl">
          {{ clubsStateSelected.name }} [{{ clubsStateSelected.shortName }}]
        </div>

        <data-grid v-if="!clubsStateSelectedIsLoading">
          <template
            v-if="clubsStateSelected.leaderFullName"
            slot="Leder"
          >
            {{ clubsStateSelected.leaderFullName }}
          </template>
          <template slot="Område">
            {{ clubsStateSelected.zipCode }}, {{ clubsStateSelected.area }}
          </template>
          <template
            v-if="clubsStateSelected.streetAddress"
            slot="Adresse"
          >
            {{ clubsStateSelected.streetAddress }}
          </template>
          <template
            v-if="clubsStateSelected.country"
            slot="Land"
          >
            {{ clubsStateSelected.country }}
          </template>
        </data-grid>
      </v-toolbar-title>

      <v-btn
        icon
        data-testid="eventsListPrintButton"
        @click="print"
      >
        <v-icon>print</v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            data-testid="clubsViewDropdown"
            icon
            v-bind="attrs"
            v-on="on"
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
            @click="openExternalUrl(clubsStateSelected.websiteUrl)"
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
            @click="clubsEditDialogOpen()"
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
            @click="clubsRemoveOne(clubsStateSelected)"
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
    </v-app-bar>

    <div class="container">
      <members-list-table
        :members="members"
        :loading="membersIsLoading"
        @createDialogOpen="membersCreateDialogOpen"
        @editDialogOpen="membersEditDialogOpen"
        @removeOne="membersRemoveOne"
        @removeMany="membersRemoveMany"
      />
    </div>

    <clubs-edit-dialog
      :shown.sync="clubsEditDialogShown"
      :club="clubsStateSelected"
    />

    <members-create-dialog
      :shown.sync="membersCreateDialogShown"
      :club="clubsStateSelected"
    />

    <members-edit-dialog
      :shown.sync="membersEditDialogShown"
      :club="clubsStateSelected"
      :member="membersEditItem"
    />

    <confirm ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState, mapGetters } from "vuex"
import DataGrid from "@/components/DataGrid.vue"
import ClubsEditDialog from "./ClubsEditDialog.vue"
import MembersListTable from "./members/ClubsMembersListTable.vue"
import MembersCreateDialog from "./members/ClubsMembersCreateDialog.vue"
import MembersEditDialog from "./members/ClubsMembersEditDialog.vue"
import Confirm from "@/components/Confirm.vue"

export default Vue.extend({
  name: "ClubsViewScreen",

  components: {
    DataGrid,
    ClubsEditDialog,
    MembersListTable,
    MembersCreateDialog,
    MembersEditDialog,
    Confirm
  },

  data: () => ({
    clubsEditDialogShown: false,
    membersCreateDialogShown: false,
    membersEditDialogShown: false,
    membersEditItem: {}
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateSelectedIsLoading: "selectedIsLoading",
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateSelected: "selected",
    }),
    ...mapState("clubs/members", {
      membersStateListIsLoading: "listIsLoading",
      membersStateList: "list",
      membersStateRemoveOneIsLoading: "removeOneIsLoading",
      membersStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    ...mapGetters("clubs/members", {
      getListByClubId: "listByClubId"
    }),
    members() {
      const clubId = this.$route.params.clubId
      return clubId
        ? this.getListByClubId(clubId)
        // ? this.membersStateList.filter((c) => c.clubId === clubId)
        : []
    },
    clubsIsLoading(): boolean {
      return (
        this.clubsStateSelectedIsLoading ||
        this.clubsStateRemoveOneIsLoading
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

  watch: {
    "$route.params.clubId": {
      immediate: true,
      handler(id): Promise<void> {
        this.clubsActionsSelect({ id })
        if(this.membersStateList.length) return
        this.membersActionsList()
      }
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsSelect: "select",
      clubsActionsRemoveOne: "removeOne"
    }),

    ...mapActions("clubs/members", {
      membersActionsList: "list",
      membersActionsRemoveOne: "removeOne",
      membersActionsRemoveMany: "removeMany"
    }),

    clubsEditDialogOpen(): void {
      this.clubsEditDialogShown = true
    },

    membersCreateDialogOpen(): void {
      this.membersCreateDialogShown = true
    },

    membersEditDialogOpen(member): void {
      this.membersEditDialogShown = true
      this.membersEditItem = member
    },

    async clubsRemoveOne(club): Promise<void> {
      if(!await this.$refs.confirm.dangerous(
        this.$t("clubsRemoveOneConfirmation", {
          clubName: club.name,
          memberCount: club.membersCount
        })
      )) return

      try {
        await this.clubsActionsRemoveOne(club)
        this.$success(this.$t("clubsActionsRemoveOneSuccess", {
          clubName: club.name,
          memberCount: club.membersCount
        }))
        this.$router.push("/clubs")
      } catch(e) {
        this.$error(e.message)
      }
    },

    async membersRemoveOne(clubMember): Promise<void> {
      const fullName = `${clubMember.firstName} ${clubMember.lastName}`

      if(!await this.$refs.confirm.dangerous(
        this.$t("membersRemoveOneConfirmation", {
          fullName
        })
      )) return

      try {
        await this.membersActionsRemoveOne(clubMember)
        this.$success(this.$t("membersActionsRemoveOne", {
          fullName
        }))
      } catch(e) {
        this.$error(e.message)
      }
    },

    async membersRemoveMany(clubMembers): Promise<void> {
      const clubMembersCount = clubMembers.length

      if(!await this.$refs.confirm.dangerous(
        this.$t("membersRemoveManyConfirmation", {
          clubMembersCount
        })
      )) return

      try {
        await this.membersActionsRemoveMany(clubMembers)
        this.$success(this.$t("membersActionsRemoveManySuccess", {
          clubMembersCount
        }))
      } catch(e) {
        this.$error(e.message)
      }
    }
  }
})
</script>
