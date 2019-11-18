<i18n>
{
  "en": {
    "breadcrumb1Label": "Ranges",
    "breadcrumb2Label": "All",
    "screenTitle": "Ranges",
    "rangesOpenCreateDialogButton": "Create range",
    "rangesRemoveOneConfirmation": "This will remove %{rangeName} permanently. Continue?",
    "rangesActionsRemoveOneSuccess": "%{rangeName} was removed from the database",
    "rangesRemoveManyConfirmation": "This will remove %{rangesCount} ranges permanently. Continue?",
    "rangesActionsRemoveManySuccess": "%{rangesCount} ranges were removed from the database"
  },
  "no": {
    "breadcrumb1Label": "Skyttebaner",
    "breadcrumb2Label": "Alle",
    "screenTitle": "Skyttebaner",
    "rangesOpenCreateDialogButton": "Opprett skyttebane",
    "rangesRemoveOneConfirmation": "Dette vil fjerne %{rangeName} permanent. Fortsette?",
    "rangesActionsRemoveOneSuccess": "%{rangeName} ble fjernet fra databasen",
    "rangesRemoveManyConfirmation": "Dette vil fjerne %{rangesCount} skyttebaner permanent. Fortsette?",
    "rangesActionsRemoveManySuccess": "%{rangesCount} skyttebaner ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <el-container
    id="ranges-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/ranges', label: $t('breadcrumb1Label') },
          { to: '', label: $t('breadcrumb2Label') }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t('screenTitle') }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <ranges-list-table
        @rangesOpenCreateDialog="rangesOpenCreateDialog"
        @rangesOpenEditDialog="rangesOpenEditDialog"
        @rangesRemoveOne="rangesRemoveOne"
        @rangesRemoveMany="rangesRemoveMany"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        data-testid="rangesOpenCreateDialogButton"
        @click="rangesOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> {{ $t("rangesOpenCreateDialogButton") }}
      </el-button>
    </el-footer>

    <ranges-create-dialog
      :shown.sync="rangesShowCreateDialog"
    />

    <ranges-edit-dialog
      :shown.sync="rangesEditShowDialog"
      :range="rangesEditItem"
    />
  </el-container>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar.vue"
import RangesListTable from "@/containers/RangesListTable.vue"
import RangesCreateDialog from "@/containers/RangesCreateDialog.vue"
import RangesEditDialog from "@/containers/RangesEditDialog.vue"

export default Vue.extend({
  name: "RangesListScreen",

  components: {
    BreadcrumbBar,
    RangesListTable,
    RangesCreateDialog,
    RangesEditDialog
  },

  data: () => ({
    rangesShowCreateDialog: false,
    rangesEditShowDialog: false,
    rangesEditItem: {}
  }),

  methods: {
    ...mapActions("ranges", {
      rangesActionsRemoveOne: "removeOne",
      rangesActionsRemoveMany: "removeMany"
    }),

    rangesOpenCreateDialog() {
      this.rangesShowCreateDialog = true
    },

    rangesOpenEditDialog(item) {
      this.rangesEditShowDialog = true
      this.rangesEditItem = item
    },

    async rangesRemoveOne(range) {
      try {
        await this.$confirm(
          this.$t("rangesRemoveOneConfirmation", { rangeName: range.name }),
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
        await this.rangesActionsRemoveOne(range)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("rangesActionsRemoveOneSuccess", {
            rangeName: range.name
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

    async rangesRemoveMany() {
      const count = this.rangesSelection.length

      try {
        await this.$confirm(
          this.$t("rangesRemoveManyConfirmation", {
            rangesCount: count
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
        await this.rangesActionsRemoveMany(this.rangesSelection)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("rangesActionsRemoveManySuccess", {
            rangesCount: count
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
