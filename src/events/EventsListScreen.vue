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
  <div class="screen">
    <v-app-bar
      class="screen-bar"
      height="auto"
      flat
    >
      <v-toolbar-title class="screen-title">
        {{ $t("screenTitle") }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        icon
        data-testid="eventsListPrintButton"
        @click="$print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="container">
      <events-list-table
        :events="eventsStateList"
        :loading="loading"
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

    <confirm ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import EventsListTable from "./EventsListTable.vue"
import EventsCreateDialog from "./EventsCreateDialog.vue"
import EventsEditDialog from "./EventsEditDialog.vue"
import Confirm from "@/components/Confirm.vue"

export default Vue.extend({
  name: "EventsListScreen",

  components: {
    EventsListTable,
    EventsCreateDialog,
    EventsEditDialog,
    Confirm
  },

  data: () => ({
    eventsCreateDialogShown: false,
    eventsEditDialogShown: false,
    eventsEditDialogEvent: {}
  }),

  computed: {
    ...mapState("events", {
      eventsStateListIsLoading: "listIsLoading",
      eventsStateList: "list",
      eventsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),

    loading(): boolean {
      return (
        this.eventsStateListIsLoading ||
        this.eventsStateRemoveOneIsLoading ||
        this.eventsStateRemoveManyIsLoading
      )
    }
  },

  created() {
    this.eventsActionsList()
  },

  methods: {
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
      if(!await this.$refs.confirm.dangerous(
        this.$t("eventsRemoveOneConfirmation", {
          eventTitle: event.title
        })
      )) return

      try {
        await this.eventsActionsRemoveOne(event)
        this.$success(this.$t("eventsActionsRemoveOneSuccess", {
          eventTitle: event.title
        }))
      } catch(e) {
        this.$error(e.message)
      }
    },

    async eventsRemoveMany(events): Promise<void> {
      const count = events.length

      if(!await this.$refs.confirm.dangerous(
        this.$t("eventsRemoveManyConfirmation", {
          eventsCount: count
        })
      )) return

      try {
        await this.eventsActionsRemoveMany(events)
        this.$success(this.$t("eventsActionsRemoveManySuccess", {
          eventsCount: count
        }))
      } catch(e) {
        this.$error(e.message)
      }
    }
  }
})
</script>
