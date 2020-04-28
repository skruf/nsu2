<i18n>
{
  "en": {
    "title": "Add participations",
    "formItem1Placeholder": "Choose a weapon (*)",
    "formItem2Label": "Calibre (*)",
    "formItem2Placeholder": "Enter a calibre",
    "formItemWeaponIdError": "Choose a weapon",
    "formItemCalibreError": "Enter a calibre",
    "selectMemberLabel": "Choose a member (*)",
    "selectMemberError": "Choose a member to continue",
    "saveSuccess": "%{count} participations was added to the event"
  },
  "no": {
    "title": "Legg til deltakelser",
    "formItem1Placeholder": "Velg et våpen (*)",
    "formItem2Label": "Kaliber (*)",
    "formItem2Placeholder": "Skriv inn et kaliber",
    "formItemWeaponIdError": "Velg et våpen",
    "formItemCalibreError": "Skriv inn kaliber",
    "selectMemberLabel": "Velg et medlem (*)",
    "selectMemberError": "Velg et medlem for å fortsette",
    "saveSuccess": "%{count} deltakelser ble lagt til stevnet"
  }
}
</i18n>

<template>
  <v-dialog
    v-model="visible"
    content-class="pt-16 relative self-start mt-32"
    :max-width="700"
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

      <v-toolbar-title class="flex-1">
        {{ $t("title") }}
      </v-toolbar-title>

      <v-toolbar-items>
        <v-btn
          text
          data-testid="submitContestantButton"
          :loading="eventsContestantsStateCreateManyIsLoading"
          @click="submit"
        >
          {{ $t("save") }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <div class="bg-white pb-5">
      <div class="p-5 border-border border-b border-solid mb-5">
        <v-autocomplete
          v-model="selectedClubsMemberId"
          :items="clubsMembersStateList"
          :label="$t('selectMemberLabel')"
          :loading="clubsMembersStateListIsLoading"
          :rules="[(v) => !!v || $t('selectMemberError')]"
          :filter="clubMemberFilter"
          data-testid="eventsContestantsManagerSelectMember"
          item-value="id"
          class="mb-5"
          autofocus
          single-line
          outlined
          hide-details
          append-icon="expand_more"
        >
          <template v-slot:prepend-item>
            <v-btn
              text
              class="mb-2 w-full"
              data-testid="clubsMembersCreateDialogOpenButton"
              @click.stop="clubsMembersCreateDialogOpen"
            >
              <v-icon left>
                add
              </v-icon>
              {{ $t("create") }} {{ $t("member") }}
            </v-btn>
          </template>

          <template v-slot:selection="{ item }">
            <events-contestants-create-dialog-member-select-item
              data-testid="eventsContestantsCreateDialogMemberSelectSelection"
              :member="item"
            />
          </template>

          <template v-slot:item="{ item }">
            <events-contestants-create-dialog-member-select-item
              data-testid="eventsContestantsCreateDialogMemberSelectItem"
              :member="item"
            />
          </template>
        </v-autocomplete>

        <v-btn
          :disabled="!hasSelectedMember"
          class="w-full"
          color="white"
          data-testid="addWeaponButton"
          @click="addWeapon"
        >
          <v-icon left>
            add
          </v-icon>
          {{ $t("add") }} {{ $t("weapon") }}
        </v-btn>
      </div>

      <v-form
        v-for="(weapon, index) in weaponsForm"
        ref="forms"
        :key="index"
        :class="{ 'disabled': !hasSelectedMember }"
        class="flex px-5 items-center mt-5 text-sm"
      >
        <v-autocomplete
          v-model="weapon.weaponId"
          :loading="weaponsStateListIsLoading"
          :items="weaponsStateList"
          item-text="name"
          item-value="id"
          :label="$t('formItem1Placeholder')"
          :rules="[(v) => !!v || $t('formItemWeaponIdError')]"
          data-testid="eventsContestantsCreateDialogWeaponsFormIdSelect"
          class="flex-1 mr-2"
          single-line
          hide-details
          dense
          required
          outlined
        >
          <template v-slot:prepend-item>
            <v-btn
              text
              class="mb-2 w-full"
              data-testid="weaponsCreateDialogOpenButton"
              @click.stop="weaponsCreateDialogOpen(index)"
            >
              <v-icon left>
                add
              </v-icon>
              {{ $t("create") }} {{ $t("weapon") }}
            </v-btn>
          </template>

          <template v-slot:item="{ item }">
            <div
              class="py-2 flex items-center justify-between whitespace-no-wrap"
              data-testid="eventsDivisionsSelectItem"
            >
              <div class="flex-2">
                {{ item.name }}
                <div class="text-muted leading-tight">
                  {{ $t("weapon") }}
                </div>
              </div>

              <div class="flex-1 text-sm ml-5">
                {{ item.distance }} meter
                <div class="text-muted leading-tight">
                  {{ $t("distance") }}
                </div>
              </div>
            </div>
          </template>
        </v-autocomplete>

        <v-text-field
          v-model="weapon.calibre"
          :label="$t('formItem2Label')"
          :rules="[(v) => !!v || $t('formItemCalibreError')]"
          data-testid="eventsContestantsCreateDialogWeaponsFormCalibreInput"
          class="flex-1 ml-2"
          type="number"
          min="0"
          single-line
          hide-details
          dense
          required
          outlined
        />

        <v-btn
          icon
          class="ml-2 -mr-1"
          color="primary"
          data-testid="removeWeaponButton"
          @click.stop="removeWeapon(index)"
        >
          <v-icon>
            remove
          </v-icon>
        </v-btn>
      </v-form>
    </div>

    <clubs-members-create-dialog
      :shown.sync="clubsMembersCreateDialogShown"
      @memberCreated="memberCreated"
    />

    <weapons-create-dialog
      :shown.sync="weaponsCreateDialogShown"
      @weaponCreated="weaponCreated"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import eventsContestantsStub
  from "./events.contestants.stub"
import EventsContestantsCreateDialogMemberSelectItem
  from "./EventsContestantsCreateDialogMemberSelectItem.vue"
import WeaponsCreateDialog
  from "@/weapons/WeaponsCreateDialog.vue"
import ClubsMembersCreateDialog
  from "@/clubs/members/ClubsMembersCreateDialog.vue"

const strIncludes = (v: string, q: string): boolean => (
  v.toLowerCase().includes(q.toLowerCase())
)

export default Vue.extend({
  name: "EventsContestantsCreateDialog",

  components: {
    EventsContestantsCreateDialogMemberSelectItem,
    WeaponsCreateDialog,
    ClubsMembersCreateDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data() {
    return {
      visible: this.shown,
      weaponsCreateDialogShown: false,
      clubsMembersCreateDialogShown: false,
      selectedClubsMemberId: "",
      weaponsFormIndex: null,
      weaponsForm: [{ ...eventsContestantsStub }],
      weaponsFormRules: {
        weaponId: { required: true, message: "Choose a weapon" },
        calibre: { required: true, message: "Enter a calibre" }
      }
    }
  },

  computed: {
    ...mapState("clubs/members", {
      clubsMembersStateListIsLoading: "listIsLoading",
      clubsMembersStateList: "list"
    }),
    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateList: "list"
    }),
    ...mapState("events/contestants", {
      eventsContestantsStateCreateManyIsLoading: "createManyIsLoading"
    }),
    hasSelectedMember(): boolean {
      return this.selectedClubsMemberId !== ""
    }
  },

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
      if(!visible) return
      this.weaponsActionsList()
      this.clubsMembersActionsList()
    },
    shown(visible): void {
      this.visible = visible
    }
  },

  methods: {
    ...mapActions("clubs/members", {
      clubsMembersActionsList: "list"
    }),

    ...mapActions("weapons", {
      weaponsActionsList: "list"
    }),

    ...mapActions("events/contestants", {
      eventsContestantsActionsCreateMany: "createMany"
    }),

    addWeapon(): void {
      this.weaponsForm.push({ ...eventsContestantsStub })
    },

    removeWeapon(index): void {
      if(this.weaponsForm.length === 1) return
      this.weaponsForm.splice(index, 1)
    },

    async submit(): Promise<void> {
      const validate = this.$refs.forms.map(({ validate }) => validate())
      if(validate.includes(false)) {
        this.$error(this.$t("validationError"))
        return
      }

      const contestants = this.weaponsForm.map(({
        weaponId,
        calibre
      }) => ({
        clubMemberId: this.selectedClubsMemberId,
        eventId: this.event.id,
        weaponId,
        calibre: parseInt(calibre)
      }))

      try {
        await this.eventsContestantsActionsCreateMany(contestants)
        this.$success(this.$t("saveSuccess", {
          count: contestants.length
        }))
        this.close()
        this.weaponsForm = [{ ...eventsContestantsStub }]
      } catch(e) {
        this.$error(e.message)
        console.error(e)
      }
    },

    close(): void {
      this.visible = false
    },

    weaponsCreateDialogOpen(weaponsFormIndex: number): void {
      this.weaponsFormIndex = weaponsFormIndex
      this.weaponsCreateDialogShown = true
    },

    weaponCreated(weapon): void {
      this.weaponsForm[this.weaponsFormIndex].weaponId = weapon.id
    },

    clubMemberFilter(item, queryText: string): boolean {
      if(strIncludes(`${item.firstName} ${item.lastName}`, queryText)) return true
      if(!item.club) return false
      if(strIncludes(item.club.name, queryText)) return true
      if(strIncludes(item.club.shortName, queryText)) return true
      return false
    },

    clubsMembersCreateDialogOpen(): void {
      this.clubsMembersCreateDialogShown = true
    },

    memberCreated(member): void {
      this.selectedClubsMemberId = member.id
    }
  }
})
</script>
