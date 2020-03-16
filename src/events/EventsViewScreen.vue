<i18n>
{
  "en": {
    "breadcrumb1Label": "Events",
    "mapRange": "Show range on map",
    "printEvent": "Print event",
    "editEvent": "Edit event",
    "removeEvent": "Remove event",
    "startsAt": "Starts at",
    "endsAt": "Ends at",
    "category": "Category",
    "contestants": "Contestants",
    "createMember": "Create club member",
    "manageContestants": "Manage contestants",
    "divisions": "Divisions",
    "createDivision": "Create division",
    "results": "Results",
    "eventsRemoveOneConfirmation": "This will remove %{eventTitle} permanently. Continue?",
    "eventsActionsRemoveOneSuccess": "%{eventTitle} was removed from the database",
    "printResultsDeadline": "Deadline",
    "printResultsFinal": "Final"
  },
  "no": {
    "breadcrumb1Label": "Stevner",
    "mapRange": "Vis skyttebane på kart",
    "printEvent": "Print stevne",
    "editEvent": "Rediger stevne",
    "removeEvent": "Slett stevne",
    "startsAt": "Starter",
    "endsAt": "Slutter",
    "category": "Kategori",
    "contestants": "Deltakere",
    "createMember": "Opprett klubbmedlem",
    "manageContestants": "Håndter deltakere",
    "divisions": "Standplasslister",
    "createDivision": "Opprett divisjon",
    "results": "Resultater",
    "eventsRemoveOneConfirmation": "Dette vil fjerne %{eventTitle} permanent. Fortsette?",
    "eventsActionsRemoveOneSuccess": "%{eventTitle} ble fjernet fra databasen",
    "printResultsDeadline": "Klagefrist",
    "printResultsFinal": "Utløpt"
  }
}
</i18n>

