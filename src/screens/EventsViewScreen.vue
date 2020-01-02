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
    "eventsActionsRemoveOneSuccess": "%{eventTitle} was removed from the database"
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
    "eventsActionsRemoveOneSuccess": "%{eventTitle} ble fjernet fra databasen"
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
      <v-toolbar-title class="flex items-center justify-between w-full">
        <div class="flex flex-col">
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

            <v-menu>
              <template v-slot:activator="{ on: { click } }">
                <v-btn
                  data-testid="clubsViewDropdown"
                  small
                  icon
                  @click.stop="click"
                >
                  <v-icon>
                    more_horiz
                  </v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  data-testid="eventsViewDropdownOpenEditDialog"
                  @click.stop="eventsEditDialogOpen()"
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
                  data-testid="eventsViewDropdownRemoveOne"
                  @click.stop="eventsRemoveOne(eventsStateSelected)"
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
          </div>

          <!-- @TODO: tailwind print ml-8 = ml-0? -->
          <div
            v-if="eventsStateSelected.range"
            class="text-base leading-none opacity-75 ml-8"
          >
            {{ eventsStateSelected.range.name }}, {{ eventsStateSelected.range.streetAddress }} {{ eventsStateSelected.range.area }}
          </div>
        </div>

        <data-grid>
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
            {{ eventsStateSelected.club.shortName }}
          </template>
        </data-grid>
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        icon
        data-testid="eventsPrintButton"
        @click="print"
      >
        <v-icon>print</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          v-model="activeTab"
          align-with-title
          background-color="transparent"
        >
          <v-tabs-slider color="white" />

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
      </template>
    </v-app-bar>

    <v-breadcrumbs
      :items="[
        { to: '/events', text: $t('breadcrumb1Label') },
        { to: `/events/${eventsStateSelected.id}`,
          text: eventsStateSelected.title }
      ]"
    />

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
import EventsViewTabsContestants from "@/components/EventsViewTabsContestants.vue"
import EventsViewTabsDivisions from "@/components/EventsViewTabsDivisions.vue"
import EventsViewTabsResults from "@/components/EventsViewTabsResults.vue"
import EventsEditDialog from "@/components/EventsEditDialog.vue"
import DataGrid from "@/components/DataGrid.vue"

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
    eventsEditDialogShow: false
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
      handler: function(id): void {
        this.eventsActionsSelect({ id })
      }
    }
  },

  methods: {
    ...mapActions("events", {
      eventsActionsSelect: "select",
      eventsActionsRemoveOne: "removeOne"
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
    }
  }
})
</script>
