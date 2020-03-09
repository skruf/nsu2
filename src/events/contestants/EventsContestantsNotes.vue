<i18n>
{
  "en": {
    "title": "Notes for %{contestantDetails}",
    "eventsContestantsResultsNotesInputLabel": "Enter a note",
    "eventsContestantsResultsNotesInputError": "Cannot be empty",
    "editDialogTitle": "Edit note",
    "editNoteError": "Field is required",
    "editNotePlaceholder": "Enter a note"
  },
  "no": {
    "title": "Notater for %{contestantDetails}",
    "eventsContestantsResultsNotesInputLabel": "Skriv inn et notat",
    "eventsContestantsResultsNotesInputError": "Må utfylles",
    "editDialogTitle": "Rediger notat",
    "editNoteError": "Feltet er påkrevd",
    "editNotePlaceholder": "Skriv inn et notat"
  }
}
</i18n>

<style>
.v-overlay__content {
  @apply h-full w-full;
}
.note-input textarea {
  padding-bottom: 60px;
  line-height: 1.5rem;
}
.note-input .v-input__slot {
  @apply mt-1 px-3 pb-2 -mb-2;
}
</style>

<template>
  <v-fade-transition>
    <v-overlay :value="visible">
      <div
        class="w-full h-full"
        @click.stop="visible = false"
      >
        <div
          v-if="visible && hasContestant"
          class="flex flex-col bg-white text-black absolute right-0 inset-y-0 h-full w-full max-w-sm"
          @click.stop
        >
          <v-toolbar
            dark
            color="primary"
            elevation="0"
          >
            <v-btn
              icon
              dark
              @click="close"
            >
              <v-icon>
                close
              </v-icon>
            </v-btn>

            <v-toolbar-title class="pl-0 flex-1">
              <template v-if="hasContestant">
                {{ $t("title", {
                  contestantDetails: `${eventsContestantsStateSelected.clubMember.firstName} ${eventsContestantsStateSelected.clubMember.lastName}`
                }) }}
              </template>
            </v-toolbar-title>
          </v-toolbar>

          <v-textarea
            v-model="newNote"
            :label="$t('eventsContestantsResultsNotesInputLabel')"
            :rules="[(v) => !!v || $t('eventsContestantsResultsNotesInputError')]"
            hide-details
            rows="1"
            autofocus
            auto-grow
            light
            data-testid="eventsContestantsResultsNotesNewInput"
            class="note-input"
            required
          >
            <template v-slot:prepend-inner>
              <v-btn
                class="absolute bottom-0 right-0 mb-3 mr-3 z-10"
                primary
                data-testid="eventsContestantsResultsNotesSubmitNewButton"
                :loading="eventsContestantsEditOneIsLoading"
                @click="submitNewNote(newNote)"
              >
                {{ $t("save") }}
              </v-btn>
            </template>
          </v-textarea>

          <div
            v-if="hasContestant"
            class="overflow-y-auto h-full"
            data-testid="eventsContestantsResultsNotesList"
          >
            <div
              v-for="(note, i) in eventsContestantsStateSelected.notes"
              :key="i"
              v-ripple
              class="px-5 py-4 border-border border-solid border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
              data-testid="eventsContestantsResultsNotesListItem"
              @click="openEditDialog(note, i)"
            >
              {{ notes[i] }}
            </div>
          </div>
        </div>
      </div>

      <action-dialog :shown.sync="showEditDialog">
        <template v-slot:title>
          {{ $t("editDialogTitle") }}
        </template>

        <template v-slot:actions>
          <v-btn
            text
            data-testid="eventsContestantsResultsNotesDeleteButton"
            :loading="eventsContestantsEditOneIsLoading"
            @click="deleteNote(editNoteIndex)"
          >
            {{ $t("remove") }}
          </v-btn>

          <v-btn
            text
            data-testid="eventsContestantsResultsNotesSubmitEditButton"
            :loading="eventsContestantsEditOneIsLoading"
            @click="submitEditNote(editNote, editNoteIndex)"
          >
            {{ $t("save") }}
          </v-btn>
        </template>

        <v-textarea
          v-model="editNote"
          :rules="[(v) => !!v || $t('editNoteError')]"
          :label="$t('editNotePlaceholder')"
          data-testid="eventsContestantsResultsNotesEditInput"
          class="mt-0 pt-0"
          autofocus
          auto-grow
          light
          required
        />
      </action-dialog>
    </v-overlay>
  </v-fade-transition>
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
      newNote: "",
      editNote: "",
      editNoteIndex: null,
      notes: [],
      showEditDialog: false
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
      this.visible = visible
    },
    eventsContestantsStateSelected: {
      deep: true,
      handler({ notes }): void {
        if(!notes) return
        this.notes = [ ...notes ]
      }
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      eventsContestantsActionsEditOne: "editOne"
    }),
    openEditDialog(note: string, index: number): void {
      this.editNote = note
      this.editNoteIndex = index
      this.showEditDialog = true
    },
    submitNewNote(newNote: string): void {
      this.notes.push(newNote)
      this.newNote = ""
      this.updateNotes()
    },
    submitEditNote(editNote: string, editNoteIndex: number): void {
      this.notes[editNoteIndex] = editNote
      this.editNote = ""
      this.updateNotes()
      this.showEditDialog = false
    },
    deleteNote(editNoteIndex: number): void {
      // this.notes[i] = undefined
      this.notes.splice(editNoteIndex, 1)
      this.updateNotes()
      this.showEditDialog = false
    },
    updateNotes(): void {
      this.eventsContestantsActionsEditOne({
        ...this.eventsContestantsStateSelected,
        notes: [ ...this.notes ]
      })
    },
    close(): void {
      this.visible = false
    }
  }
})
</script>
