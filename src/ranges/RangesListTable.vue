<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for ranges",
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
    "searchFormPlaceholder": "Søk etter skyttebaner",
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
    <div class="table-controls">
      <table-filter-search
        v-model="rangesSearchFilter"
        :label="$t('searchFormPlaceholder')"
        data-testid="rangesSearchFilterInput"
      />

      <v-btn
        class="ml-auto"
        color="white"
        data-testid="rangesCreateDialogOpenButton"
        @click.stop="rangesCreateDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        {{ $t("rangesCreateDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="rangesSelection"
      :headers="rangesHeaders"
      :items="rangesStateList"
      :search="rangesSearchFilter"
      :loading="rangesStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :items-per-page="100"
      :headers-length="6"
      data-testid="rangesListTable"
      class="clickable no-print-first-td no-print-last-td"
      @click:row="rangesTableRowClick"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              data-testid="rangesListTableRowDropdown"
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
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              :disabled="!rangesHasSelection"
              data-testid="rangesListTableHeaderDropdown"
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
import { mapActions, mapState } from "vuex"
import TableFilterSearch
  from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "RangesListTable",

  components: {
    TableFilterSearch
  },

  data() {
    return {
      rangesSelection: [],
      rangesSearchFilter: "",
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
      rangesStateList: "list"
    }),

    rangesHasSelection(): boolean {
      return this.rangesSelection.length > 0
    }
  },

  created() {
    this.rangesActionsList()
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    rangesCreateDialogOpen(): void {
      this.$emit("rangesCreateDialogOpen")
    },

    rangesEditDialogOpen(range): void {
      this.$emit("rangesEditDialogOpen", range)
    },

    rangesRemoveOne(range): void {
      this.$emit("rangesRemoveOne", range)
    },

    rangesRemoveMany(ranges): void {
      this.$emit("rangesRemoveMany", ranges)
    },

    rangesTableRowClick(range): void {
      this.$router.push(`/ranges/${range.id}`)
    }
  }
})
</script>
