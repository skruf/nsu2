<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a range by name",
    "rangesListTableColumnNameLabel": "Name",
    "rangesListTableColumnTypeLabel": "Type",
    "rangesListTableColumnAreaLabel": "Area",
    "rangesListTableColumnStreetAddressLabel": "Address",
    "rangesListTableColumnStreetCountryLabel": "Land",
    "removeSelected": "Remove selected",
    "editRange": "Edit range",
    "removeRange": "Remove range",
    "tablePlaceholderText": "No ranges yet.",
    "tablePlaceholderButton": "Create new?",
    "rangesCreateDialogOpen": "Create range"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter skyttebane med navn",
    "rangesListTableColumnNameLabel": "Navn",
    "rangesListTableColumnTypeLabel": "Type",
    "rangesListTableColumnAreaLabel": "Område",
    "rangesListTableColumnStreetAddressLabel": "Adresse",
    "rangesListTableColumnStreetCountryLabel": "Land",
    "removeSelected": "Slett valgte",
    "editRange": "Rediger klasse",
    "removeRange": "Slett klasse",
    "tablePlaceholderText": "Ingen skyttebane enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "rangesCreateDialogOpen": "Opprett skyttebane"
  }
}
</i18n>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 px-5">
      <div class="w-full max-w-md">
        <v-text-field
          v-model="rangesSearchFilter"
          :label="$t('searchFormPlaceholder')"
          data-testid="rangesSearchFilterInput"
          prepend-inner-icon="search"
          rounded
          filled
          dense
          hide-details
          single-line
          @keyup.enter="rangesActionsList()"
        />
      </div>

      <v-btn
        color="primary"
        data-testid="rangesCreateDialogOpenButton"
        @click.stop="rangesCreateDialogOpen"
      >
        {{ $t("rangesCreateDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="rangesSelection"
      :headers="rangesHeaders"
      :items="rangesStateList"
      :loading="rangesStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :sort-by="rangesStateSortBy"
      :items-per-page="rangesStatePageSize"
      :page="rangesStatePageCurrent"
      :server-items-length="rangesStateCount"
      :sort-desc="rangesStateOrder"
      data-testid="rangesListTable"
      @update:items-per-page="rangesActionsSetPageSize"
      @update:page="rangesActionsSetPageCurrent"
      @update:sort-by="rangesActionsSetSorting"
      @update:sort-desc="rangesActionsSetOrder"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              data-testid="rangesListTableRowDropdown"
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
              data-testid="rangesListTableRowDropdownOpenEditDialog"
              @click.stop="rangesEditDialogOpen(item)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon>
                  edit
                </v-icon>

                <span class="ml-2">
                  {{ $t("editRange") }}
                </span>
              </v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item
              data-testid="rangesListTableRowDropdownRemoveOne"
              @click.stop="rangesRemoveOne(item)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon color="red">
                  delete_forever
                </v-icon>

                <span class="ml-2 red--text">
                  {{ $t("removeRange") }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:header.actions>
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              :disabled="!rangesHasSelection"
              data-testid="rangesListTableHeaderDropdown"
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
              data-testid="rangesListTableHeaderDropdownRemoveMany"
              @click.stop="rangesRemoveMany(rangesSelection)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon color="red">
                  delete_forever
                </v-icon>

                <span class="ml-2 red--text">
                  {{ $t("removeSelected") }}
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
  name: "RangesListTable",

  data: function() {
    return {
      rangesSelection: [],
      rangesHeaders: [{
        value: "name",
        text: this.$t("rangesListTableColumnNameLabel")
      }, {
        value: "type",
        text: this.$t("rangesListTableColumnTypeLabel")
      }, {
        value: "area",
        text: this.$t("rangesListTableColumnAreaLabel")
      }, {
        value: "streetAddress",
        text: this.$t("rangesListTableColumnStreetAddressLabel")
      }, {
        value: "country",
        text: this.$t("rangesListTableColumnStreetCountryLabel")
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateSortBy: "sortBy",
      rangesStatePageSize: "pageSize",
      rangesStatePageCurrent: "pageCurrent",
      rangesStateCount: "count",
      rangesStateList: "list",
      rangesStateOrder: "sortDesc"
    }),

    rangesHasSelection() {
      return this.rangesSelection.length > 0
    },

    rangesSearchFilter: {
      get() { return this.$store.state.ranges.searchFilterValue },
      set(search) { this.rangesMutationsSetSearchFilter(search) }
    }
  },

  watch: {
    rangesSearchFilter(v) {
      if(v === "") this.rangesActionsList()
    }
  },

  async created() {
    await this.rangesActionsList()
  },

  methods: {
    ...mapMutations("ranges", {
      rangesMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list",
      rangesActionsSetSorting: "setSorting",
      rangesActionsSetPageSize: "setPageSize",
      rangesActionsSetPageCurrent: "setPageCurrent",
      rangesActionsSetSearchFilter: "setSearchFilter",
      rangesActionsSetOrder: "setOrder"
    }),

    rangesCreateDialogOpen() {
      this.$emit("rangesCreateDialogOpen")
    },

    rangesEditDialogOpen(range) {
      this.$emit("rangesEditDialogOpen", range)
    },

    rangesRemoveOne(range) {
      this.$emit("rangesRemoveOne", range)
    },

    rangesRemoveMany(ranges) {
      this.$emit("rangesRemoveMany", ranges)
    }
  }
})
</script>
