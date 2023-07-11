<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for classes",
    "weaponsListTableColumnNumberLabel": "Number",
    "weaponsListTableColumnNameLabel": "Name",
    "weaponsListTableColumnCategoryLabel": "Category",
    "weaponsListTableColumnConditionLabel": "Condition",
    "weaponsListTableColumnDistanceLabel": "Distance",
    "removeSelected": "Remove selected",
    "editWeapon": "Edit class",
    "removeWeapon": "Remove class",
    "tablePlaceholderText": "No classes yet.",
    "tablePlaceholderButton": "Create new?",
    "weaponsCreateDialogOpen": "Create class"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter klasse",
    "weaponsListTableColumnNumberLabel": "Nummer",
    "weaponsListTableColumnNameLabel": "Navn",
    "weaponsListTableColumnCategoryLabel": "Kategori",
    "weaponsListTableColumnConditionLabel": "Tilstand",
    "weaponsListTableColumnDistanceLabel": "Avstand",
    "removeSelected": "Slett valgte",
    "editWeapon": "Rediger klasse",
    "removeWeapon": "Slett klasse",
    "tablePlaceholderText": "Ingen klasse enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "weaponsCreateDialogOpen": "Opprett klasse"
  }
}
</i18n>

<template>
  <div>
    <div class="table-controls">
      <table-filter-search
        v-model="search"
        :label="$t('searchFormPlaceholder')"
        data-testid="weaponsSearchFilterInput"
      />

      <v-btn
        class="ml-auto"
        color="white"
        data-testid="weaponsCreateDialogOpenButton"
        @click.stop="weaponsCreateDialogOpen"
      >
        {{ $t("weaponsCreateDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="selection"
      :headers="headers"
      :items="weapons"
      :search="search"
      :loading="loading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :items-per-page="100"
      data-testid="weaponsListTable"
    >
      <template v-slot:header.name="{ header }">
        <span data-testid="weaponsListTableColumnNameText">
          {{ header.text }}
        </span>
      </template>

      <template v-slot:item.distance="{ item }">
        {{ item.distance }} meter
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              data-testid="weaponsListTableRowDropdown"
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
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              :disabled="!hasSelection"
              data-testid="weaponsListTableHeaderDropdown"
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
              data-testid="weaponsListTableHeaderDropdownRemoveMany"
              @click.stop="weaponsRemoveMany(selection)"
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
import TableFilterSearch
  from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "WeaponsListTable",

  components: {
    TableFilterSearch
  },

  props: {
    weapons: { type: Array, required: true },
    loading: { type: Boolean, default: false }
  },

  data: function() {
    return {
      selection: [],
      search: "",
      headers: [{
        value: "name",
        text: this.$t("weaponsListTableColumnNameLabel")
      }, {
        value: "number",
        text: this.$t("weaponsListTableColumnNumberLabel")
      }, {
        value: "category",
        text: this.$t("weaponsListTableColumnCategoryLabel")
      }, {
        value: "distance",
        text: this.$t("weaponsListTableColumnDistanceLabel")
      },
      // {
      //   value: "condition",
      //   text: this.$t("weaponsListTableColumnConditionLabel")
      // },
      {
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
