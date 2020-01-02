<i18n>
{
  "en": {
    "columnLabelNumber": "Nr",
    "columnLabelClubMember": "Contestant",
    "columnLabelClubName": "Club",
    "columnLabelWeapon": "Weapon",
    "columnLabelCalibre": "Calibre",
    "columnLabelLane": "Lane",
    "tablePlaceholderText": "No participants yet.",
    "tablePlaceholderButton": "Add new?",
    "eventsContestantsResultsSearchFilterPlaceholder": "Search for contestants by first or last name",
    "eventsContestantsResultsInputDialogOpen": "Input result"
  },
  "no": {
    "columnLabelNumber": "Nr",
    "columnLabelClubMember": "Deltaker",
    "columnLabelClubName": "Klubb",
    "columnLabelWeapon": "Våpen",
    "columnLabelCalibre": "Kaliber",
    "columnLabelLane": "Stand",
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ny?",
    "eventsContestantsResultsSearchFilterPlaceholder": "Søk etter deltaker med fornavn eller etternavn",
    "eventsContestantsResultsInputDialogOpen": "Angi resultat"
  }
}
</i18n>

<template>
  <div>
    <div class="px-5 no-print">
      <div class="flex justify-between items-center mb-4">
        <div class="w-full max-w-md">
          <v-text-field
            v-model="eventsContestantsResultsSearchFilter"
            :label="$t('eventsContestantsResultsSearchFilterPlaceholder')"
            data-testid="eventsContestantsResultsSearchFilterInput"
            prepend-inner-icon="search"
            rounded
            filled
            dense
            hide-details
            single-line
          />
        </div>
      </div>

      <div class="my-4 flex items-center">
        <div class="mr-4 text-sm">
          {{ $t("groupBy") }}
        </div>

        <v-btn-toggle v-model="eventsContestantsResultsTableGroupBy">
          <v-btn
            small
            :value="[]"
            data-testid="eventsContestantsResultsTableGroupByNoneButton"
          >
            {{ $t("none") }}
          </v-btn>
          <v-btn
            small
            value="weaponId"
            data-testid="eventsContestantsResultsTableGroupByWeaponButton"
          >
            {{ $t("weapon") }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <!-- :custom-sort="customSort" -->
    <v-data-table
      v-model="eventsContestantsResultsSelection"
      :class="{ 'is-grouped': isntGrouped }"
      :headers="eventsContestantsResultsHeaders"
      :items="eventsContestantsStateList"
      :search="eventsContestantsResultsSearchFilter"
      :loading="eventsContestantsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-group-by="false"
      :group-by="eventsContestantsResultsTableGroupBy"
      :items-per-page="150"
      :sort-desc="true"
      :must-sort="true"
      sort-by="total"
      data-testid="eventsContestantsResultsListTable"
    >
      <template v-slot:item.number="{ item }">
        <span class="text-xs font-semibold py-1 px-2 rounded-full bg-gray-200">
          {{ item.number }}
        </span>
      </template>

      <template v-slot:item.weapon.name="{ item }">
        {{ item.weapon.name }}
      </template>

      <template v-slot:item.hits="{ item }">
        <div
          v-if="item.hits.length"
          class="mx-auto w-full max-w-xs flex justify-center"
        >
          <span
            v-for="h in item.hits"
            :key="h.hit"
            class="hit"
          >
            {{ h.sum }}
          </span>
        </div>

        <div
          v-else
          class="mx-auto w-full max-w-xs"
        >
          <v-btn
            text
            small
            color="primary"
            class="mx-auto block no-print"
            data-testid="eventsContestantsResultsInputDialogOpen"
            @click="eventsContestantsResultsInputDialogOpen(item)"
          >
            {{ $t("eventsContestantsResultsInputDialogOpen") }}
          </v-btn>
        </div>
      </template>

      <template v-slot:header.hits="{ item }">
        <!-- h-full -->
        <!-- border-r last:border-r-0 -->
        <div class="mx-auto w-full max-w-xs flex justify-center">
          <span
            v-for="h in Array.from({ length: 13 }, (_, i) => i + 1)"
            :key="h"
            class="hit bg-transparent"
          >
            {{ h }}
          </span>
        </div>
      </template>

      <template v-slot:group.header="{ items: { 0: c } }">
        <template v-if="eventsContestantsResultsTableGroupBy === 'weaponId'">
          <td
            class="text-start"
            colspan="100%"
            data-testid="eventsContestantsResultsTableGroupByWeaponTd"
          >
            <span class="font-bold">
              Våpen: {{ c.weapon.name }}
            </span>

            <span class="text-gray-600 ml-1">
              {{ c.weapon.distance }}m
            </span>
          </td>
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu
          bottom
          left
        >
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              small
              icon
              data-testid="eventsContestantsTableRowMenuButton"
              @click.stop="click"
            >
              <v-icon>
                more_horiz
              </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              :disabled="!item.hits.length"
              data-testid="eventsContestantsResultsInputDialogOpenListItem"
              @click.stop="eventsContestantsResultsInputDialogOpen(item)"
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
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
// @TODO: reverse sorting when grouped by weapon
import Vue from "vue"
import { mapActions, mapState } from "vuex"

export default Vue.extend({
  name: "EventsContestantsResultsListTable",

  props: {
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      eventsContestantsResultsSearchFilter: "",
      eventsContestantsResultsTableGroupBy: [],
      eventsContestantsResultsSelection: [],
      eventsContestantsResultsHeaders: [{
        value: "total",
        text: "Totalt",
        sortable: false
      }, {
        value: "number",
        text: "Deltaker",
        sortable: false
      }, {
        value: "clubMember.club.shortName",
        text: this.$t("columnLabelClubName"),
        sortable: false
      }, {
        value: "weapon.name",
        text: this.$t("columnLabelWeapon"),
        sortable: false
      }, {
        value: "hits",
        text: "Treff",
        sortable: false,
        align: "right"
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsStateListIsLoading: "listIsLoading",
      eventsContestantsStateList: "list"
    }),
    isntGrouped(): boolean {
      return this.eventsContestantsResultsTableGroupBy === []
    }
  },

  watch: {
    event: {
      immediate: true,
      handler: function(): Promise<void> {
        if(!this.event.id) return
        this.eventsContestantsActionsList({
          filter: { eventId: this.event.id },
          persistFilter: true
        })
      }
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsList: "list"
    }),

    eventsContestantsResultsInputDialogOpen(contestant): void {
      this.$emit("eventsContestantsResultsInputDialogOpen", contestant)
    }

    // customSort(items, index, isDesc) {
    //   items.sort((a, b) => {
    //     if(a.sum < b.sum) return -1
    //     if(a.sum > b.sum) return 1
    //     return 0
    //   })
    //   return items
    // }
  }
})
</script>
