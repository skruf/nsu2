<i18n>
{
  "en": {
    "title": "Add a note",
    "placeholder": "Enter a note"
  },
  "no": {
    "title": "Legg til notat",
    "placeholder": "Skriv inn et notat"
  }
}
</i18n>

<template>
  <action-dialog :shown.sync="visible">
    <template v-slot:title>
      {{ $t("title") }}
    </template>

    <template v-slot:actions>
      <v-btn
        text
        data-testid="eventsContestantsResultsNotesSubmitEditButton"
        :loading="eventsContestantsEditOneIsLoading"
        @click="submit(note)"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <v-textarea
      v-if="hasContestant"
      v-model="note"
      :placeholder="this.$t('placeholder')"
      hide-details
      data-testid="eventsContestantsResultsNotesEditInput"
      class="-mt-6 pt-0"
      auto-grow
      autofocus
      light
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "EventsContestantsNotes",

  components: {
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data() {
    return {
      visible: this.shown,
      note: ""
    }
  },

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsEditOneIsLoading: "editOneIsLoading",
      eventsContestantsStateSelected: "selected"
    }),
    hasContestant(): boolean {
      return Object.keys(this.eventsContestantsStateSelected).length > 1
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.note = this.eventsContestantsStateSelected.note
      this.visible = visible
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsEditOne: "editOne"
    }),
    async submit(note: string): Promise<void> {
      await this.eventsContestantsActionsEditOne({
        ...this.eventsContestantsStateSelected,
        note
      })
      this.close()
    },
    close(): void {
      this.visible = false
    }
  }
})
</script>
