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
    "createDialogOpen": "Create club"
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
    "createDialogOpen": "Opprett klubb"
  }
}
</i18n>

<template>
  <div>
    <div class="table-controls">
      <table-filter-search
        v-model="searchFilter"
        :label="$t('searchFormPlaceholder')"
        data-testid="clubsSearchFilterInput"
      />

      <v-btn
        class="ml-auto"
        color="white"
        data-testid="clubsCreateDialogOpenButton"
        @click.stop="createDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        {{ $t("createDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="selection"
      :headers="headers"
      :items="clubs"
      :search="searchFilter"
      :loading="loading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :items-per-page="-1"
      data-testid="clubsListTable"
      class="clickable"
      @click:row="tableRowClick"
    >
      <template v-slot:item.zipCode="{ item }">
        {{ item.zipCode }}, {{ item.area }}
      </template>

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
              @click.stop="editDialogOpen(item)"
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
              @click.stop="removeOne(item)"
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
              :disabled="!hasSelection"
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
              @click.stop="removeMany(selection)"
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
import TableFilterSearch from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "ClubsListTable",

  components: {
    TableFilterSearch
  },

  props: {
    clubs: { type: Array, default: (): [] => [] },
    loading: { type: Boolean, default: true }
  },

  data() {
    return {
      selection: [],
      searchFilter: "",
      headers: [{
        value: "shortName",
        text: this.$t("columnShortNameLabel")
      }, {
        value: "name",
        text: this.$t("columnNameLabel")
      }, {
        value: "zipCode",
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
    hasSelection(): boolean {
      return this.selection.length > 0
    }
  },

  methods: {
    createDialogOpen(): void {
      this.$emit("createDialogOpen")
    },

    editDialogOpen(club): void {
      this.$emit("editDialogOpen", club)
    },

    removeOne(club): void {
      this.$emit("removeOne", club)
    },

    removeMany(clubs): void {
      this.$emit("removeMany", clubs)
    },

    tableRowClick(club): void {
      this.$router.push(`/clubs/${club.id}`)
    }
  }
})
</script>
