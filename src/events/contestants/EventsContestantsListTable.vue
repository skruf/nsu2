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
    "tablePlaceholderText": "No contestants yet.",
    "addContestant": "Add contestant",
    "eventsContestantsSearchFilterPlaceholder": "Search for contestants",
    "removeSelected": "Remove selected",
    "createMember": "Create member"
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
    "addContestant": "Legg til deltaker",
    "eventsContestantsSearchFilterPlaceholder": "Søk etter deltakere",
    "removeSelected": "Fjern valgte",
    "createMember": "Opprett medlem"
  }
}
</i18n>

<template>
  <div class="container relative">
    <div class="table-controls">
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

      <v-form
        ref="filterForm"
        class="flex items-center ml-auto"
      >
        <events-contestants-filter-members
          v-model="eventsContestantsTableFilter.clubMemberIds"
          :contestants="eventsContestantsStateList"
          :loading="eventsContestantsStateListIsLoading"
        />

        <events-contestants-filter-clubs
          v-model="eventsContestantsTableFilter.clubIds"
          class="mx-5"
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

      <v-btn
        class="ml-5"
        color="white"
        data-testid="eventsContestantsListTableOpenManageDialogButton"
        @click.stop="eventsContestantsCreateDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        {{ $t("addContestant") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="eventsContestantsSelection"
      :class="{ 'is-grouped': isntGrouped }"
      :headers="eventsContestantsHeaders"
      :items="eventsContestantsStateList"
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
        <avatar
          :colour="item.colour"
          :value="item.number"
        />
        {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
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
        <events-divisions-label
          :division="item.division"
        />
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
            Deltaker:
            <avatar
              class="mx-2"
              :colour="c.colour"
              :value="c.number"
            />
            {{ c.clubMember.firstName }} {{ c.clubMember.lastName }}
          </td>
        </template>

        <template v-if="eventsContestantsTableGroupBy === 'divisionId'">
          <td
            class="table-group-header"
            colspan="100%"
            data-testid="eventsContestantsTableGroupByDivisionTd"
          >
            <events-divisions-label
              :division="c.division"
              :prefix="true"
            />
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
import { mapState } from "vuex"
import Avatar from "@/components/Avatar.vue"
import EventsContestantsFilterDivisions
  from "./EventsContestantsFilterDivisions.vue"
import EventsContestantsFilterClubs
  from "./EventsContestantsFilterClubs.vue"
import EventsContestantsFilterWeapons
  from "./EventsContestantsFilterWeapons.vue"
import EventsContestantsFilterMembers
  from "./EventsContestantsFilterMembers.vue"
import EventsDivisionsLabel
  from "../divisions/EventsDivisionsLabel.vue"

export default {
  name: "EventsContestantsListTable",

  components: {
    Avatar,
    EventsContestantsFilterDivisions,
    EventsContestantsFilterClubs,
    EventsContestantsFilterWeapons,
    EventsContestantsFilterMembers,
    EventsDivisionsLabel
  },

  props: {
    event: { type: Object, required: true }
  },

  data() {
    return {
      eventsContestantsTableFilter: {
        clubMemberIds: [],
        weaponIds: [],
        clubIds: [],
        divisionIds: []
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
        text: this.$t("columnLabelDivision"),
        filter: this.divisionFilter
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
    },

    eventsContestantsCreateDialogOpen(): void {
      this.$emit("eventsContestantsCreateDialogOpen")
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
