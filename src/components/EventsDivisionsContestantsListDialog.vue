<template>
  <action-dialog
    :shown.sync="visible"
    :max-width="900"
  >
    <template v-slot:title>
      {{ $t("division") }}: {{ division.distance }} meter

      <div class="opacity-75 text-base leading-none">
        {{ division.name }}, {{ division.day | moment("DD/MMM") }} kl. {{ division.time }}
      </div>
    </template>

    <template v-slot:actions>
      <v-btn
        icon
        data-testid="eventsDivisionsContestantsListDialogPrintButton"
        @click="print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </template>

    <div class="-mt-6 -mb-3">
      <events-divisions-contestants-list-table
        :division="division"
        @eventsContestantsEditDialogOpen="eventsContestantsEditDialogOpen"
        @eventsDivisionsContestantsRemoveOne="eventsDivisionsContestantsRemoveOne"
      />
    </div>
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import EventsDivisionsContestantsListTable from "@/components/EventsDivisionsContestantsListTable.vue"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "EventsDivisionsContestantsListDialog",

  components: {
    EventsDivisionsContestantsListTable,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    division: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    }
  },

  methods: {
    eventsContestantsEditDialogOpen(contestant): void {
      this.$emit("eventsContestantsEditDialogOpen", contestant)
    },

    eventsDivisionsContestantsRemoveOne(contestant): void {
      this.$emit("eventsDivisionsContestantsRemoveOne", contestant)
    },

    close(): void {
      this.visible = false
    },

    print(): void {
      this.$notify({
        type: "warning",
        title: "Ikke implementert",
        message: "Kommer snart"
      })
    }
  }
})
</script>
