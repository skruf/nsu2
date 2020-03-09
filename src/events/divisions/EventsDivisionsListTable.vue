<i18n>
{
  "en": {
    "columnLabelName": "Name",
    "columnLabelDay": "Day",
    "columnLabelTime": "Time",
    "columnLabelDistance": "Distance",
    "columnLabelStandsCount": "Lanes",
    "eventsDivisionsListTableNoDataText": "No participants yet.",
    "eventsDivisionsListTableCreateDialogOpenButton": "Add new?",
    "eventsDivisionsSearchFilterPlaceholder": "Search for divisions"
  },
  "no": {
    "columnLabelName": "Navn",
    "columnLabelDay": "Dag",
    "columnLabelTime": "Tid",
    "columnLabelDistance": "Distanse",
    "columnLabelStandsCount": "Plasser",
    "eventsDivisionsListTableNoDataText": "Ingen deltakere enda",
    "eventsDivisionsListTableCreateDialogOpenButton": "Legg til ny?",
    "eventsDivisionsSearchFilterPlaceholder": "Søk etter standplasslister"
  }
}
</i18n>

<template>
  <div>
    <div class="table-controls">
      <table-filter-search
        v-model="eventsDivisionsSearchFilter"
        :label="$t('eventsDivisionsSearchFilterPlaceholder')"
        data-testid="eventsDivisionsSearchFilterInput"
      />

      <v-btn
        color="primary"
        data-testid="eventsDivisionsListTableCreateDialogOpenButton"
        @click.stop="eventsDivisionsCreateDialogOpen"
      >
        {{ $t("eventsDivisionsListTableCreateDialogOpenButton") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="eventsDivisionsSelection"
      :headers="eventsDivisionsHeaders"
      :search="eventsDivisionsSearchFilter"
      :items="eventsDivisionsStateList"
      :loading="eventsDivisionsStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('eventsDivisionsListTableNoDataText')"
      data-testid="eventsDivisionsListTable"
      class="clickable"
      @click:row="eventsDivisionsListTableRowClick"
    >
      <template v-slot:item.name="{ item }">
        <div data-testid="eventsDivisionsListTableNameColumn">
          {{ item.name }}
        </div>
      </template>

      <template v-slot:item.day="{ item }">
        {{ item.day | moment("DD-MM-YYYY") }}
      </template>

      <template v-slot:item.distance="{ item }">
        {{ item.distance }} meter
      </template>

      <template v-slot:item.standsCount="{ item }">
        {{ item.contestantsCount }} / {{ item.standsCount }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu
          bottom
          left
        >
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              small
              icon
              data-testid="eventsDivisionsTableRowMenuButton"
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
              data-testid="eventsDivisionsEditDialogOpenListItem"
              @click.stop="eventsDivisionsEditDialogOpen(item)"
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
              data-testid="eventsDivisionsRemoveOneListItem"
              @click.stop="eventsDivisionsRemoveOne(item)"
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
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex"
import TableFilterSearch from "@/components/TableFilterSearch.vue"

export default {
  name: "EventsDivisionsListTable",

  components: {
    TableFilterSearch
  },

  props: {
    event: { type: Object, required: true }
  },

  data() {
    return {
      eventsDivisionsSearchFilter: "",
      eventsDivisionsSelection: [],
      eventsDivisionsHeaders: [{
        value: "name",
        text: this.$t("columnLabelName")
      }, {
        value: "day",
        text: this.$t("columnLabelDay")
      }, {
        value: "time",
        text: this.$t("columnLabelTime")
      }, {
        value: "distance",
        text: this.$t("columnLabelDistance")
      }, {
        value: "standsCount",
        text: this.$t("columnLabelStandsCount")
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateList: "list"
    })
  },

  watch: {
    event: {
      immediate: true,
      handler: function(): void {
        if(!this.event) return
        this.eventsDivisionsActionsList({
          filter: { eventId: this.event.id },
          options: { limit: false },
          persistFilter: true
        })
      }
    }
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list"
    }),

    eventsDivisionsListTableRowClick(division): void {
      this.$emit("eventsDivisionsContestantsListDialogOpen", division)
    },

    eventsDivisionsCreateDialogOpen(): void {
      this.$emit("eventsDivisionsCreateDialogOpen")
    },

    eventsDivisionsEditDialogOpen(division): void {
      this.$emit("eventsDivisionsEditDialogOpen", division)
    },

    eventsDivisionsRemoveOne(division): void {
      this.$emit("eventsDivisionsRemoveOne", division)
    }

    // eventsDivisionsRemoveMany(divisions): void {
    //   this.$emit("eventsDivisionsRemoveMany", divisions)
    // }
  }
}
</script>
