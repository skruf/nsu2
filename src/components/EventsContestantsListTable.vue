<i18n>
{
  "en": {
    "columnLabelNumber": "Nr",
    "columnLabelClubMember": "Contestant",
    "columnLabelClub": "Club",
    "columnLabelWeapon": "Weapon",
    "columnLabelCalibre": "Calibre",
    "columnLabelLane": "Lane",
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
    "columnLabelLane": "Stand",
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ny?",
    "eventsContestantsSearchFilterPlaceholder": "Søk etter deltakere",
    "removeSelected": "Fjern valgte"
  }
}
</i18n>

<template>
  <div class="relative">
    <div class="table-controls mb-0">
      <events-contestants-list-table-filters
        v-model="eventsContestantsTableFilter"
        :contestants="eventsContestantsStateList"
        :loading="eventsContestantsStateListIsLoading"
      />
    </div>

    <div class="table-controls mt-0 pt-0">
      <table-filter-search
        v-model="eventsContestantsSearchFilter"
        :label="$t('eventsContestantsSearchFilterPlaceholder')"
        data-testid="eventsContestantsSearchFilterInput"
      />

      <div>
        <v-btn
          class="mr-5"
          color="primary"
          data-testid="eventsContestantsListTableOpenManageDialogButton"
          @click.stop="eventsContestantsManageDialogOpen"
        >
          {{ $t("tablePlaceholderButton") }}
        </v-btn>

        <v-btn
          color="primary"
          data-testid="eventsContestantsListTableOpenManageDialogButton"
          @click.stop="eventsContestantsManageDialogOpen"
        >
          Opprett medlem
        </v-btn>
      </div>
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
      sort-by="number"
      data-testid="eventsContestantsListTable"
    >
      <template v-slot:item.clubMember.firstName="{ item }">
        <span class="mr-2 text-xs font-semibold py-1 px-2 rounded-full bg-gray-200">
          {{ item.number }}
        </span>

        {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
      </template>

      <template v-slot:item.clubMember.club.shortName="{ item }">
        <router-link :to="`/clubs/${item.clubMember.club.id}`">
          {{ item.clubMember.club.shortName }}
        </router-link>
      </template>

      <template v-slot:item.weapon.name="{ item }">
        {{ item.weapon.name }} ({{ item.weapon.distance }}m) - {{ item.weapon.id }}
      </template>

      <template v-slot:item.calibre="{ item }">
        {{ item.calibre }}mm
      </template>

      <template v-slot:item.stand="{ item }">
        <template v-if="item.division">
          <span class="mr-2 text-xs font-semibold py-1 px-2 rounded-full bg-gray-200">
            {{ item.stand }}
          </span>

          {{ item.division.name }}, {{ item.division.day | moment("DD/MMM") }} kl. {{ item.division.time }}
        </template>

        <template v-else>
          Ingen tildelt
        </template>
      </template>

      <template v-slot:group.header="{ items: { 0: c } }">
        <template v-if="eventsContestantsTableGroupBy === 'clubMemberId'">
          <td
            class="text-start"
            colspan="100%"
            data-testid="eventsContestantsTableGroupByContestantTd"
          >
            <div class="flex items-center">
              <span class="font-bold">
                Deltaker: #{{ c.number }} {{ c.clubMember.firstName }} {{ c.clubMember.lastName }}
              </span>

              <span class="text-gray-600 ml-1">
                {{ c.clubMember.club.name }}
              </span>
            </div>
          </td>
        </template>

        <template v-if="eventsContestantsTableGroupBy === 'divisionId'">
          <td
            class="text-start"
            colspan="100%"
            data-testid="eventsContestantsTableGroupByDivisionTd"
          >
            <div v-if="c.division">
              <span class="font-bold">
                {{ $t("division") }}: {{ c.division.distance }} meter
              </span>

              <span class="text-gray-600 ml-1">
                {{ c.division.name }}, {{ c.division.day | moment("DD/MMM") }} kl. {{ c.division.time }}
              </span>
            </div>

            <div
              v-else
              class="font-bold"
            >
              {{ $t("division") }}: ikke tildelt
            </div>
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

    <div class="flex items-center py-4 absolute bottom-0 left-0">
      <div class="flex items-center">
        <div
          class="mr-4"
          style="font-size:12px;"
        >
          {{ $t("groupBy") }}:
        </div>

        <v-btn-toggle
          v-model="eventsContestantsTableGroupBy"
          active-class="primary"
          color="white"
        >
          <v-btn
            text
            small
            :value="[]"
            data-testid="eventsContestantsTableGroupByNoneButton"
          >
            {{ $t("none") }}
          </v-btn>
          <v-btn
            text
            small
            value="clubMemberId"
            data-testid="eventsContestantsTableGroupByContestantButton"
          >
            {{ $t("contestant") }}
          </v-btn>
          <v-btn
            text
            small
            value="divisionId"
            data-testid="eventsContestantsTableGroupByDivisionButton"
          >
            {{ $t("division") }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import TableFilterSearch from "@/components/TableFilterSearch.vue"
import EventsContestantsListTableFilters from "@/components/EventsContestantsListTableFilters.vue"

export default Vue.extend({
  name: "EventsContestantsListTable",

  components: {
    TableFilterSearch,
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
        value: "clubMember.firstName",
        text: this.$t("columnLabelClubMember"),
        filter: this.clubMemberFilter
      }, {
        value: "clubMember.club.shortName",
        text: this.$t("columnLabelClub"),
        filter: this.clubFilter
      }, {
        value: "weapon.name",
        text: this.$t("columnLabelWeapon"),
        filter: this.weaponFilter
      }, {
        value: "calibre",
        text: this.$t("columnLabelCalibre")
      }, {
        value: "stand",
        text: this.$t("columnLabelLane")
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

  watch: {
    event: {
      immediate: true,
      handler: function(): void {
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
})
</script>
