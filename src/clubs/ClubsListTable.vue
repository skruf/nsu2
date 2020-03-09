<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for clubs",
    "columnNameLabel": "Name",
    "columnShortNameLabel": "Short Name",
    "columnAreaLabel": "Area",
    "columnLeaderFullNameLabel": "Leader",
    "columnMembersCountLabel": "Members",
    "removeSelected": "Remove selected",
    "editClub": "Edit club",
    "removeClub": "Remove club",
    "tablePlaceholderButton": "Create new?",
    "tablePlaceholderText": "No clubs yet.",
    "clubsCreateDialogOpen": "Create club"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter klubber",
    "columnNameLabel": "Navn",
    "columnShortNameLabel": "Kortnavn",
    "columnAreaLabel": "Område",
    "columnLeaderFullNameLabel": "Leder",
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
    <div class="table-controls">
      <table-filter-search
        v-model="clubsSearchFilter"
        :label="$t('searchFormPlaceholder')"
        data-testid="clubsSearchFilterInput"
      />

      <v-btn
        class="ml-auto"
        color="white"
        data-testid="clubsCreateDialogOpenButton"
        @click.stop="clubsCreateDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        {{ $t("clubsCreateDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="clubsSelection"
      :headers="clubsHeaders"
      :items="clubsStateList"
      :search="clubsSearchFilter"
      :loading="clubsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :items-per-page="100"
      :headers-length="6"
      data-testid="clubsListTable"
      class="clickable"
      @click:row="clubsTableRowClick"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              data-testid="clubsListTableRowDropdown"
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
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              :disabled="!clubsHasSelection"
              data-testid="clubsListTableHeaderDropdown"
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
import { mapActions, mapState } from "vuex"
import TableFilterSearch from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "ClubsListTable",

  components: {
    TableFilterSearch
  },

  data() {
    return {
      clubsSelection: [],
      clubsSearchFilter: "",
      clubsHeaders: [{
        value: "shortName",
        text: this.$t("columnShortNameLabel")
      }, {
        value: "name",
        text: this.$t("columnNameLabel")
      }, {
        value: "area",
        text: this.$t("columnAreaLabel")
      }, {
        value: "leaderFullName",
        text: this.$t("columnLeaderFullNameLabel"),
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
      clubsStateList: "list"
    }),

    clubsHasSelection(): boolean {
      return this.clubsSelection.length > 0
    }
  },

  created() {
    // @TODO: observer
    this.clubsActionsList()
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsList: "list"
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
