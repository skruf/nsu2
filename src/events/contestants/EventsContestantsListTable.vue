<i18n>
{
  "en": {
    "columnLabelNumber": "Nr",
    "columnLabelClubMember": "Contestant",
    "columnLabelClub": "Club",
    "columnLabelWeapon": "Weapon",
    "columnLabelCalibre": "Calibre",
    "columnLabelDivision": "Division",
    "columnLabelStand": "Lane",
    "columnLabelTime": "Time",
    "tablePlaceholderText": "No participants yet.",
    "tablePlaceholderButton": "Add new?",
    "eventsContestantsSearchFilterPlaceholder": "Search for contestants",
    "removeSelected": "Remove selected"
  },
  "no": {
    "columnLabelNumber": "Nr",
    "columnLabelClubMember": "Deltaker",
    "columnLabelClub": "Klubb",
    "columnLabelWeapon": "Våpen",
    "columnLabelCalibre": "Kaliber",
    "columnLabelDivision": "Standplassliste",
    "columnLabelStand": "Bane",
    "columnLabelTime": "Tid",
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ny?",
    "eventsContestantsSearchFilterPlaceholder": "Søk etter deltakere",
    "removeSelected": "Fjern valgte"
  }
}
</i18n>

<template>
  <div class="container relative">
    <div class="table-controls">
      <!-- <table-filter-search
        v-model="eventsContestantsSearchFilter"
        :label="$t('eventsContestantsSearchFilterPlaceholder')"
        data-testid="eventsContestantsSearchFilterInput"
        class="mr-5"
      /> -->

      <v-select
        v-model="eventsContestantsTableGroupBy"
        :label="$t('groupBy')"
        :items="[
          { l: $t('contestant'), v: 'number' },
          { l: $t('division'), v: 'divisionId' },
          { l: $t('weapon'), v: 'weaponId' }
        ]"
        item-text="l"
        item-value="v"
        data-testid="eventsContestantsTableGroupBySelect"
        single-line
        dense
        outlined
        hide-details
        clearable
        append-icon="expand_more"
        class="mr-5"
      />

      <events-contestants-list-table-filters
        v-model="eventsContestantsTableFilter"
        :contestants="eventsContestantsStateList"
        :loading="eventsContestantsStateListIsLoading"
      />

      <v-btn
        class="mx-5"
        color="white"
        data-testid="eventsContestantsListTableOpenManageDialogButton"
        @click.stop="eventsContestantsManageDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        {{ $t("tablePlaceholderButton") }}
      </v-btn>

      <v-btn
        color="white"
        data-testid="eventsContestantsListTableOpenManageDialogButton"
        @click.stop="eventsContestantsManageDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        Medlem
      </v-btn>
    </div>

    <v-data-table
      v-model="eventsContestantsSelection"
      :class="{ 'is-grouped': isntGrouped }"
      :headers="eventsContestantsHeaders"
      :items="eventsContestantsStateListIsLoading ? [] : eventsContestantsStateList"
      :search="eventsContestantsSearchFilter"
      :loading="eventsContestantsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :show-group-by="false"
      :group-by="eventsContestantsTableGroupBy"
      :items-per-page="100"
      :headers-length="8"
      sort-by="time"
      data-testid="eventsContestantsListTable"
      class="no-print-first-td no-print-last-td"
    >
      <template v-slot:item.number="{ item }">
        #{{ item.number }} - {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
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

      <template v-slot:item.calibre="{ item }">
        {{ item.calibre }}mm
      </template>

      <template v-slot:item.divisionId="{ item }">
        <template v-if="item.division">
          {{ item.division.day | moment("ddd, DD/MMM") }} - {{ item.division.distance }} meter
        </template>
      </template>

      <template v-slot:item.stand="{ item }">
        <template v-if="item.stand">
          {{ item.stand }}
        </template>
      </template>

      <template v-slot:item.time="{ item }">
        <template v-if="item.time">
          kl. {{ item.time }}
        </template>
      </template>

      <template v-slot:group.header="{ items: { 0: c } }">
        <template v-if="eventsContestantsTableGroupBy === 'number'">
          <td
            class="table-group-header"
            colspan="100%"
            data-testid="eventsContestantsTableGroupByContestantTd"
          >
            Deltaker: #{{ c.number }} - {{ c.clubMember.firstName }} {{ c.clubMember.lastName }}
          </td>
        </template>

        <template v-if="eventsContestantsTableGroupBy === 'divisionId'">
          <td
            class="table-group-header"
            colspan="100%"
            data-testid="eventsContestantsTableGroupByDivisionTd"
          >
            <template v-if="c.division">
              {{ $t("division") }}: {{ c.division.day | moment("DD/MMM") }} - {{ c.division.distance }} meter
            </template>

            <template v-else>
              {{ $t("division") }}: ikke tildelt
            </template>
          </td>
        </template>

        <template v-if="eventsContestantsTableGroupBy === 'weaponId'">
          <td
            class="table-group-header"
            colspan="100%"
            data-testid="eventsContestantsTableGroupByWeaponTd"
          >
            Våpen: {{ c.weapon.name }}
          </td>
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu
          bottom
          left
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
              data-testid="eventsContestantsEditDialogOpenListItem"
              @click.stop="eventsContestantsEditDialogOpen(item)"
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

            <v-divider />

            <v-list-item
              data-testid="eventsContestantsRemoveOneListItem"
              @click.stop="eventsContestantsRemoveOne(item)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon color="red">
                  delete_forever
                </v-icon>
                <span class="ml-2 red--text">
                  {{ $t("remove") }}
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
              :disabled="!eventsContestantsSelection.length"
              data-testid="eventsContestantsListTableHeaderDropdown"
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
              data-testid="eventsContestantsListTableHeaderDropdownRemoveMany"
              @click.stop="eventsContestantsRemoveMany(eventsContestantsSelection)"
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
// import Vue from "vue"
import { mapState } from "vuex"
import EventsContestantsListTableFilters
  from "./EventsContestantsListTableFilters.vue"

