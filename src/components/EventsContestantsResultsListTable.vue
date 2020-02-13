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
    "eventsContestantsResultsSearchFilterPlaceholder": "Search for contestants",
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
    "eventsContestantsResultsSearchFilterPlaceholder": "Søk etter deltakere",
    "eventsContestantsResultsInputDialogOpen": "Angi resultat"
  }
}
</i18n>

<template>
  <div class="relative">
    <div class="table-controls">
      <table-filter-search
        v-model="eventsContestantsResultsSearchFilter"
        :label="$t('eventsContestantsResultsSearchFilterPlaceholder')"
        data-testid="eventsContestantsResultsSearchFilterInput"
      />

      <v-form
        ref="filterForm"
        class="flex items-center ml-auto max-w-lg"
      >
        <table-filter-select
          v-model="eventsContestantsTableFilter.clubIds"
          v-slot="item"
          :items="eventsContestantsStateList.map(({ clubMember }) => clubMember.club)"
          :loading="eventsContestantsStateListIsLoading"
          :item-text="({ name, shortName }) => `${name} (${shortName})`"
          data-testid="eventsContestantsResultsListTableFilterClub"
          class="flex-1 mx-5"
          label="Vis klubb"
        >
          {{ item.shortName }}
        </table-filter-select>

        <table-filter-select
          v-model="eventsContestantsTableFilter.weaponIds"
          v-slot="item"
          :items="eventsContestantsStateList.map(({ weapon }) => weapon)"
          :loading="eventsContestantsStateListIsLoading"
          item-text="name"
          data-testid="eventsContestantsResultsListTableFilterWeapon"
          class="flex-1"
          label="Vis våpen"
        >
          {{ item.name }}
        </table-filter-select>
      </v-form>
    </div>

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
      :sort-desc="true"
      :must-sort="true"
      :group-desc="true"
      sort-by="total"
      data-testid="eventsContestantsResultsListTable"
    >
      <template v-slot:item.number="{ item }">
        <div class="flex items-center">
          <div class="text-xs font-semibold py-1 px-2 rounded-full bg-gray-200">
            {{ item.number }}
          </div>
          <div class="ml-2 hidden print:inline-block">
            {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
          </div>
        </div>
      </template>

      <template v-slot:item.hits="{ item }">
        <div
          v-if="item.hits && item.hits.length"
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
          class="no-print"
        >
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              data-testid="eventsContestantsTableRowMenuButton"
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
              :disabled="!item.hits || !item.hits.length"
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

    <div class="flex items-center py-4 absolute bottom-0 left-0">
      <div class="flex items-center">
        <div
          class="mr-4"
          style="font-size:12px;"
        >
          {{ $t("groupBy") }}:
        </div>

        <v-btn-toggle
          v-model="eventsContestantsResultsTableGroupBy"
          active-class="primary"
          color="white"
        >
          <v-btn
            text
            small
            :value="[]"
            data-testid="eventsContestantsResultsTableGroupByNoneButton"
          >
            {{ $t("none") }}
          </v-btn>
          <v-btn
            text
            small
            value="weaponId"
            data-testid="eventsContestantsResultsTableGroupByWeaponButton"
          >
            {{ $t("weapon") }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @TODO: reverse sorting when grouped by weapon
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import TableFilterSearch from "@/components/TableFilterSearch.vue"
import TableFilterSelect from "@/components/TableFilterSelect.vue"

export default Vue.extend({
  name: "EventsContestantsResultsListTable",

  components: {
    TableFilterSearch,
    TableFilterSelect
  },

  props: {
    event: { type: Object, required: true }
  },

  data() {
    return {
      eventsContestantsTableFilter: {
        weaponIds: [],
        clubIds: []
      },
      eventsContestantsResultsSearchFilter: "",
      eventsContestantsResultsTableGroupBy: "weaponId",
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
        filter: this.clubFilter,
        sortable: false
      }, {
        value: "weapon.name",
        text: this.$t("columnLabelWeapon"),
        filter: this.weaponFilter,
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
    },

    clubFilter(_, __, { clubMember }): boolean {
      return this.eventsContestantsTableFilter.clubIds.length
        ? this.eventsContestantsTableFilter.clubIds.includes(clubMember.clubId)
        : true
    },

    weaponFilter(_, __, { weaponId }): boolean {
      return this.eventsContestantsTableFilter.weaponIds.length
        ? this.eventsContestantsTableFilter.weaponIds.includes(weaponId)
        : true
    },
  }
})
</script>
