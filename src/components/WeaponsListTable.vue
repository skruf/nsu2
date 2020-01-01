<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a weapon by name",
    "weaponsListTableColumnNameLabel": "Name/Nummer",
    "weaponsListTableColumnCategoryLabel": "Category",
    "weaponsListTableColumnConditionLabel": "Condition",
    "weaponsListTableColumnDistanceLabel": "Distance",
    "removeSelected": "Remove selected",
    "editWeapon": "Edit weapon",
    "removeWeapon": "Remove weapon",
    "tablePlaceholderText": "No weapons yet.",
    "tablePlaceholderButton": "Create new?",
    "weaponsCreateDialogOpen": "Create weapon"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter våpen med navn",
    "weaponsListTableColumnNameLabel": "Navn/Nummer",
    "weaponsListTableColumnCategoryLabel": "Kategori",
    "weaponsListTableColumnConditionLabel": "Tilstand",
    "weaponsListTableColumnDistanceLabel": "Avstand",
    "removeSelected": "Slett valgte",
    "editWeapon": "Rediger klasse",
    "removeWeapon": "Slett klasse",
    "tablePlaceholderText": "Ingen våpen enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "weaponsCreateDialogOpen": "Opprett våpen"
  }
}
</i18n>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 px-5">
      <div class="w-full max-w-md">
        <v-text-field
          v-model="weaponsSearchFilter"
          :label="$t('searchFormPlaceholder')"
          data-testid="weaponsSearchFilterInput"
          prepend-inner-icon="search"
          rounded
          filled
          dense
          hide-details
          single-line
          @keyup.enter="weaponsActionsList()"
        />
      </div>

      <v-btn
        color="primary"
        data-testid="weaponsCreateDialogOpenButton"
        @click.stop="weaponsCreateDialogOpen"
      >
        {{ $t("weaponsCreateDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="weaponsSelection"
      :headers="weaponsHeaders"
      :items="weaponsStateList"
      :loading="weaponsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :sort-by="weaponsStateSortBy"
      :items-per-page="weaponsStatePageSize"
      :page="weaponsStatePageCurrent"
      :server-items-length="weaponsStateCount"
      :sort-desc="weaponsStateOrder"
      data-testid="weaponsListTable"
      @update:items-per-page="weaponsActionsSetPageSize"
      @update:page="weaponsActionsSetPageCurrent"
      @update:sort-by="weaponsActionsSetSorting"
      @update:sort-desc="weaponsActionsSetOrder"
    >
      <template v-slot:header.name="{ header }">
        <span data-testid="weaponsListTableColumnNameText">
          {{ header.text }}
        </span>
      </template>

      <template v-slot:item.name="{ item }">
        {{ item.name }}
        <div class="text-gray-600">
          #{{ item.number }}
        </div>
      </template>

      <template v-slot:item.category="{ item }">
        {{ item.category }}
      </template>

      <template v-slot:item.distance="{ item }">
        {{ item.distance }} meter
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              data-testid="weaponsListTableRowDropdown"
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
              data-testid="weaponsListTableRowDropdownOpenEditDialog"
              @click.stop="weaponsEditDialogOpen(item)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon>
                  edit
                </v-icon>

                <span class="ml-2">
                  {{ $t("editWeapon") }}
                </span>
              </v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item
              data-testid="weaponsListTableRowDropdownRemoveOne"
              @click.stop="weaponsRemoveOne(item)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon color="red">
                  delete_forever
                </v-icon>

                <span class="ml-2 red--text">
                  {{ $t("removeWeapon") }}
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
              :disabled="!weaponsHasSelection"
              data-testid="weaponsListTableHeaderDropdown"
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
              data-testid="weaponsListTableHeaderDropdownRemoveMany"
              @click.stop="weaponsRemoveMany(weaponsSelection)"
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
  name: "WeaponsListTable",

  data: function() {
    return {
      weaponsSelection: [],
      weaponsHeaders: [{
        value: "name",
        text: this.$t("weaponsListTableColumnNameLabel")
      }, {
        value: "category",
        text: this.$t("weaponsListTableColumnCategoryLabel")
      }, {
        value: "distance",
        text: this.$t("weaponsListTableColumnDistanceLabel")
      }, {
        value: "condition",
        text: this.$t("weaponsListTableColumnConditionLabel")
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateSortBy: "sortBy",
      weaponsStatePageSize: "pageSize",
      weaponsStatePageCurrent: "pageCurrent",
      weaponsStateCount: "count",
      weaponsStateList: "list",
      weaponsStateOrder: "sortDesc"
    }),

    weaponsHasSelection(): boolean {
      return this.weaponsSelection.length > 0
    },

    weaponsSearchFilter: {
      get(): string { return this.$store.state.weapons.searchFilterValue },
      set(search): void { this.weaponsMutationsSetSearchFilter(search) }
    }
  },

  watch: {
    weaponsSearchFilter(v): void {
      if(v === "") this.weaponsActionsList()
    }
  },

  async created() {
    await this.weaponsActionsList()
  },

  methods: {
    ...mapMutations("weapons", {
      weaponsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("weapons", {
      weaponsActionsList: "list",
      weaponsActionsSetSorting: "setSorting",
      weaponsActionsSetPageSize: "setPageSize",
      weaponsActionsSetPageCurrent: "setPageCurrent",
      weaponsActionsSetSearchFilter: "setSearchFilter",
      weaponsActionsSetOrder: "setOrder"
    }),

    weaponsCreateDialogOpen(): void {
      this.$emit("weaponsCreateDialogOpen")
    },

    weaponsEditDialogOpen(weapon): void {
      this.$emit("weaponsEditDialogOpen", weapon)
    },

    weaponsRemoveOne(weapon): void {
      this.$emit("weaponsRemoveOne", weapon)
    },

    weaponsRemoveMany(weapons): void {
      this.$emit("weaponsRemoveMany", weapons)
    }
  }
})
</script>
