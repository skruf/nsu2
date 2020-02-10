<i18n>
{
  "en": {
    "breadcrumbRangesLabel": "Ranges",
    "breadcrumbAllLabel": "All",
    "screenTitle": "Ranges",
    "rangesCreateDialogOpenButton": "Create range",
    "rangesRemoveOneConfirmation": "This will remove %{rangeName} permanently. Continue?",
    "rangesActionsRemoveOneSuccess": "%{rangeName} was removed from the database",
    "rangesRemoveManyConfirmation": "This will remove %{rangesCount} ranges permanently. Continue?",
    "rangesActionsRemoveManySuccess": "%{rangesCount} ranges were removed from the database"
  },
  "no": {
    "breadcrumbRangesLabel": "Skyttebaner",
    "breadcrumbAllLabel": "Alle",
    "screenTitle": "Skyttebaner",
    "rangesCreateDialogOpenButton": "Opprett skyttebane",
    "rangesRemoveOneConfirmation": "Dette vil fjerne %{rangeName} permanent. Fortsette?",
    "rangesActionsRemoveOneSuccess": "%{rangeName} ble fjernet fra databasen",
    "rangesRemoveManyConfirmation": "Dette vil fjerne %{rangesCount} skyttebaner permanent. Fortsette?",
    "rangesActionsRemoveManySuccess": "%{rangesCount} skyttebaner ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="screen">
    <v-app-bar
      color="primary"
      class="screen-bar"
      dark
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

    <div class="screen-wrapper">
      <v-breadcrumbs
        :items="[
          { to: '/ranges', text: $t('breadcrumbRangesLabel') },
          { to: '', text: $t('breadcrumbAllLabel') }
        ]"
      />

      <div v-loading="rangesRemoveIsLoading">
        <ranges-list-table
          @rangesCreateDialogOpen="rangesCreateDialogOpen"
          @rangesEditDialogOpen="rangesEditDialogOpen"
          @rangesRemoveOne="rangesRemoveOne"
          @rangesRemoveMany="rangesRemoveMany"
        />
      </div>
    </div>

    <ranges-create-dialog
      :shown.sync="rangesCreateDialogShown"
    />

    <ranges-edit-dialog
      :shown.sync="rangesEditDialogShown"
      :range="rangesEditDialogRange"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import RangesListTable from "@/components/RangesListTable.vue"
import RangesCreateDialog from "@/components/RangesCreateDialog.vue"
import RangesEditDialog from "@/components/RangesEditDialog.vue"

export default Vue.extend({
  name: "RangesListScreen",

  components: {
    RangesListTable,
    RangesCreateDialog,
    RangesEditDialog
  },

  data: () => ({
    rangesCreateDialogShown: false,
    rangesEditDialogShown: false,
    rangesEditDialogRange: {}
  }),

  computed: {
    ...mapState("weapons", {
      weaponsStateRemoveOneIsLoading: "removeOneIsLoading",
      weaponsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    rangesRemoveIsLoading(): boolean {
      return (
        this.weaponsStateRemoveOneIsLoading ||
        this.weaponsStateRemoveManyIsLoading
      )
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsRemoveOne: "removeOne",
      rangesActionsRemoveMany: "removeMany"
    }),

    rangesCreateDialogOpen(): void {
      this.rangesCreateDialogShown = true
    },

    rangesEditDialogOpen(range): void {
      this.rangesEditDialogShown = true
      this.rangesEditDialogRange = range
    },

    async rangesRemoveOne(range): Promise<void> {
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

    async rangesRemoveMany(): Promise<void> {
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
