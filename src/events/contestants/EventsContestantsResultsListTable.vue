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
        single-line
        dense
        outlined
        hide-details
        clearable
        append-icon="expand_more"
        class="mr-5"
      />

      <v-form
        ref="filterForm"
        class="flex items-center ml-auto"
      >
        <events-contestants-filter-clubs
          v-model="eventsContestantsTableFilter.clubIds"
          class="mr-5"
          :contestants="eventsContestantsStateList"
          :loading="eventsContestantsStateListIsLoading"
        />

        <events-contestants-filter-weapons
          v-model="eventsContestantsTableFilter.weaponIds"
          :contestants="eventsContestantsStateList"
          :loading="eventsContestantsStateListIsLoading"
        />

        <events-contestants-filter-divisions
          v-model="eventsContestantsTableFilter.divisionIds"
          class="ml-5"
          :contestants="eventsContestantsStateList"
          :loading="eventsContestantsStateListIsLoading"
        />
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
          <avatar
            :colour="item.colour"
            :value="item.number"
          />
          <div class="ml-2 hidden print:inline-block">
            {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
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
      </template>

      <template v-slot:item.divisionId="{ item }">
        <template v-if="item.division && item.division.day">
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
            {{ item.notes ? item.notes.length : 0 }} notater
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
        <div class="font-bold text-black flex items-center justify-center">
          <v-img
            v-if="item.rank === 1"
            src="https://image.flaticon.com/icons/svg/340/340334.svg"
            max-width="22px"
          />

          <v-img
            v-if="item.rank === 2"
            src="https://image.flaticon.com/icons/svg/340/340333.svg"
            max-width="22px"
          />

          <v-img
            v-if="item.rank === 3"
            src="https://image.flaticon.com/icons/svg/340/340335.svg"
            max-width="22px"
          />

          <template v-if="item.rank > 3 || item.rank === 0">
            {{ item.rank }}
          </template>
        </div>
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
              Deltaker:
              <avatar
                class="ml-2"
                :colour="c.colour"
                :value="c.number"
              />
              <div class="ml-2 hidden print:inline-block">
                {{ c.clubMember.firstName }} {{ c.clubMember.lastName }}
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
            <template v-if="c.division && c.division.day">
              {{ $t("division") }}: {{ c.division.day | moment("DD/MMM") }} - {{ c.division.distance }} meter
            </template>

            <template v-else>
              {{ $t("division") }}: Ikke tildelt
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
import Avatar from "@/components/Avatar.vue"
import EventsContestantsNotes
  from "./EventsContestantsNotes.vue"
import EventsContestantsFilterDivisions
  from "./EventsContestantsFilterDivisions.vue"
import EventsContestantsFilterClubs
  from "./EventsContestantsFilterClubs.vue"
import EventsContestantsFilterWeapons
  from "./EventsContestantsFilterWeapons.vue"

export default {
  name: "EventsContestantsResultsListTable",

  components: {
    EventsContestantsNotes,
    Avatar,
    EventsContestantsFilterDivisions,
    EventsContestantsFilterClubs,
    EventsContestantsFilterWeapons
  },

  props: {
    event: { type: Object, required: true }
  },

  data() {
    return {
      eventsContestantsResultsNotesShown: false,
      eventsContestantsTableFilter: {
        weaponIds: [],
        clubIds: [],
        divisionIds: []
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
        filter: this.divisionFilter,
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

    eventsContestantsResultsNotesOpen(contestant): void {
      this.eventsContestantsResultsNotesShown = true
      this.eventsContestantsMutationsSelect(contestant)
    },

    clubFilter(_, __, { clubMember }): boolean {
      return this.eventsContestantsTableFilter.clubIds.length
        ? this.eventsContestantsTableFilter.clubIds.includes(
          clubMember.clubId || "Ikke tildelt"
        )
        : true
    },

    weaponFilter(_, __, { weaponId }): boolean {
      return this.eventsContestantsTableFilter.weaponIds.length
        ? this.eventsContestantsTableFilter.weaponIds.includes(weaponId)
        : true
    },

    divisionFilter(_, __, { divisionId }): boolean {
      return this.eventsContestantsTableFilter.divisionIds.length
        ? this.eventsContestantsTableFilter.divisionIds.includes(
          divisionId || "Ikke tildelt"
        )
        : true
    }
  }
}
</script>
