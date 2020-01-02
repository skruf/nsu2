<i18n>
{
  "en": {
    "breadcrumbEventsCategoriesLabel": "Categories",
    "breadcrumbAllLabel": "All",
    "screenTitle": "eventsCategories",
    "eventsCategoriesRemoveOneConfirmation": "This will remove %{eventsCategoryName} and events that used this category permanently. Continue?",
    "eventsCategoriesActionsRemoveOneSuccess": "%{eventsCategoryName} was removed from the database",
    "eventsCategoriesRemoveManyConfirmation": "This will remove %{eventsCategoriesCount} categories and events that used these categories permanently. Continue?",
    "eventsCategoriesActionsRemoveManySuccess": "%{eventsCategoriesCount} eventsCategories has been removed from the database"
  },
  "no": {
    "breadcrumbEventsCategoriesLabel": "Kategorier",
    "breadcrumbAllLabel": "Alle",
    "screenTitle": "Kategori",
    "eventsCategoriesRemoveOneConfirmation": "Dette vil fjerne %{eventsCategoryName} og stevner som brukte denne kategorien permanent. Fortsette?",
    "eventsCategoriesActionsRemoveOneSuccess": "%{eventsCategoryName} ble fjernet fra databasen",
    "eventsCategoriesRemoveManyConfirmation": "Dette vil fjerne %{eventsCategoriesCount} kategorier og stevner som brukte denne kategorien permanent. Fortsette?",
    "eventsCategoriesActionsRemoveManySuccess": "%{eventsCategoriesCount} kategorier ble fjernet fra databasen"
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
      <v-toolbar-title>
        {{ $t("screenTitle") }}
      </v-toolbar-title>
    </v-app-bar>

    <v-breadcrumbs
      :items="[
        { to: '/events/categories', text: $t('breadcrumbEventsCategoriesLabel') },
        { to: '', text: $t('breadcrumbAllLabel') }
      ]"
    />

    <div v-loading="eventsCategoriesRemoveIsLoading">
      <events-categories-list-table
        @eventsCategoriesCreateDialogOpen="eventsCategoriesCreateDialogOpen"
        @eventsCategoriesEditDialogOpen="eventsCategoriesEditDialogOpen"
        @eventsCategoriesRemoveOne="eventsCategoriesRemoveOne"
        @eventsCategoriesRemoveMany="eventsCategoriesRemoveMany"
      />
    </div>

    <events-categories-create-dialog
      :shown.sync="eventsCategoriesCreateDialogShown"
    />

    <events-categories-edit-dialog
      :shown.sync="eventsCategoriesEditDialogShown"
      :events-category="eventsCategoriesEditDialogEventsCategory"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import EventsCategoriesListTable from "@/components/EventsCategoriesListTable.vue"
import EventsCategoriesCreateDialog from "@/components/EventsCategoriesCreateDialog.vue"
import EventsCategoriesEditDialog from "@/components/EventsCategoriesEditDialog.vue"

export default Vue.extend({
  name: "EventsCategoriesListScreen",

  components: {
    EventsCategoriesListTable,
    EventsCategoriesCreateDialog,
    EventsCategoriesEditDialog
  },

  data: () => ({
    eventsCategoriesCreateDialogShown: false,
    eventsCategoriesEditDialogShown: false,
    eventsCategoriesEditDialogEventsCategory: {}
  }),

  computed: {
    ...mapState("events/categories", {
      eventsCategoriesStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsCategoriesStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    eventsCategoriesRemoveIsLoading(): boolean {
      return (
        this.eventsCategoriesStateRemoveOneIsLoading ||
        this.eventsCategoriesStateRemoveManyIsLoading
      )
    }
  },

  methods: {
    ...mapActions("events/categories", {
      eventsCategoriesActionsRemoveOne: "removeOne",
      eventsCategoriesActionsRemoveMany: "removeMany",
    }),

    eventsCategoriesCreateDialogOpen(): void {
      this.eventsCategoriesCreateDialogShown = true
    },

    eventsCategoriesEditDialogOpen(eventsCategory): void {
      this.eventsCategoriesEditDialogShown = true
      this.eventsCategoriesEditDialogEventsCategory = eventsCategory
    },

    async eventsCategoriesRemoveOne(eventsCategory): Promise<void> {
      const eventsCategoryName = eventsCategory.name

      try {
        await this.$confirm(
          this.$t("eventsCategoriesRemoveOneConfirmation", {
            eventsCategoryName
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
        await this.eventsCategoriesActionsRemoveOne(eventsCategory)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsCategoriesActionsRemoveOneSuccess", {
            eventsCategoryName
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

    async eventsCategoriesRemoveMany(eventsCategories): Promise<void> {
      const count = eventsCategories.length

      try {
        await this.$confirm(
          this.$t("eventsCategoriesRemoveManyConfirmation", {
            eventsCategoriesCount: count
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
        await this.eventsCategoriesActionsRemoveMany(eventsCategories)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsCategoriesActionsRemoveManySuccess", {
            eventsCategoriesCount: count
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
