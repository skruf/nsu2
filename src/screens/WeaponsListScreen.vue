<i18n>
{
  "en": {
    "breadcrumb1Label": "Weapons",
    "breadcrumb2Label": "All",
    "title": "Weapons",
    "weaponsOpenCreateDialogButton": "Create weapon",
    "weaponsRemoveOneConfirmation": "This will remove %{weaponsName} and participants who used this weapon permanently. Continue?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} was removed from the database",
    "weaponsRemoveManyConfirmation": "This will remove %{weaponsCount} weapons and participants who used these weapons permanently. Continue?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} weapons has been removed from the database"
  },
  "no": {
    "breadcrumb1Label": "Våpen",
    "breadcrumb2Label": "Alle",
    "title": "Våpen",
    "weaponsOpenCreateDialogButton": "Opprett våpen",
    "weaponsRemoveOneConfirmation": "Dette vil fjerne %{weaponsName} og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} ble fjernet fra databasen",
    "weaponsRemoveManyConfirmation": "Dette vil fjerne %{weaponsCount} våpen og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} våpen ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <el-container
    id="weapons-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/weapons', label: $t('breadcrumb1Label'),
        }, {
          to: '', label: $t('breadcrumb2Label')
        }]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t('title') }}
        </h1>
      </div>
    </el-header>

    <el-main
      v-loading="weaponsRemoveIsLoading"
      class="content"
    >
      <weapons-list-table
        @weaponsOpenCreateDialog="weaponsOpenCreateDialog"
        @weaponsOpenEditDialog="weaponsOpenEditDialog"
        @weaponsRemoveOne="weaponsRemoveOne"
        @weaponsRemoveMany="weaponsRemoveMany"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        data-testid="weaponsOpenCreateDialogButton"
        @click="weaponsOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> {{ $t("weaponsOpenCreateDialogButton") }}
      </el-button>
    </el-footer>

    <weapons-create-dialog
      :shown.sync="weaponsShowCreateDialog"
    />

    <weapons-edit-dialog
      :shown.sync="weaponsEditShowDialog"
      :weapon="weaponsEditItem"
    />
  </el-container>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar.vue"
import WeaponsListTable from "@/containers/WeaponsListTable.vue"
import WeaponsCreateDialog from "@/containers/WeaponsCreateDialog.vue"
import WeaponsEditDialog from "@/containers/WeaponsEditDialog.vue"

export default Vue.extend({
  name: "WeaponsListScreen",

  components: {
    BreadcrumbBar,
    WeaponsListTable,
    WeaponsCreateDialog,
    WeaponsEditDialog
  },

  data: () => ({
    weaponsShowCreateDialog: false,
    weaponsEditShowDialog: false,
    weaponsEditItem: {}
  }),

  computed: {
    ...mapState("weapons", {
      weaponsStateRemoveOneIsLoading: "removeOneIsLoading",
      weaponsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    weaponsRemoveIsLoading() {
      return (
        this.weaponsStateRemoveOneIsLoading ||
        this.weaponsStateRemoveManyIsLoading
      )
    }
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsRemoveOne: "removeOne",
      weaponsActionsRemoveMany: "removeMany",
    }),

    weaponsOpenCreateDialog() {
      this.weaponsShowCreateDialog = true
    },

    weaponsOpenEditDialog(weapon) {
      this.weaponsEditShowDialog = true
      this.weaponsEditItem = weapon
    },

    async weaponsRemoveOne(weapon) {
      try {
        await this.$confirm(
          this.$t("weaponsRemoveOneConfirmation", {
            weaponsName: weapon.name
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
        await this.weaponsActionsRemoveOne(weapon)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("weaponsActionsRemoveOneSuccess", {
            weaponsName: weapon.name
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

    async weaponsRemoveMany(weapons) {
      const count = weapons.length

      try {
        await this.$confirm(
          this.$t("weaponsRemoveManyConfirmation", {
            weaponsCount: count
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
        await this.weaponsActionsRemoveMany(weapons)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("weaponsActionsRemoveManySuccess", {
            weaponsCount: count
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
