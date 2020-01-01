<i18n>
{
  "en": {
    "breadcrumbEventsLabel": "Events",
    "breadcrumbAllLabel": "All",
    "screenTitle": "Events",
    "eventsCreateDialogOpenButton": "Create event",
    "past": "Past",
    "upcoming": "Upcoming",
    "all": "All",
    "eventsRemoveOneConfirmation": "This will remove %{eventTitle} permanently. Continue?",
    "eventsActionsRemoveOneSuccess": "%{eventTitle} was removed from the database",
    "eventsRemoveManyConfirmation": "This will remove %{eventsCount} events permanently. Continue?",
    "eventsActionsRemoveManySuccess": "%{eventsCount} events were removed from the database"
  },
  "no": {
    "breadcrumbEventsLabel": "Stevner",
    "breadcrumbAllLabel": "Alle",
    "screenTitle": "Stevner",
    "eventsCreateDialogOpenButton": "Opprett stevne",
    "past": "Avsluttet",
    "upcoming": "Kommende",
    "all": "Alle",
    "eventsRemoveOneConfirmation": "Dette vil fjerne %{eventTitle} permanent. Fortsette?",
    "eventsActionsRemoveOneSuccess": "%{eventTitle} ble fjernet fra databasen",
    "eventsRemoveManyConfirmation": "Dette vil fjerne %{eventsCount} stevner permanent. Fortsette?",
    "eventsActionsRemoveManySuccess": "%{eventsCount} stevner ble fjernet fra databasen"
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

      <v-spacer />

      <v-btn icon>
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <v-breadcrumbs
      :items="[
        { to: '/events', text: $t('breadcrumbEventsLabel') },
        { to: '', text: $t('breadcrumbAllLabel') }
      ]"
    />

    <div v-loading="eventsRemoveIsLoading">
      <events-list-table
        @eventsCreateDialogOpen="eventsCreateDialogOpen"
        @eventsEditDialogOpen="eventsEditDialogOpen"
        @eventsRemoveOne="eventsRemoveOne"
        @eventsRemoveMany="eventsRemoveMany"
      />
    </div>

    <events-create-dialog
      :shown.sync="eventsCreateDialogShown"
    />

    <events-edit-dialog
      :shown.sync="eventsEditDialogShown"
      :event="eventsEditDialogEvent"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapMutations, mapState } from "vuex"
import EventsListTable from "@/components/EventsListTable.vue"
import EventsCreateDialog from "@/components/EventsCreateDialog.vue"
import EventsEditDialog from "@/components/EventsEditDialog.vue"

export default Vue.extend({
  name: "EventsListScreen",

  components: {
    EventsListTable,
    EventsCreateDialog,
    EventsEditDialog
  },

  data: () => ({
    eventsCreateDialogShown: false,
    eventsEditDialogShown: false,
    eventsEditDialogEvent: {}
  }),

  computed: {
    ...mapState("events", {
      eventsStateFetchMode: "fetchMode",
      eventsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),

    eventsRemoveIsLoading(): boolean {
      return (
        this.eventsStateRemoveOneIsLoading ||
        this.eventsStateRemoveManyIsLoading
      )
    },

    breadcrumbLabel(): string {
      if(this.eventsStateFetchMode === "history") {
        return this.$t("past")
      }
      if(this.eventsStateFetchMode === "upcoming") {
        return this.$t("upcoming")
      }
      return "All"
    }
  },

  watch: {
    "$route.query.filter": {
      immediate: true,
      handler: async function(mode): Promise<void> {
        this.eventsMutationsSetFetchMode(mode)
        await this.eventsActionsList()
      }
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsMutationsSetFetchMode: "SET_FETCH_MODE"
    }),

    ...mapActions("events", {
      eventsActionsList: "list",
      eventsActionsRemoveOne: "removeOne",
      eventsActionsRemoveMany: "removeMany"
    }),

    eventsCreateDialogOpen(): void {
      this.eventsCreateDialogShown = true
    },

    eventsEditDialogOpen(item): void {
      this.eventsEditDialogShown = true
      this.eventsEditDialogEvent = item
    },

    async eventsRemoveOne(event): Promise<void> {
      try {
        await this.$confirm(
          this.$t("eventsRemoveOneConfirmation", {
            eventTitle: event.title
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
        await this.eventsActionsRemoveOne(event)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsActionsRemoveOneSuccess", {
            eventTitle: event.title
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

    async eventsRemoveMany(events): Promise<void> {
      const count = events.length
      try {
        await this.$confirm(
          this.$t("eventsRemoveManyConfirmation", {
            eventsCount: count
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
        await this.eventsActionsRemoveMany(events)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsActionsRemoveManySuccess", {
            eventsCount: count
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
