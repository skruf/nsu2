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
    "eventsContestantsSearchFilterPlaceholder": "Search for contestants by first or last name",
    "removeSelected": "Remove selected"
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
    "eventsContestantsSearchFilterPlaceholder": "Søk etter deltaker med fornavn eller etternavn",
    "removeSelected": "Fjern valgte"
  }
}
</i18n>

<template>
  <div>
    <div class="px-5 no-print">
      <div class="flex justify-between items-center mb-4">
        <div class="w-full max-w-md">
          <v-text-field
            v-model="eventsContestantsSearchFilter"
            :label="$t('eventsContestantsSearchFilterPlaceholder')"
            data-testid="eventsContestantsSearchFilterInput"
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
          data-testid="eventsContestantsListTableOpenManageDialogButton"
          @click.stop="eventsContestantsManageDialogOpen"
        >
          {{ $t("tablePlaceholderButton") }}
        </v-btn>
      </div>

      <div class="my-4 flex items-center">
        <div class="mr-4 text-sm">
          {{ $t("groupBy") }}
        </div>

        <v-btn-toggle v-model="eventsContestantsTableGroupBy">
          <v-btn
            small
            :value="[]"
            data-testid="eventsContestantsTableGroupByNoneButton"
          >
            {{ $t("none") }}
          </v-btn>
          <v-btn
            small
            value="clubMemberId"
            data-testid="eventsContestantsTableGroupByContestantButton"
          >
            {{ $t("contestant") }}
          </v-btn>
          <v-btn
            small
            value="divisionId"
            data-testid="eventsContestantsTableGroupByDivisionButton"
          >
            {{ $t("division") }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <!-- :custom-filter="customFilter" -->
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
      :items-per-page="150"
      data-testid="eventsContestantsListTable"
    >
      <template v-slot:item.clubMember.firstName="{ item }">
        <!-- small -->
        <!-- <v-chip
          outlined
          class="bg-gray-200"
        > -->
        <span class="mr-2 text-xs font-semibold py-1 px-2 rounded-full bg-gray-200">
          {{ item.number }}
        </span>
        <!-- <v-avatar
          size="24"
          class="bg-black text-white mr-2 font-bold text-xs"
        >
          {{ item.number }}
        </v-avatar> -->

        {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
        <!-- </v-chip> -->

        <!-- <span data-testid="eventsContestantsListTableColumnContestant">
        </span> -->
      </template>

      <template v-slot:item.weapon.name="{ item }">
        {{ item.weapon.name }}
      </template>

      <template v-slot:item.calibre="{ item }">
        {{ item.calibre }}
      </template>

      <template v-slot:item.stand="{ item }">
        <template v-if="item.division">
          {{ item.stand }}
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
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              :disabled="!eventsContestantsSelection.length"
              data-testid="eventsContestantsListTableHeaderDropdown"
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
import Vue from "vue"
import { mapActions, mapState } from "vuex"

export default Vue.extend({
  name: "EventsContestantsListTable",

  props: {
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      eventsContestantsSearchFilter: "",
      eventsContestantsTableGroupBy: [],
      eventsContestantsSelection: [],
      eventsContestantsHeaders: [{
      //   value: "number",
      //   text: this.$t("columnLabelNumber")
      // }, {
        value: "clubMember.firstName",
        text: this.$t("columnLabelClubMember"),
        // filter: (value: any, search: string, item: any) => {
        //   if(!search || search === "" || !value || !value.clubMember) return true
        //   if(
        //     value.clubMember.firstName.contains(search) ||
        //     value.clubMember.lastName.contains(search)
        //   ) {
        //     return true
        //   } else {
        //     return false
        //   }
      }, {
        value: "clubMember.club.shortName",
        text: this.$t("columnLabelClubName")
      }, {
        value: "weapon.name",
        text: this.$t("columnLabelWeapon")
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
    // customFilter(value, search, item) {
    //   search = search.toString().toLowerCase()
    //   return items.filter((row) => filter(row.type, search))
    //   return items
    // },

    ...mapActions("events/contestants", {
      eventsContestantsActionsList: "list"
    }),

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
