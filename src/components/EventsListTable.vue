<i18n>
{
  "en": {
    "eventsCreateDialogOpenButton": "@:create event",
    "searchFormPlaceholder": "Search for an event by title or club",
    "columnStartsAtLabel": "Starts/Ends",
    "columnTitleApprobatedLabel": "Title/Approbated",
    "columnTitleApprobatedLabelIsApprobated": "Is approbated",
    "columnTitleApprobatedLabelIsntApprobated": "Isn't approbated",
    "columnRangeNameLabel": "Range",
    "columnClubNameLabel": "Organizer",
    "columnCategoryNameLabel": "Category",
    "removeSelected": "Remove selected",
    "editEvent": "Edit event",
    "removeEvent": "Remove event",
    "tablePlaceholderText": "No events yet.",
    "tablePlaceholderButton": "Create new?"
  },
  "no": {
    "eventsCreateDialogOpenButton": "@:create stevne",
    "searchFormPlaceholder": "Søk etter et stevne med tittel eller klubb",
    "columnStartsAtLabel": "Starter/Slutter",
    "columnTitleApprobatedLabel": "Tittel/Approbert",
    "columnTitleApprobatedLabelIsApprobated": "Er approbert",
    "columnTitleApprobatedLabelIsntApprobated": "Ikke approbert",
    "columnRangeNameLabel": "Skyttebane",
    "columnClubNameLabel": "Arrangør",
    "columnCategoryNameLabel": "Kategori",
    "removeSelected": "Slett valgte",
    "editEvent": "Rediger stevne",
    "removeEvent": "Slett stevne",
    "tablePlaceholderText": "Ingen stevner enda.",
    "tablePlaceholderButton": "Opprett ny?"
  }
}
</i18n>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 px-5">
      <div class="w-full max-w-md">
        <v-text-field
          v-model="eventsSearchFilter"
          :label="$t('searchFormPlaceholder')"
          data-testid="eventsSearchFilterInput"
          prepend-inner-icon="search"
          rounded
          filled
          dense
          hide-details
          single-line
          @keyup.enter="eventsActionsList()"
        />
      </div>

      <v-btn
        color="primary"
        data-testid="eventsCreateDialogOpenButton"
        @click.stop="eventsCreateDialogOpen"
      >
        {{ $t("eventsCreateDialogOpenButton") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="eventsSelection"
      :headers="eventsHeaders"
      :items="eventsStateList"
      :loading="eventsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :sort-by="eventsStateSortBy"
      :items-per-page="eventsStatePageSize"
      :page="eventsStatePageCurrent"
      :server-items-length="eventsStateCount"
      :sort-desc="eventsStateOrder"
      data-testid="eventsListTable"
      class="clickable"
      @click:row="eventsRowClick"
      @update:items-per-page="eventsActionsSetPageSize"
      @update:page="eventsActionsSetPageCurrent"
      @update:sort-by="eventsActionsSetSorting"
      @update:sort-desc="eventsActionsSetOrder"
    >
      <template v-slot:item.title="{ item }">
        <div
          data-testid="eventsListTableColumnTitleApprobated"
          class="flex items-center"
        >
          <template v-if="item.approbated">
            <v-icon>
              star
            </v-icon>
          </template>

          <template v-else>
            <v-icon>
              star_border
            </v-icon>
          </template>

          <span class="ml-2">
            {{ item.title }}
          </span>
        </div>
      </template>

      <template v-slot:item.startsAt="{ item }">
        {{ item.startsAt | moment("MMM, D") }}
        -
        {{ item.endsAt | moment("MMM, D") }}
      </template>

      <template v-slot:item.rangeId="{ item }">
        {{ item.range ? item.range.name : "-" }}
      </template>

      <template v-slot:item.organizerId="{ item }">
        {{ item.club ? item.club.name : "-" }}
      </template>

      <template v-slot:item.categoryId="{ item }">
        {{ item.category ? item.category.name : "-" }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu
          bottom
          left
        >
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              data-testid="eventsListTableRowDropdown"
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
              data-testid="eventsListTableRowDropdownEditDialogOpen"
              @click.stop="eventsEditDialogOpen(item)"
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
              data-testid="eventsListTableRowDropdownRemoveOne"
              @click.stop="eventsRemoveOne(item)"
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
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapMutations, mapState } from "vuex"

export default Vue.extend({
  name: "EventsListTable",

  data: function() {
    return {
      eventsSelection: [],
      eventsHeaders: [{
        value: "title",
        text: this.$t("columnTitleApprobatedLabel")
      }, {
        value: "startsAt",
        text: this.$t("columnStartsAtLabel")
      }, {
        value: "rangeId",
        text: this.$t("columnRangeNameLabel")
      }, {
        value: "organizerId",
        text: this.$t("columnClubNameLabel")
      }, {
        value: "categoryId",
        text: this.$t("columnCategoryNameLabel")
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateListIsLoading: "listIsLoading",
      eventsStateSortBy: "sortBy",
      eventsStatePageSize: "pageSize",
      eventsStatePageCurrent: "pageCurrent",
      eventsStateCount: "count",
      eventsStateList: "list",
      eventsStateOrder: "sortDesc"
    }),
    eventsSearchFilter: {
      get(): string { return this.$store.state.events.searchFilterValue },
      set(search): void { this.eventsMutationsSetSearchFilter(search) }
    }
  },

  watch: {
    eventsSearchFilter(v): void {
      if(v === "") this.eventsActionsList()
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("events", {
      eventsActionsList: "list",
      eventsActionsSetSorting: "setSorting",
      eventsActionsSetPageSize: "setPageSize",
      eventsActionsSetPageCurrent: "setPageCurrent",
      eventsActionsSetOrder: "setOrder"
    }),

    eventsCreateDialogOpen(): void {
      this.$emit("eventsCreateDialogOpen")
    },

    eventsEditDialogOpen(event): void {
      this.$emit("eventsEditDialogOpen", event)
    },

    eventsRemoveOne(event): void {
      this.$emit("eventsRemoveOne", event)
    },

    eventsRemoveMany(events): void {
      this.$emit("eventsRemoveMany", events)
    },

    eventsRowClick(event): void {
      this.$router.push(`/events/${event.id}`)
    }
  }
})
</script>
