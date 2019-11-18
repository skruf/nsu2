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
  <el-container
    id="clubs-view-screen"
    v-loading="clubsIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/clubs',
          label: this.$t('breadcrumb1Label')
        }, {
          to: `/clubs/${clubsStateSelected.id}`,
          label: clubsStateSelected.name
        }]"
      />

      <div class="page-meta">
        <div class="page-titles flex">
          <div>
            <h1 class="h1">
              {{ clubsStateSelected.name }} ({{ clubsStateSelected.shortName }})
            </h1>

            <small class="small page-subtitles">
              <span
                v-if="clubsStateSelected.address"
                class="page-subtitles_part"
              >
                {{ clubsStateSelected.address }}
              </span>

              <span
                v-if="clubsStateSelected.area"
                class="page-subtitles_part"
              >
                {{ clubsStateSelected.area }}
              </span>

              <span
                v-if="clubsStateSelected.country"
                class="page-subtitles_part"
              >
                {{ clubsStateSelected.country }}
              </span>
            </small>
          </div>

          <div class="page-controls ml-2">
            <el-dropdown
              class="mt-1"
              trigger="click"
              @command="dispatchActions"
            >
              <el-button type="text">
                <i class="el-icon-arrow-down el-icon-more" />
              </el-button>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="clubsStateSelected.website"
                  :command="{
                    handler: 'clubsOpenWebsite',
                    payload: clubsStateSelected.website
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("clubsOpenWebsite") }}
                </el-dropdown-item>

                <el-dropdown-item
                  :command="{
                    handler: 'clubsEditOpenDialog'
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editClub") }}
                </el-dropdown-item>

                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'clubsRemoveOne',
                    payload: clubsStateSelected
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeClub") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div class="page-info">
          <div
            v-if="clubsStateSelected.emailAddress"
            class="page-info_item"
          >
            <h5 class="h5">
              {{ clubsStateSelected.emailAddress }}
            </h5>
            <small class="small">
              {{ $t("email") }}
            </small>
          </div>

          <div
            v-if="clubsStateSelected.phoneNumber"
            class="page-info_item"
          >
            <h5 class="h5">
              {{ clubsStateSelected.phoneNumber }}
            </h5>
            <small class="small">
              {{ $t("phoneNumber") }}
            </small>
          </div>

          <div
            v-if="clubsStateSelected.leader"
            class="page-info_item"
          >
            <h5 class="h5">
              {{ clubsStateSelected.leader }}
            </h5>
            <small class="small">
              {{ $t("leader") }}
            </small>
          </div>

          <div
            v-if="clubsStateSelected.range"
            class="page-info_item"
          >
            <h5 class="h5">
              {{ clubsStateSelected.range.name }}
              ({{ clubsStateSelected.range.area }})
            </h5>
            <small class="small">
              {{ $t("range") }}
            </small>
          </div>
        </div>
      </div>
    </el-header>

    <el-main
      v-loading="clubsMembersRemoveIsLoading"
      class="content"
    >
      <clubs-members-list-table
        v-if="!clubsStateSelectedIsLoading"
        :club-id="clubsStateSelected.id"
        @clubsMembersOpenCreateDialog="clubsMembersOpenCreateDialog"
        @clubsMembersOpenEditDialog="clubsMembersOpenEditDialog"
        @clubsMembersRemoveOne="clubsMembersRemoveOne"
        @clubsMembersRemoveMany="clubsMembersRemoveMany"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        data-testid="clubsMembersOpenCreateDialogButton"
        @click="clubsMembersOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" />
        {{ $t("clubsMembersOpenCreateDialog") }}
      </el-button>
    </el-footer>

    <clubs-edit-dialog
      :shown.sync="clubsEditShowDialog"
      :club="clubsStateSelected"
    />

    <clubs-members-create-dialog
      :shown.sync="clubsMembersShowCreateDialog"
      :club="clubsStateSelected"
    />

    <clubs-members-edit-dialog
      :shown.sync="clubsMembersShowEditDialog"
      :club="clubsStateSelected"
      :club-member="clubsMembersEditItem"
    />
  </el-container>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { openExternalUrlUtil } from "@/utils"
import BreadcrumbBar from "@/components/BreadcrumbBar.vue"
import ClubsEditDialog from "@/containers/ClubsEditDialog.vue"
import ClubsMembersListTable from "@/containers/ClubsMembersListTable.vue"
import ClubsMembersCreateDialog from "@/containers/ClubsMembersCreateDialog.vue"
import ClubsMembersEditDialog from "@/containers/ClubsMembersEditDialog.vue"

export default Vue.extend({
  name: "ClubsViewScreen",

  components: {
    BreadcrumbBar,
    ClubsEditDialog,
    ClubsMembersListTable,
    ClubsMembersCreateDialog,
    ClubsMembersEditDialog
  },

  data: () => ({
    clubsMembersShowCreateDialog: false,
    clubsEditShowDialog: false,
    clubsMembersShowEditDialog: false,
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
    clubsIsLoading() {
      return (
        this.clubsStateSelectedIsLoading ||
        this.clubsStateRemoveOneIsLoading
      )
    },
    clubsMembersRemoveIsLoading() {
      return (
        this.clubsMembersRemoveOneIsLoading ||
        this.clubsMembersRemoveManyIsLoading
      )
    }
  },

  async created() {
    await this.clubsActionsSelect({ id: this.$route.params.clubId })
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

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    clubsEditOpenDialog() {
      this.clubsEditShowDialog = true
    },

    clubsMembersOpenCreateDialog() {
      this.clubsMembersShowCreateDialog = true
    },

    clubsMembersOpenEditDialog(member) {
      this.clubsMembersShowEditDialog = true
      this.clubsMembersEditItem = member
    },

    clubsOpenWebsite(url) {
      openExternalUrlUtil(url)
    },

    async clubsRemoveOne(club) {
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

    async clubsMembersRemoveOne(clubMember) {
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

    async clubsMembersRemoveMany(clubMembers) {
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
    }
  }
})
</script>
