<i18n>
{
  "en": {
    "title": "Manage contestants",
    "subtitle": "For %{event}",
    "selectClub": "Select a club",
    "clubsSearchFormPlaceholder": "Search for clubs by name",
    "addClubsMembers": "Add members",
    "clubsMembersSearchFormPlaceholder": "Search for members by first or last name",
    "clubsMembersPlaceholderText": "Select a club to assign contestants",
    "currentContestants": "Current contestants",
    "contestantsSearchFormPlaceholder": "Search for contestants by first or last name",
    "column1Label": "Contestant",
    "column2Label": "Club",
    "column3Label": "Weapons",
    "column4Label": "Calibres",
    "editContestant": "Edit contestant",
    "removeContestant": "Remove contestant",
    "tablePlaceholderText": "No contestants yet.",
    "saveSuccess": "%{members} was added to the event",
    "formItem1Label": "Weapon",
    "formItem1Placeholder": "Choose a weapon",
    "formItem2Label": "Calibre",
    "formItem2Placeholder": "Enter a calibre",
    "eventsContestantsActionsCreateSuccess": "%{member} was added to the event",
    "formItemWeaponIdError": "Choose a weapon",
    "formItemCalibreError": "Enter a calibre"
  },
  "no": {
    "title": "Håndter deltakere",
    "subtitle": "For %{event}",
    "selectClub": "Velg en klubb",
    "clubsSearchFormPlaceholder": "Søk etter klubber med navn",
    "addClubsMembers": "Legg til medlemmer",
    "clubsMembersSearchFormPlaceholder": "Søk etter medlemmer med fornavn eller etternavn",
    "clubsMembersPlaceholderText": "Velg en klubb for å legge til deltakere",
    "currentContestants": "Nåværende deltakere",
    "contestantsSearchFormPlaceholder": "Søk etter deltakere med fornavn eller etternavn",
    "column1Label": "Deltaker",
    "column2Label": "Klubb",
    "column3Label": "Våpen",
    "column4Label": "Kalibre",
    "editContestant": "Rediger deltaker",
    "removeContestant": "Slett deltaker",
    "tablePlaceholderText": "Ingen deltakere enda.",
    "saveSuccess": "%{members} ble lagt til stevnet",
    "formItem1Label": "Våpen",
    "formItem1Placeholder": "Velg et våpen",
    "formItem2Label": "Kaliber",
    "formItem2Placeholder": "Skriv inn et kaliber",
    "eventsContestantsActionsCreateSuccess": "%{member} ble lagt til stevnet",
    "formItemWeaponIdError": "Velg et våpen",
    "formItemCalibreError": "Skriv inn kaliber"
  }
}
</i18n>

<template>
  <v-dialog
    v-model="visible"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    content-class="pt-16"
  >
    <v-toolbar
      dark
      color="primary"
      elevation="0"
      absolute
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

      <v-toolbar-title>
        Håndter resultater
      </v-toolbar-title>

      <v-spacer />

      <v-toolbar-items>
        <v-btn
          text
          data-testid="eventsContestantsResultsManagerDialogSubmit"
          :loading="eventsContestantsStateEditManyIsLoading"
          @click="eventsContestantsResultsManagerDialogSubmit"
        >
          {{ $t("save") }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <div class="flex min-h-full w-full bg-white">
      <div class="w-48 border-r border-gray-300">
        <v-list
          nav
          dense
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="flex justify-between items-center">
                Velg en deltaker

                <v-progress-circular
                  v-if="eventsContestantsStateListIsLoading"
                  :size="24"
                  color="primary"
                  indeterminate
                />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item-group
            v-model="activeContestantIndex"
            color="primary"
          >
            <v-list-item
              v-for="(contestant) in eventsContestantsStateList"
              :key="contestant.id"
              data-testid="selectContestantListItem"
              @click="selectContestant(contestant, index)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  #{{ contestant.number }}
                  <span class="text-sm opacity-75">
                    ({{ contestant.weapon.name }})
                  </span>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon>
                <v-icon>
                  chevron_right
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>

      <div class="flex-1 border-r border-gray-300 flex items-center">
        <results-form-buttons
          v-model="form"
        />
      </div>
    </div>

    <loading-dialog
      v-model="eventsContestantsStateEditManyIsLoading"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import LoadingDialog from "@/components/LoadingDialog.vue"
import ResultsFormButtons from "./ResultsFormButtons.vue"

export default Vue.extend({
  name: "EventsContestantsResultsManagerDialog",

  components: {
    LoadingDialog,
    ResultsFormButtons
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      activeContestantIndex: null,
      selectedContestant: {},
      form: {}
    }
  },

  computed: {
    ...mapState("events/contestants", {
      eventsContestantsStateList: "list",
      eventsContestantsStateListIsLoading: "listIsLoading",
      eventsContestantsStateEditManyIsLoading: "editManyIsLoading"
    }),

    hasSelectedMember(): boolean {
      return Object.keys(this.selectedContestant).length > 0
    }
  },

  watch: {
    visible(visible): void {
      console.log(this.eventsContestantsStateList)

      this.$emit("update:shown", visible)
      // if(!visible) return
      // this.eventsContestantsActionsList({
      //   filter: { eventId: this.event.id },
      //   options: { limit: false },
      //   persistFilter: true
      // })
    },
    shown(visible): void {
      this.visible = visible
    }
  },

  methods: {
    ...mapActions("events/contestants", {
      // eventsContestantsActionsList: "list",
      eventsContestantsActionsEditMany: "editMany"
    }),

    selectContestant(contestant, index): void {
      this.activeContestantIndex = index
      this.selectedContestant = contestant
      // this.cachedMembers[member.id] = member
    },

    async eventsContestantsResultsManagerDialogSubmit(): Promise<void> {
      // const contestants = []

      // for(const memberId of Object.keys(this.weaponsForm)) {
      //   const weapons = this.weaponsForm[memberId]

      //   const contestant = {
      //     clubMemberId: memberId,
      //     eventId: this.event.id
      //   }

      //   weapons.forEach(({ weaponId, calibre }) => {
      //     contestants.push({
      //       ...contestant,
      //       weaponId: weaponId,
      //       calibre: parseInt(calibre)
      //     })
      //   })
      // }

      try {
        // await this.eventsContestantsActionsCreateMany(contestants)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("saveSuccess", {
            // members: contestants.length
          })
        })
        this.close()
        // this.weaponsForm = {}
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