<template>
  <div class="screen">
    <v-app-bar
      class="screen-bar print:hidden"
      height="auto"
      flat
    >
      <v-toolbar-title class="screen-title">
        <div class="flex flex-col print:mb-2">
          <div class="flex items-center">
            <template v-if="eventsStateSelected.approbated">
              <v-icon class="mr-2">
                star
              </v-icon>
            </template>

            <template v-else>
              <v-icon class="mr-2">
                star_border
              </v-icon>
            </template>

            {{ eventsStateSelected.title }}
          </div>

          <router-link
            v-if="eventsStateSelected.range"
            class="text-base leading-none opacity-75 ml-8 self-start"
            :to="`/ranges/${eventsStateSelected.range.id}`"
          >
            {{ eventsStateSelected.range.name }}, {{ eventsStateSelected.range.streetAddress }} {{ eventsStateSelected.range.area }}
          </router-link>
        </div>

        <div
          v-if="activeTab === 2"
          class="hidden print:block text-base leading-none ml-8 print:text-sm"
        >
          <div class="mb-px pb-px text-sm opacity-75 print:text-xs">
            {{ $t("printResultsDeadline") }}
          </div>

          <div v-if="printMode === 'deadline'">
            kl. {{ Date.now() | moment("add", "1 hour", "HH:MM") }}
            <!-- - ddd, DD/MMM -->
          </div>

          <div v-if="printMode === 'final'">
            {{ $t("printResultsFinal") }}
          </div>
        </div>

        <data-grid v-if="!eventsStateSelectedIsLoading">
          <template slot="Start">
            {{ eventsStateSelected.startsAt | moment("YYYY-MM-DD") }}
          </template>
          <template slot="Slutt">
            {{ eventsStateSelected.endsAt | moment("YYYY-MM-DD") }}
          </template>
          <template
            v-if="eventsStateSelected.category"
            slot="Kategori"
          >
            {{ eventsStateSelected.category.name }}
          </template>
          <template
            v-if="eventsStateSelected.club"
            slot="Arrangør"
          >
            <router-link :to="`/clubs/${eventsStateSelected.club.id}`">
              {{ eventsStateSelected.club.shortName }}
            </router-link>
          </template>
        </data-grid>
      </v-toolbar-title>

      <template v-if="activeTab === 2">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              data-testid="eventsPrintButtonDivision"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>print</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              data-testid="eventsViewDropdownOpenEditDialog"
              @click="printResultsDeadline"
            >
              <v-list-item-title>
                {{ $t("printResultsDeadline") }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              data-testid="eventsViewDropdownRemoveOne"
              @click="printResultsFinal"
            >
              <v-list-item-title>
                {{ $t("printResultsFinal") }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn
          icon
          data-testid="eventsPrintButton"
          @click="print"
        >
          <v-icon>print</v-icon>
        </v-btn>
      </template>

      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            data-testid="eventsViewDropdown"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>more_horiz</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            data-testid="eventsViewDropdownOpenEditDialog"
            @click="eventsEditDialogOpen()"
          >
            <v-list-item-title class="flex items-center">
              <v-icon>
                edit
              </v-icon>

              <span class="ml-2">
                {{ $t("editEvent") }}
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item
            data-testid="eventsViewDropdownRemoveOne"
            @click="eventsRemoveOne(eventsStateSelected)"
          >
            <v-list-item-title class="flex items-center">
              <v-icon color="red">
                delete_forever
              </v-icon>

              <span class="ml-2 red--text">
                {{ $t("removeEvent") }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <div class="tab-container">
      <v-tabs
        v-model="activeTab"
        background-color="transparent"
        color="primary"
        class="flex-initial"
      >
        <v-tab data-testid="eventsViewScreenTabsContestantsTab">
          {{ $t("contestants") }}
        </v-tab>

        <v-tab data-testid="eventsViewScreenTabsDivisionsTab">
          {{ $t("divisions") }}
        </v-tab>

        <v-tab data-testid="eventsViewScreenTabsResultsTab">
          {{ $t("results") }}
        </v-tab>
      </v-tabs>
    </div>

    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <events-view-tabs-contestants
          :event="eventsStateSelected"
        />
      </v-tab-item>

      <v-tab-item>
        <events-view-tabs-divisions
          :event="eventsStateSelected"
        />
      </v-tab-item>

      <v-tab-item>
        <events-view-tabs-results
          :event="eventsStateSelected"
        />
      </v-tab-item>
    </v-tabs-items>

    <events-edit-dialog
      :shown.sync="eventsEditDialogShow"
      :event="eventsStateSelected"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import DataGrid from "@/components/DataGrid.vue"
import EventsViewTabsContestants
  from "./EventsViewTabsContestants.vue"
import EventsViewTabsDivisions
  from "./EventsViewTabsDivisions.vue"
import EventsViewTabsResults
  from "./EventsViewTabsResults.vue"
import EventsEditDialog
  from "./EventsEditDialog.vue"

export default Vue.extend({
  name: "EventsViewScreen",

  components: {
    EventsViewTabsContestants,
    EventsViewTabsDivisions,
    EventsViewTabsResults,
    EventsEditDialog,
    DataGrid
  },

  data: () => ({
    activeTab: 0,
    eventsEditDialogShow: false,
    printMode: ""
  }),

  computed: {
    ...mapState("events", {
      eventsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsStateSelectedIsLoading: "selectedIsLoading",
      eventsStateSelected: "selected"
    }),
    eventsIsLoading(): boolean {
      return (
        this.eventsStateSelectedIsLoading ||
        this.eventsStateRemoveOneIsLoading
      )
    }
  },

  watch: {
    "$route.params.eventId": {
      immediate: true,
      handler(id): void {
        this.eventsActionsSelect({ id })
        this.eventsContestantsActionsList({
          filter: { eventId: id }
        })
        this.eventsDivisionsActionsList({
          filter: { eventId: id }
        })
      }
    }
  },

  methods: {
    ...mapActions("events", {
      eventsActionsSelect: "select",
      eventsActionsRemoveOne: "removeOne"
    }),

    ...mapActions("events/contestants", {
      eventsContestantsActionsList: "list"
    }),

    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list"
    }),

    eventsRangeOpenMap(): void {
      const { range } = this.eventsStateSelected
      window.open(`https://www.google.com/maps/@${range.lat},${range.lng},15z`)
    },

    eventsEditDialogOpen(): void {
      this.eventsEditDialogShow = true
    },

    async eventsRemoveOne(): Promise<void> {
      const event = this.eventsStateSelected
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
        this.$router.push("/")
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    printResultsDeadline(): void {
      this.printMode = "deadline"
      this.$nextTick(() => {
        this.print()
      })
    },

    printResultsFinal(): void {
      this.printMode = "final"
      this.$nextTick(() => {
        this.print()
      })
    }
  }
})
</script>
