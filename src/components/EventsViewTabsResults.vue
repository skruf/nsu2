<i18n>
{
  "en": {
  },
  "no": {
  }
}
</i18n>

<template>
  <div>
    <events-contestants-results-list-table
      :event="event"
      @eventsContestantsResultsInputDialogOpen="eventsContestantsResultsInputDialogOpen"
    />

    <events-contestants-results-input-dialog
      :events-contestant="eventsContestantsResultsInputDialogContestant"
      :shown.sync="eventsContestantsResultsInputDialogShow"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import EventsContestantsResultsListTable from "@/components/EventsContestantsResultsListTable.vue"
import EventsContestantsResultsInputDialog from "@/components/EventsContestantsResultsInputDialog.vue"

export default Vue.extend({
  name: "EventsViewTabsResults",

  components: {
    EventsContestantsResultsListTable,
    EventsContestantsResultsInputDialog
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsContestantsResultsInputDialogShow: false,
    eventsContestantsResultsInputDialogContestant: {}
  }),

  methods: {
    eventsContestantsResultsInputDialogOpen(contestant): void {
      this.eventsContestantsResultsInputDialogShow = true
      this.eventsContestantsResultsInputDialogContestant = contestant
    }
  }
})
</script>