export default {
  name: "EventsContestantsListTable",

  components: {
    EventsContestantsListTableFilters
  },

  props: {
    event: { type: Object, required: true }
  },

  data() {
    return {
      eventsContestantsTableFilter: {
        clubMemberIds: [],
        weaponIds: [],
        clubIds: []
      },
      eventsContestantsSearchFilter: "",
      eventsContestantsTableGroupBy: [],
      eventsContestantsSelection: [],
      eventsContestantsHeaders: [{
        value: "number",
        text: this.$t("columnLabelClubMember"),
        filter: this.clubMemberFilter
      }, {
        value: "clubMember.club.shortName",
        text: this.$t("columnLabelClub"),
        filter: this.clubFilter
      }, {
        value: "weaponId",
        text: this.$t("columnLabelWeapon"),
        filter: this.weaponFilter
      }, {
        value: "calibre",
        text: this.$t("columnLabelCalibre")
      }, {
        value: "divisionId",
        text: this.$t("columnLabelDivision")
      }, {
        value: "stand",
        text: this.$t("columnLabelStand")
      }, {
        value: "time",
        text: this.$t("columnLabelTime")
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
      return this.eventsContestantsTableGroupBy === []
    }
  },

  methods: {
    clubMemberFilter(_, __, { clubMemberId }): boolean {
      return this.eventsContestantsTableFilter.clubMemberIds.length
        ? this.eventsContestantsTableFilter.clubMemberIds.includes(clubMemberId)
        : true
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

    eventsContestantsManageDialogOpen(): void {
      this.$emit("eventsContestantsManageDialogOpen")
    },

    eventsContestantsEditDialogOpen(contestant): void {
      this.$emit("eventsContestantsEditDialogOpen", contestant)
    },

    eventsContestantsRemoveOne(contestant): void {
      this.$emit("eventsContestantsRemoveOne", contestant)
    },

    eventsContestantsRemoveMany(contestants): void {
      this.$emit("eventsContestantsRemoveMany", contestants)
    }
  }
}
</script>