<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for weapons",
    "weaponsListTableColumnNumberLabel": "Number",
    "weaponsListTableColumnNameLabel": "Name",
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
    "searchFormPlaceholder": "Søk etter våpen",
    "weaponsListTableColumnNumberLabel": "Nummer",
    "weaponsListTableColumnNameLabel": "Navn",
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
    <div class="table-controls">
      <table-filter-search
        v-model="weaponsSearchFilter"
        :label="$t('searchFormPlaceholder')"
        data-testid="weaponsSearchFilterInput"
      />

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
      :search="weaponsSearchFilter"
      :loading="weaponsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
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
              :disabled="!weaponsHasSelection"
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
import { mapActions, mapState } from "vuex"
import TableFilterSearch from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "WeaponsListTable",

  components: {
    TableFilterSearch
  },

  data: function() {
    return {
      weaponsSelection: [],
      weaponsSearchFilter: "",
      weaponsHeaders: [{
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
      weaponsStateList: "list"
    }),

    weaponsHasSelection(): boolean {
      return this.weaponsSelection.length > 0
    }
  },

  created() {
    this.weaponsActionsList()
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsList: "list"
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
