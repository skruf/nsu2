<i18n>
{
  "en": {
    "category": "category",
    "searchFormPlaceholder": "Search for categories by name",
    "eventsCategoriesListTableColumnNameLabel": "Name",
    "editEventsCategory": "@:edit @:category",
    "removeEventsCategory": "@:remove @:category",
    "tablePlaceholderText": "No categories yet."
  },
  "no": {
    "category": "kategori",
    "searchFormPlaceholder": "Søk etter kategorier med navn",
    "eventsCategoriesListTableColumnNameLabel": "Navn",
    "editEventsCategory": "@:edit @:category",
    "removeEventsCategory": "@:remove @:category",
    "tablePlaceholderText": "Ingen kategorier enda."
  }
}
</i18n>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 px-5">
      <div class="w-full max-w-md">
        <v-text-field
          v-model="eventsCategoriesSearchFilter"
          :label="$t('searchFormPlaceholder')"
          data-testid="eventsCategoriesSearchFilterInput"
          prepend-inner-icon="search"
          rounded
          filled
          dense
          hide-details
          single-line
        />
      </div>

      <v-btn
        color="primary"
        data-testid="eventsCategoriesCreateDialogOpenButton"
        @click.stop="eventsCategoriesCreateDialogOpen"
      >
        {{ $t("create") }} {{ $t("category") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="eventsCategoriesSelection"
      :headers="eventsCategoriesHeaders"
      :search="eventsCategoriesSearchFilter"
      :items="eventsCategoriesStateList"
      :loading="eventsCategoriesStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      data-testid="eventsCategoriesListTable"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              data-testid="eventsCategoriesListTableRowDropdown"
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
              data-testid="eventsCategoriesListTableRowDropdownOpenEditDialog"
              @click.stop="eventsCategoriesEditDialogOpen(item)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon>
                  edit
                </v-icon>

                <span class="ml-2">
                  {{ $t("editEventsCategory") }}
                </span>
              </v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item
              data-testid="eventsCategoriesListTableRowDropdownRemoveOne"
              @click.stop="eventsCategoriesRemoveOne(item)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon color="red">
                  delete_forever
                </v-icon>

                <span class="ml-2 red--text">
                  {{ $t("removeEventsCategory") }}
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
              :disabled="!eventsCategoriesHasSelection"
              data-testid="eventsCategoriesListTableHeaderDropdown"
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
              data-testid="eventsCategoriesListTableHeaderDropdownRemoveMany"
              @click.stop="eventsCategoriesRemoveMany(eventsCategoriesSelection)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon color="red">
                  delete_forever
                </v-icon>

                <span class="ml-2 red--text">
                  {{ $t("removeSelection") }}
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

export default Vue.extend({
  name: "EventsCategoriesListTable",

  data: function() {
    return {
      eventsCategoriesSearchFilter: "",
      eventsCategoriesSelection: [],
      eventsCategoriesHeaders: [{
        value: "name",
        text: this.$t("eventsCategoriesListTableColumnNameLabel")
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("events/categories", {
      eventsCategoriesStateList: "list",
      eventsCategoriesStateListIsLoading: "listIsLoading"
    }),

    eventsCategoriesHasSelection(): boolean {
      return this.eventsCategoriesSelection.length > 0
    }
  },

  created() {
    this.eventsCategoriesActionsList()
  },

  methods: {
    ...mapActions("events/categories", {
      eventsCategoriesActionsList: "list"
    }),

    eventsCategoriesCreateDialogOpen(): void {
      this.$emit("eventsCategoriesCreateDialogOpen")
    },

    eventsCategoriesEditDialogOpen(eventsCategory): void {
      this.$emit("eventsCategoriesEditDialogOpen", eventsCategory)
    },

    eventsCategoriesRemoveOne(eventsCategory): void {
      this.$emit("eventsCategoriesRemoveOne", eventsCategory)
    },

    eventsCategoriesRemoveMany(eventsCategories): void {
      this.$emit("eventsCategoriesRemoveMany", eventsCategories)
    }
  }
})
</script>
