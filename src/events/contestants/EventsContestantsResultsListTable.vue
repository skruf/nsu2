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

<style>
.hits-column {
  @apply mx-auto w-full;
  max-width: 24rem !important;
}
.results-table td:not(.table-group-header):nth-child(3),
.results-table th:not(.table-group-header):nth-child(3) {
  display: none;
}
@media print {
  .results-table td:not(.table-group-header):nth-child(3),
  .results-table th:not(.table-group-header):nth-child(3) {
    display: table-cell;
  }
  .results-table.is-grouped td:not(.table-group-header):nth-child(4),
  .results-table.is-grouped th:not(.table-group-header):nth-child(4),
  .results-table.not-grouped td:not(.table-group-header):nth-child(5),
  .results-table.not-grouped th:not(.table-group-header):nth-child(5) {
    display: none;
  }
  .results-hits {
    display: block !important;
  }
  html .results-table .result-club {
    margin-left: 0 !important;
  }
}
</style>

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
        class="mr-5 flex-none"
      />

      <v-form
        ref="filterForm"
        class="flex items-center ml-auto flex-none"
      >
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
      :class="{
        'is-grouped': isntGrouped,
        'not-grouped': !isntGrouped
      }"
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
      sort-by="total"
      data-testid="eventsContestantsResultsListTable"
      class="results-table"
    >
      <template v-slot:item.rank="{ item }">
        <div class="font-bold text-black">
          {{
            item.hits.length &lt; 10
              ? item.hits.length === 0 ? "DNS" : "DNF"
              : item.rank
          }}
        </div>
      </template>

      <template v-slot:item.number="{ item }">
        <div class="flex items-center">
          <avatar
            class="print:hidden"
            :colour="item.colour"
            :value="item.number"
          />
          <div class="ml-2 hidden print:ml-0 print:inline-block result-club">
            {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
          </div>
        </div>
      </template>

      <template v-slot:item.clubMember.club.shortName="{ item }">
        {{ item.clubMember.club.shortName }}
      </template>

      <template v-slot:item.weaponId="{ item }">
        {{ item.weapon.name }}
      </template>

      <template v-slot:item.divisionId="{ item }">
        <events-divisions-label
          :division="item.division"
        />
      </template>

      <template v-slot:item.hits="{ item }">
        <div class="hits-column">
          <v-btn
            v-if="item.hits && item.hits.length"
            text
            small
            color="primary"
            class="block px-0 results-hits"
            data-testid="eventsContestantsResultsInputDialogOpen"
            @click.stop="eventsContestantsResultsInputDialogOpen(item)"
          >
            <div class="flex justify-start">
              <span
                v-for="h in item.hits"
                :key="h.hit"
                class="hit"
              >
                {{ h.sum }}
              </span>
            </div>
          </v-btn>

          <v-btn
            v-else
            text
            small
            color="primary"
            class="block px-2"
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

      <template v-slot:item.measurement="{ item }">
        <div class="text-center">
          <div
            v-if="!!item.measurement"
            class="hidden print:block"
          >
            {{ item.measurement }}<small class="-mb-1">mm</small>
          </div>

          <v-btn
            text
            small
            color="primary"
            data-testid="eventsContestantsResultsMeasurementOpenButton"
            @click="eventsContestantsResultsMeasurementOpen(item)"
          >
            <template v-if="!!item.measurement">
              {{ item.measurement }}<small class="-mb-1">mm</small>
            </template>

            <template v-else>
              <v-icon small>
                add
              </v-icon>
            </template>
          </v-btn>
        </div>
      </template>

      <template v-slot:header.hits>
        <div class="hits-column flex-none flex justify-start">
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
            <events-divisions-label
              :division="c.division"
              :prefix="true"
            />
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
    </v-data-table>

    <events-contestants-measurement
      :shown.sync="eventsContestantsResultsMeasurementShown"
    />
  </div>
</template>

<script lang="ts">
import { mapState, mapMutations } from "vuex"
import Avatar from "@/components/Avatar.vue"
import EventsContestantsMeasurement
  from "./EventsContestantsMeasurement.vue"
import EventsContestantsFilterDivisions
  from "./EventsContestantsFilterDivisions.vue"
import EventsContestantsFilterWeapons
  from "./EventsContestantsFilterWeapons.vue"
import EventsDivisionsLabel
  from "../divisions/EventsDivisionsLabel.vue"

export default {
  name: "EventsContestantsResultsListTable",

  components: {
    EventsContestantsMeasurement,
    Avatar,
    EventsContestantsFilterDivisions,
    EventsContestantsFilterWeapons,
    EventsDivisionsLabel
  },

  props: {
    event: { type: Object, required: true }
  },

  data() {
    return {
      eventsContestantsResultsMeasurementShown: false,
      eventsContestantsTableFilter: {
        weaponIds: [],
        clubIds: [],
        divisionIds: []
      },
      eventsContestantsResultsSearchFilter: "",
      eventsContestantsResultsTableGroupBy: "weaponId",
      eventsContestantsResultsSelection: [],
      eventsContestantsResultsHeaders: [{
        value: "rank",
        text: "Plass",
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
        value: "hits",
        text: "Treff",
        sortable: false
      }, {
        value: "total",
        text: "Totalt",
        sortable: false,
        align: "center"
      }, {
        value: "measurement",
        text: "Mål",
        sortable: false,
        align: "center",
        width: 80
      }]
    }
  },

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsStateListIsLoading: "listIsLoading",
      eventsContestantsStateList: "list"
    }),

    isntGrouped(): boolean {
      return !!this.eventsContestantsResultsTableGroupBy
    },

    results() {
      const groupedResults = []

      const sorted = [ ...this.eventsContestantsStateList ]
        .sort((a, b) => {
          if(a.total > 0 && b.total > 0 && a.total === b.total) {
            const aHitCount: Record<string, number> = {}
            a.hits.forEach(({ sum }) => {
              if(!aHitCount[sum]) aHitCount[sum] = 1
              else aHitCount[sum] += 1
            })

            const bHitCount: Record<string, number> = {}
            b.hits.forEach(({ sum }) => {
              if(!bHitCount[sum]) bHitCount[sum] = 1
              else bHitCount[sum] += 1
            })

            const aBiggestHit = Math.max(...Object.keys(aHitCount).map(Number))
            const bBiggestHit = Math.max(...Object.keys(bHitCount).map(Number))

            if(bBiggestHit === aBiggestHit) {
              const measurementDelta = b.measurement - a.measurement

              return measurementDelta === 0
                ? bHitCount[bBiggestHit] - aHitCount[aBiggestHit]
                : measurementDelta
            }

            return bBiggestHit - aBiggestHit
          }

          return b.total - a.total
        })

      // .reduce((acc, curr, index, arr) => {
      //   const counts: Record<string, number> = {}
      //   curr.hits.forEach(({ sum }) => {
      //     if(!counts[sum]) counts[sum] = 1
      //     else counts[sum] += 1
      //   })
      // }, [])

      if(this.eventsContestantsResultsTableGroupBy === []) return sorted

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

    eventsContestantsResultsMeasurementOpen(contestant): void {
      this.eventsContestantsResultsMeasurementShown = true
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
