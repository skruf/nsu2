<i18n>
{
  "en": {
    "eventsCreateDialogOpenButton": "@:create event",
    "searchFormPlaceholder": "Search for events",
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
    "searchFormPlaceholder": "Søk etter stevner",
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
    <div class="table-controls">
      <table-filter-search
        v-model="eventsSearchFilter"
        :label="$t('searchFormPlaceholder')"
        data-testid="eventsSearchFilterInput"
      />

      <v-btn
        class="ml-auto"
        color="white"
        data-testid="eventsCreateDialogOpenButton"
        @click.stop="eventsCreateDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        {{ $t("eventsCreateDialogOpenButton") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="eventsSelection"
      :headers="eventsHeaders"
      :items="eventsStateList"
      :search="eventsSearchFilter"
      :loading="eventsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      data-testid="eventsListTable"
      class="clickable"
      @click:row="eventsRowClick"
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
        {{ item.range && item.range.name }}
      </template>

      <template v-slot:item.organizerId="{ item }">
        {{ item.club && item.club.shortName }}
      </template>

      <template v-slot:item.categoryId="{ item }">
        {{ item.category && item.category.name }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              data-testid="eventsListTableRowDropdown"
              small
              icon
              v-bind="attrs"
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
import { mapActions, mapState } from "vuex"
import TableFilterSearch from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "EventsListTable",

  components: {
    TableFilterSearch
  },

  data() {
    return {
      eventsSelection: [],
      eventsSearchFilter: "",
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
      eventsStateList: "list"
    })
  },

  methods: {
    ...mapActions("events", {
      eventsActionsList: "list"
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
