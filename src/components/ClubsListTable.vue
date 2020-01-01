<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a club by name",
    "columnNameLabel": "Name",
    "columnAreaStreetAddressLabel": "Area/Address",
    "columnLeaderFullNameEmailLabel": "Leader/Email",
    "columnMembersCountLabel": "Members",
    "removeSelected": "Remove selected",
    "editClub": "Edit club",
    "removeClub": "Remove club",
    "tablePlaceholderButton": "Create new?",
    "tablePlaceholderText": "No clubs yet.",
    "clubsCreateDialogOpen": "Create club"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter en klubb med navn",
    "columnNameLabel": "Navn",
    "columnAreaStreetAddressLabel": "Område/Adresse",
    "columnLeaderFullNameEmailLabel": "Leder/Epost",
    "columnMembersCountLabel": "Medlemmer",
    "removeSelected": "Slett valgte",
    "editClub": "Rediger klubb",
    "removeClub": "Slett klubb",
    "tablePlaceholderButton": "Opprett ny?",
    "tablePlaceholderText": "Ingen klubber enda.",
    "clubsCreateDialogOpen": "Opprett klubb"
  }
}
</i18n>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 px-5">
      <div class="w-full max-w-md">
        <v-text-field
          v-model="clubsSearchFilter"
          :label="$t('searchFormPlaceholder')"
          data-testid="clubsSearchFilterInput"
          prepend-inner-icon="search"
          rounded
          filled
          dense
          hide-details
          single-line
          @keyup.enter="clubsActionsList()"
        />
      </div>

      <v-btn
        color="primary"
        data-testid="clubsCreateDialogOpenButton"
        @click.stop="clubsCreateDialogOpen"
      >
        {{ $t("clubsCreateDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="clubsSelection"
      :headers="clubsHeaders"
      :items="clubsStateList"
      :loading="clubsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :sort-by="clubsStateSortBy"
      :items-per-page="clubsStatePageSize"
      :page="clubsStatePageCurrent"
      :server-items-length="clubsStateCount"
      :sort-desc="clubsStateOrder"
      data-testid="clubsListTable"
      class="clickable"
      @click:row="clubsTableRowClick"
      @update:items-per-page="clubsActionsSetPageSize"
      @update:page="clubsActionsSetPageCurrent"
      @update:sort-by="clubsActionsSetSorting"
      @update:sort-desc="clubsActionsSetOrder"
    >
      <template v-slot:item.name="{ item }">
        {{ item.name }}
        <div class="text-gray-600">
          {{ item.shortName }}
        </div>
      </template>

      <template v-slot:item.area="{ item }">
        {{ item.area }}
        <div class="text-gray-600">
          {{ item.streetAddress }}
        </div>
      </template>

      <template v-slot:item.category="{ item }">
        {{ item.leaderFullName }}
        <div class="text-gray-600">
          {{ item.emailAddress || "N/A" }}
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              data-testid="clubsListTableRowDropdown"
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
              data-testid="clubsListTableRowDropdownOpenEditDialog"
              @click.stop="clubsEditDialogOpen(item)"
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
              data-testid="clubsListTableRowDropdownRemoveOne"
              @click.stop="clubsRemoveOne(item)"
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
      </template>

      <template v-slot:header.actions>
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              :disabled="!clubsHasSelection"
              data-testid="clubsListTableHeaderDropdown"
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
              data-testid="clubsListTableHeaderDropdownRemoveMany"
              @click.stop="clubsRemoveMany(clubsSelection)"
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
  name: "ClubsListTable",

  data: function() {
    return {
      clubsSelection: [],
      clubsHeaders: [{
        value: "name",
        text: this.$t("columnNameLabel")
      }, {
        value: "area",
        text: this.$t("columnAreaStreetAddressLabel")
      }, {
        value: "leaderFullName",
        text: this.$t("columnLeaderFullNameEmailLabel"),
        sortable: false
      }, {
        value: "membersCount",
        text: this.$t("columnMembersCountLabel"),
        sortable: false
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateSortBy: "sortBy",
      clubsStatePageSize: "pageSize",
      clubsStatePageCurrent: "pageCurrent",
      clubsStateCount: "count",
      clubsStateList: "list",
      clubsStateOrder: "sortDesc"
    }),

    clubsHasSelection(): boolean {
      return this.clubsSelection.length > 0
    },

    clubsSearchFilter: {
      get(): string { return this.$store.state.clubs.searchFilterValue },
      set(search): void { this.clubsMutationsSetSearchFilter(search) }
    }
  },

  watch: {
    clubsSearchFilter(v): void {
      if(v === "") this.clubsActionsList()
    }
  },

  async created() {
    await this.clubsActionsList()
  },

  methods: {
    ...mapMutations("clubs", {
      clubsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list",
      clubsActionsSetSorting: "setSorting",
      clubsActionsSetPageSize: "setPageSize",
      clubsActionsSetPageCurrent: "setPageCurrent",
      clubsActionsSetSearchFilter: "setSearchFilter",
      clubsActionsSetOrder: "setOrder"
    }),

    clubsCreateDialogOpen(): void {
      this.$emit("clubsCreateDialogOpen")
    },

    clubsEditDialogOpen(club): void {
      this.$emit("clubsEditDialogOpen", club)
    },

    clubsRemoveOne(club): void {
      this.$emit("clubsRemoveOne", club)
    },

    clubsRemoveMany(clubs): void {
      this.$emit("clubsRemoveMany", clubs)
    },

    clubsTableRowClick(club): void {
      this.$router.push(`/clubs/${club.id}`)
    }
  }
})
</script>
