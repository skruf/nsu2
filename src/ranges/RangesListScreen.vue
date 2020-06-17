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
        @click="$print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="container">
      <ranges-list-table
        :ranges="rangesStateList"
        :loading="loading"
        @rangesCreateDialogOpen="rangesCreateDialogOpen"
        @rangesEditDialogOpen="rangesEditDialogOpen"
        @rangesRemoveOne="rangesRemoveOne"
        @rangesRemoveMany="rangesRemoveMany"
      />
    </div>

    <ranges-create-dialog
      :shown.sync="rangesCreateDialogShown"
    />

    <ranges-edit-dialog
      :shown.sync="rangesEditDialogShown"
      :range="rangesEditDialogRange"
    />

    <confirm ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import RangesListTable from "@/ranges/RangesListTable.vue"
import RangesCreateDialog from "@/ranges/RangesCreateDialog.vue"
import RangesEditDialog from "@/ranges/RangesEditDialog.vue"
import Confirm from "@/components/Confirm.vue"

export default Vue.extend({
  name: "RangesListScreen",

  components: {
    RangesListTable,
    RangesCreateDialog,
    RangesEditDialog,
    Confirm
  },

  data: () => ({
    rangesCreateDialogShown: false,
    rangesEditDialogShown: false,
    rangesEditDialogRange: {}
  }),

  computed: {
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list",
      rangesStateRemoveOneIsLoading: "removeOneIsLoading",
      rangesStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    loading(): boolean {
      return (
        this.rangesStateListIsLoading ||
        this.rangesStateRemoveOneIsLoading ||
        this.rangesStateRemoveManyIsLoading
      )
    }
  },

  created() {
    this.rangesActionsList()
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsList: "list",
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
      if(!await this.$refs.confirm.dangerous(
        this.$t("rangesRemoveOneConfirmation", {
          rangeName: range.name
        })
      )) return

      try {
        await this.rangesActionsRemoveOne(range)
        this.$success(this.$t("rangesActionsRemoveOneSuccess", {
          rangeName: range.name
        }))
      } catch(e) {
        this.$error(e.message)
      }
    },

    async rangesRemoveMany(): Promise<void> {
      const count = this.rangesSelection.length

      if(!await this.$refs.confirm.dangerous(
        this.$t("rangesRemoveManyConfirmation", {
          rangesCount: count
        })
      )) return

      try {
        await this.rangesActionsRemoveMany(this.rangesSelection)
        this.$success(this.$t("rangesActionsRemoveManySuccess", {
          rangesCount: count
        }))
      } catch(e) {
        this.$error(e.message)
      }
    }
  }
})
</script>
