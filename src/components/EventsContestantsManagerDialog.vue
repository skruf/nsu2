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
    "formItemCalibreError": "Enter a calibre",

    "columnLabelClubMember": "Contestant",
    "columnLabelClubName": "Club",
    "columnLabelWeapon": "Weapon",
    "columnLabelCalibre": "Calibre"
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
    "formItemCalibreError": "Skriv inn kaliber",

    "columnLabelClubMember": "Deltaker",
    "columnLabelClubName": "Klubb",
    "columnLabelWeapon": "Våpen",
    "columnLabelCalibre": "Kaliber"
  }
}
</i18n>

<style>
.weapons-form .v-label,
.weapons-form .v-select__selection {
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1rem;
  color: rgba(0, 0, 0, 0.87);
}
</style>

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
        Håndter deltakere
      </v-toolbar-title>

      <v-spacer />

      <v-toolbar-items>
        <v-btn
          text
          data-testid="eventsContestantsManagerDialogSubmit"
          :loading="eventsContestantsStateCreateManyIsLoading"
          @click="eventsContestantsManagerDialogSubmit"
        >
          {{ $t("save") }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <div class="flex flex-col min-h-full bg-white">
      <div class="flex w-full">
        <div class="flex-1 border-r border-gray-300">
          <v-list
            nav
            dense
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="flex justify-between items-center">
                  {{ $t("selectClub") }}

                  <v-progress-circular
                    v-if="clubsStateListIsLoading"
                    :size="24"
                    color="primary"
                    indeterminate
                  />
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2" />

            <v-list-item-group
              v-model="activeClubIndex"
              color="primary"
            >
              <v-list-item
                v-for="(club, index) in clubsStateList"
                :key="club.id"
                data-testid="eventsContestantsManagerDialogSelectClubListItem"
                @click="eventsContestantsManagerDialogSelectClub(club, index)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ club.name }}
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

        <div class="flex-1 border-r border-gray-300">
          <v-list
            nav
            dense
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="flex justify-between items-center">
                  {{ $t("addClubsMembers") }}

                  <v-progress-circular
                    v-if="clubsMembersStateListIsLoading"
                    :size="24"
                    color="primary"
                    indeterminate
                  />
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2" />

            <v-list-item-group
              v-model="activeClubMemberIndex"
              color="primary"
            >
              <v-list-item
                v-for="(clubMember, index) in clubsMembersStateList"
                :key="clubMember.id"
                data-testid="eventsContestantsManagerDialogSelectClubMemberListItem"
                @click="eventsContestantsManagerDialogSelectClubMember(clubMember, index)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ clubMember.firstName }} {{ clubMember.lastName }}
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

        <div class="flex-1 border-r border-gray-300 weapons-form">
          <v-list
            nav
            dense
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="flex items-center justify-between -my-2">
                  Legg til våpen

                  <v-progress-circular
                    v-if="weaponsStateListIsLoading"
                    :size="24"
                    color="primary"
                    indeterminate
                  />

                  <v-btn
                    icon
                    color="primary"
                    data-testid="eventsContestantsManagerDialogAddWeaponButton"
                    :disabled="!hasSelectedMember"
                    @click.stop="eventsContestantsManagerDialogAddWeapon(eventsContestantsSelectedMember.id)"
                  >
                    <v-icon>
                      add
                    </v-icon>
                  </v-btn>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2" />

            <div
              v-for="(weapon, index) in weaponsForm[eventsContestantsSelectedMember.id]"
              :key="index"
              class="flex px-2"
            >
              <v-autocomplete
                v-model="weapon.weaponId"
                :loading="weaponsStateListIsLoading"
                :items="weaponsStateList"
                item-text="name"
                item-value="id"
                :label="$t('formItem1Placeholder')"
                :rules="[(v) => !!v || $t('formItemWeaponIdError')]"
                data-testid="eventsContestantsManagerDialogWeaponsFormIdSelect"
                class="flex-2"
                single-line
                dense
                required
              />

              <v-select
                v-model="weapon.condition"
                :items="weaponsStateConditions"
                :rules="[(v) => !!v || $t('weaponsFormConditionError')]"
                label="Tilstand"
                data-testid="eventsContestantsManagerDialogWeaponsFormConditionSelect"
                class="flex-1 mx-2"
                style="min-width: 140px;"
                single-line
                dense
                required
              />

              <v-text-field
                v-model="weapon.calibre"
                :label="$t('formItem2Label')"
                :rules="[(v) => !!v || $t('formItemCalibreError')]"
                data-testid="eventsContestantsManagerDialogWeaponsFormCalibreInput"
                class="flex-1"
                style="min-width: 70px;"
                type="number"
                single-line
                dense
                required
              />

              <v-btn
                icon
                color="primary"
                data-testid="eventsContestantsManagerDialogRemoveWeaponButton"
                @click.stop="eventsContestantsManagerDialogRemoveWeapon(eventsContestantsSelectedMember.id, index)"
              >
                <v-icon>
                  remove
                </v-icon>
              </v-btn>
            </div>

            <div v-if="!hasSelectedMember">
              Velg et medlem for å legge til et våpen
            </div>
          </v-list>
        </div>
      </div>

      <!-- <v-divider class="my-2" />

      <div class="text-center py-4">
        Legger til
      </div>

      <v-data-table
        ref="addingContestantsListTable"
        :headers="addingContestantsListTableHeaders"
        :items="addingContestantsListTableData"
        :no-data-text="$t('tablePlaceholderText')"
        disable-sort
        data-testid="addingContestantsListTable"
      >
        <template v-slot:item.clubMember.firstName="{ item }">
          {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
        </template>

        <template v-slot:item.weapon.name="{ item }">
          {{ item.weapon.name }} ({{ item.weapon.distance }})
        </template>
      </v-data-table> -->
    </div>

    <loading-dialog
      v-model="eventsContestantsStateCreateManyIsLoading"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import LoadingDialog from "@/components/LoadingDialog.vue"

export default Vue.extend({
  name: "EventsContestantsManagerDialog",

  components: {
    LoadingDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      activeClubIndex: null,
      activeClubMemberIndex: null,
      eventsContestantsSelectedMember: {},
      weaponsForm: {},
      cachedMembers: {},
      weaponsFormRules: {
        weaponId: { required: true, message: "Choose a weapon" },
        calibre: { required: true, message: "Enter a calibre" }
      },

      addingContestantsListTableHeaders: [{
        value: "clubMember.firstName",
        text: this.$t("columnLabelClubMember")
      }, {
        value: "clubMember.club.name",
        text: this.$t("columnLabelClubName")
      }, {
        value: "weapon.name",
        text: this.$t("columnLabelWeapon")
      }, {
        value: "calibre",
        text: this.$t("columnLabelCalibre")
      }]
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateList: "list"
    }),

    ...mapState("clubs/members", {
      clubsMembersStateListIsLoading: "listIsLoading",
      clubsMembersStateList: "list"
    }),

    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateList: "list",
      weaponsStateConditions: "conditions"
    }),

    ...mapState("events/contestants", {
      eventsContestantsStateCreateManyIsLoading: "createManyIsLoading"
    }),

    hasSelectedMember(): boolean {
      return Object.keys(this.eventsContestantsSelectedMember).length > 0
    }

    // addingContestantsListTableData(): any {
    //   const contestants = []
    //   for(const memberId of Object.keys(this.weaponsForm)) {
    //     const weapons = this.weaponsForm[memberId]
    //     const clubMember = this.cachedMembers[memberId]
    //     clubMember.club = this.clubsStateList.find(({ id }) => id === clubMember.clubId)

    //     const contestant = {
    //       clubMemberId: memberId,
    //       clubMember,
    //       eventId: this.event.id
    //     }

    //     weapons.forEach(({ weaponId, calibre, condition }) => {
    //       const weapon = this.weaponsStateList.find(({ id }) => id === weaponId)

    //       contestants.push({
    //         ...contestant,
    //         weaponId,
    //         weapon,
    //         condition,
    //         calibre: parseInt(calibre)
    //       })
    //     })
    //   }
    //   return contestants
    // }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
      if(!visible) return
      this.clubsActionsList({
        filter: {}, options: { limit: false }
      })
      this.weaponsActionsList({
        filter: {}, options: { limit: false }
      })
    },
    shown(visible): void {
      this.visible = visible
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsList: "list"
    }),

    ...mapActions("clubs/members", {
      clubsMembersActionsList: "list"
    }),

    ...mapActions("weapons", {
      weaponsActionsList: "list"
    }),

    ...mapActions("events/contestants", {
      eventsContestantsActionsCreateMany: "createMany"
    }),

    async eventsContestantsManagerDialogSelectClub(club, index): Promise<void> {
      this.activeClubIndex = index
      await this.clubsMembersActionsList({
        filter: { clubId: club.id },
        options: { limit: false },
        persistFilter: true
      })
      this.eventsContestantsSelectedMember = {}
    },

    eventsContestantsManagerDialogSelectClubMember(member, index): void {
      this.activeClubMemberIndex = index
      this.eventsContestantsSelectedMember = member
      this.cachedMembers[member.id] = member
    },

    eventsContestantsManagerDialogAddWeapon(memberId): void {
      const existingWeapons = this.weaponsForm[memberId]

      if(!existingWeapons) {
        Vue.set(this.weaponsForm, memberId, [{ weaponId: "", calibre: "" }])
        return
      }

      this.weaponsForm[memberId].push({ weaponId: "", calibre: "" })
    },

    eventsContestantsManagerDialogRemoveWeapon(memberId, index): void {
      this.weaponsForm[memberId].splice(index, 1)
    },

    async eventsContestantsManagerDialogSubmit(): Promise<void> {
      const contestants = []

      for(const memberId of Object.keys(this.weaponsForm)) {
        const weapons = this.weaponsForm[memberId]

        const contestant = {
          clubMemberId: memberId,
          eventId: this.event.id
        }

        weapons.forEach(({ weaponId, calibre }) => {
          contestants.push({
            ...contestant,
            weaponId: weaponId,
            calibre: parseInt(calibre)
          })
        })
      }

      try {
        await this.eventsContestantsActionsCreateMany(contestants)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("saveSuccess", {
            members: contestants.length
          })
        })
        this.close()
        this.weaponsForm = {}
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
