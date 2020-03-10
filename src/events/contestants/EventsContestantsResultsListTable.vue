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
    "eventsContestantsResultsInputDialogOpen": "Input results",
    "editResults": "Edit results"
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
    "eventsContestantsResultsInputDialogOpen": "Angi resultater",
    "editResults": "Rediger resultater"
  }
}
</i18n>

<template>
  <div class="relative container">
    <div class="table-controls">
      <v-select
        v-model="eventsContestantsResultsTableGroupBy"
        :label="$t('groupBy')"
        :items="[
          { l: $t('contestant'), v: 'number' },
          { l: $t('division'), v: 'divisionId' },
          { l: $t('weapon'), v: 'weaponId' }
        ]"
        item-text="l"
        item-value="v"
        data-testid="eventsContestantsResultsTableGroupBySelect"
        class="flex-1 mr-5 max-w-sm"
        single-line
        dense
        outlined
        hide-details
        clearable
        append-icon="expand_more"
      />

      <v-form
        ref="filterForm"
        class="flex items-center ml-auto max-w-xl"
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
      :items="results"
      :search="eventsContestantsResultsSearchFilter"
      :loading="eventsContestantsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-group-by="false"
      :group-by="eventsContestantsResultsTableGroupBy"
      :sort-desc="true"
      :must-sort="true"
      :group-desc="true"
      :items-per-page="100"
      :headers-length="6"
      sort-by="total"
      data-testid="eventsContestantsResultsListTable"
      class="no-print-last-td results-table"
    >
      <template v-slot:item.number="{ item }">
        <div class="flex items-center">
          #{{ item.number }}
          <div class="ml-2 hidden print:inline-block">
            - {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
          </div>
        </div>
      </template>

      <template v-slot:item.clubMember.club.shortName="{ item }">
        <router-link :to="`/clubs/${item.clubMember.club.id}`">
          {{ item.clubMember.club.shortName }}
        </router-link>
      </template>

      <template v-slot:item.weaponId="{ item }">
        {{ item.weapon.name }} ({{ item.weapon.condition.charAt(0) }})
        <!-- ({{ item.weapon.distance }}m) - {{ item.weapon.id }} -->
      </template>

      <template v-slot:item.divisionId="{ item }">
        <template v-if="item.division">
          {{ item.division.day | moment("ddd, DD/MMM") }} - {{ item.division.distance }} meter
        </template>
      </template>

      <template v-slot:item.notes="{ item }">
        <div class="-mx-3">
          <v-btn
            text
            small
            color="primary"
            class="no-print"
            data-testid="eventsContestantsResultsNotesOpenButton"
            @click="eventsContestantsResultsNotesOpen(item)"
          >
            {{ item.notes.length }} notater
          </v-btn>
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

      <template v-slot:item.total="{ item }">
        <span class="font-bold text-black">
          {{ item.total }}
        </span>
      </template>

      <template v-slot:item.rank="{ item }">
        <span class="font-bold text-black">
          {{ item.rank }}
        </span>
      </template>

      <template v-slot:header.hits>
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
        <template v-if="eventsContestantsResultsTableGroupBy === 'number'">
          <td
            class="table-group-header"
            colspan="100%"
            data-testid="eventsContestantsResultsTableGroupByContestantTd"
          >
            <div class="flex items-center">
              Deltaker: {{ c.number }}
              <div class="ml-2 hidden print:inline-block">
                - {{ c.clubMember.firstName }} {{ c.clubMember.lastName }}
              </div>
            </div>
          </td>
        </template>

        <template v-if="eventsContestantsResultsTableGroupBy === 'divisionId'">
          <td
            class="table-group-header"
            colspan="100%"
            data-testid="eventsContestantsResultsTableGroupByDivisionTd"
          >
            <template v-if="c.division">
              {{ $t("division") }}: {{ c.division.day | moment("DD/MMM") }} - {{ c.division.distance }} meter
            </template>

            <template v-else>
              {{ $t("division") }}: ikke tildelt
            </template>
          </td>
        </template>

        <template v-if="eventsContestantsResultsTableGroupBy === 'weaponId'">
          <td
            class="table-group-header"
            colspan="100%"
            data-testid="eventsContestantsResultsTableGroupByWeaponTd"
          >
            Våpen: {{ c.weapon.name }}
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
                  {{ $t("editResults") }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <events-contestants-notes
      :shown.sync="eventsContestantsResultsNotesShown"
    />
  </div>
</template>

<script lang="ts">
import { mapState, mapMutations } from "vuex"
import TableFilterSelect
  from "@/components/TableFilterSelect.vue"
import EventsContestantsNotes
  from "./EventsContestantsNotes.vue"

export default {
  name: "EventsContestantsResultsListTable",

  components: {
    TableFilterSelect,
    EventsContestantsNotes
  },

  props: {
    event: { type: Object, required: true }
  },

  data() {
    return {
      eventsContestantsResultsNotesShown: false,
      eventsContestantsTableFilter: {
        weaponIds: [],
        clubIds: []
      },
      eventsContestantsResultsSearchFilter: "",
      eventsContestantsResultsTableGroupBy: "weaponId",
      eventsContestantsResultsSelection: [],
      eventsContestantsResultsHeaders: [{
        value: "number",
        text: "Deltaker",
        sortable: false
      }, {
        value: "clubMember.club.shortName",
        text: this.$t("columnLabelClubName"),
        filter: this.clubFilter,
        sortable: false
      }, {
        value: "weaponId",
        text: this.$t("columnLabelWeapon"),
        filter: this.weaponFilter,
        sortable: false
      }, {
        value: "divisionId",
        text: "Standplassliste",
        sortable: false
      }, {
        value: "notes",
        text: "Notater",
        sortable: false
      }, {
        value: "hits",
        text: "Treff",
        sortable: false,
        align: "right"
      }, {
        value: "total",
        text: "Totalt",
        sortable: false,
        align: "right"
      }, {
        value: "rank",
        text: "Rank",
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
    },

    results() {
      const groupedResults = []

      const sorted = [ ...this.eventsContestantsStateList ]
        .sort((a, b) => b.total - a.total)

      if(this.isntGrouped) return sorted

      const grouped = sorted.reduce((groups, contestant) => {
        const groupBy = contestant[this.eventsContestantsResultsTableGroupBy]
        if(!groups[groupBy]) groups[groupBy] = []
        groups[groupBy].push(contestant)
        return groups
      }, {})

      for(const group in grouped) {
        grouped[group].forEach((contestant, i) => {
          groupedResults.push({
            ...contestant,
            rank: contestant.total > 0 ? i + 1 : 0
          })
        })
      }

      return groupedResults
    }
  },

  methods: {
    ...mapMutations("events/contestants", {
      eventsContestantsMutationsSelect: "SET_SELECTED"
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

    eventsContestantsResultsNotesOpen(contestant): void {
      this.eventsContestantsResultsNotesShown = true
      this.eventsContestantsMutationsSelect(contestant)
    }
  }
}
</script>
