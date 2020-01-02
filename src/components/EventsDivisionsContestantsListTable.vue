<i18n>
{
  "en": {
    "columnLabelStand": "Stand",
    "columnLabelNumber": "Nr",
    "columnLabelClubMember": "Contestant",
    "columnLabelClubName": "Club",
    "columnLabelWeapon": "Weapon",
    "columnLabelCalibre": "Calibre",
    "tablePlaceholderText": "No contestants yet.",
    "tablePlaceholderButton": "Add new?",
    "eventsDivisionsContestantsSearchFilterPlaceholder": "Search for contestants by first or last name",
    "autoAssign": "Assign contestants"
  },
  "no": {
    "columnLabelStand": "Plass",
    "columnLabelNumber": "Nr",
    "columnLabelClubMember": "Deltaker",
    "columnLabelClubName": "Klubb",
    "columnLabelWeapon": "Våpen",
    "columnLabelCalibre": "Kaliber",
    "tablePlaceholderText": "Ingen deltakere enda",
    "tablePlaceholderButton": "Legg til ny?",
    "eventsDivisionsContestantsSearchFilterPlaceholder": "Søk etter deltakere med fornavn eller etternavn",
    "autoAssign": "Fyll deltakere"
  }
}
</i18n>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4 px-5 no-print">
      <div class="w-full max-w-md">
        <v-text-field
          v-model="eventsDivisionsContestantsSearchFilter"
          :label="$t('eventsDivisionsContestantsSearchFilterPlaceholder')"
          data-testid="eventsDivisionsContestantsSearchFilterInput"
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
        data-testid="eventsDivisionsContestantsAutoAssignButton"
        @click.stop="eventsDivisionsContestantsAutoAssign(division)"
      >
        {{ $t("autoAssign") }}
      </v-btn>

      <!-- <v-btn
        color="primary"
        data-testid="eventsDivisionsContestantsListTableOpenManageDialogButton"
        @click.stop="eventsDivisionsContestantsManageDialogOpen"
      >
        {{ $t("tablePlaceholderButton") }}
      </v-btn> -->
    </div>

    <v-data-table
      ref="eventsDivisionsContestantsListTable"
      v-model="eventsDivisionsContestantsSelection"
      :headers="eventsDivisionsContestantsHeaders"
      :items="eventsDivisionsContestantsStateList"
      :search="eventsDivisionsContestantsSearchFilter"
      :loading="eventsDivisionsContestantsIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      disable-sort
      sort-by="stand"
      data-testid="eventsDivisionsContestantsListTable"
    >
      <template v-slot:item.drag>
        <v-btn
          text
          icon
          data-testid="eventsDivisionsContestantsListTableHandle"
          class="handle"
        >
          <v-icon>
            drag_handle
          </v-icon>
        </v-btn>
      </template>

      <template v-slot:item.clubMember.firstName="{ item }">
        <span class="mr-2 text-xs font-semibold py-1 px-2 rounded-full bg-gray-200">
          {{ item.number }}
        </span>
        {{ item.clubMember.firstName }} {{ item.clubMember.lastName }}
      </template>

      <template v-slot:item.weapon.name="{ item }">
        {{ item.weapon.name }}
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
              data-testid="eventsDivisionsContestantsTableRowMenuButton"
              @click.stop="click"
            >
              <v-icon>
                more_horiz
              </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              data-testid="eventsDivisionsContestantsEditDialogOpenListItem"
              @click.stop="eventsDivisionsContestantsEditDialogOpen(item)"
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
              data-testid="eventsDivisionsContestantsRemoveOneListItem"
              @click.stop="eventsDivisionsContestantsActionsRemoveOne(item)"
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

      <!-- <template v-slot:body.append>
        <tr class="">
          <td>
            <v-btn
              text
              icon
              data-testid="eventsDivisionsContestantsListTableHandle"
              class="handle"
            >
              <v-icon>
                drag_handle
              </v-icon>
            </v-btn>
          </td>
          <td>
            {{ eventsDivisionsContestantsStateList.length + 1 }}
          </td>
          <td>
            {{ eventsDivisionsContestantsStateList.length + 1 }}
          </td>
          <td
            class="px-2"
            colspan="2"
          >
            <v-text-field
              :rules="[(v) => !!v || $t('eventsFormTitleError')]"
              data-testid="eventsFormTitleInput"
              dense
              single-line
              outlined
              hide-details
              required
            />
          </td>
          <td class="px-2">
            <v-autocomplete
              :items="weaponsStateList"
              :loading="weaponsStateListIsLoading"
              item-text="name"
              item-value="id"
              :rules="[(v) => !!v || $t('eventsContestantsFormWeaponIdError')]"
              data-testid="eventsContestantsFormWeaponIdSelect"
              dense
              single-line
              outlined
              hide-details
              required
            />
          </td>
          <td class="px-2">
            <v-text-field
              :rules="[(v) => !!v || $t('eventsContestantsFormCalibreError')]"
              data-testid="eventsContestantsFormCalibreInput"
              type="number"
              dense
              single-line
              outlined
              hide-details
              required
            />
          </td>
          <td>
            <v-btn
              text
              icon
            >
              <v-icon>
                save
              </v-icon>
            </v-btn>
          </td>
        </tr>
      </template> -->
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex"
import { Sortable, Swap } from "sortablejs/modular/sortable.core.esm"

export default {
  name: "EventsDivisionsContestantsListTable",

  props: {
    division: { type: Object, required: true }
  },

  data: function() {
    return {
      eventsDivisionsContestantsSearchFilter: "",
      eventsDivisionsContestantsSelection: [],
      eventsDivisionsContestantsHeaders: [{
        value: "drag",
        sortable: false
      }, {
        value: "stand",
        text: this.$t("columnLabelStand")
      }, {
        value: "clubMember.firstName",
        text: this.$t("columnLabelClubMember")
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
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateListIsLoading: "listIsLoading",
      eventsDivisionsContestantsStateList: "list",
      eventsDivisionsContestantsStateRemoveOneIsLoading: "removeOneIsLoading"
    }),

    eventsDivisionsContestantsIsLoading(): boolean {
      return (
        this.eventsDivisionsContestantsStateListIsLoading ||
        this.eventsDivisionsContestantsStateRemoveOneIsLoading
      )
    },

    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateList: "list"
    })
  },

  watch: {
    division: {
      immediate: true,
      handler: function(): void {
        if(!this.division) return
        this.eventsDivisionsContestantsActionsList({
          filter: { divisionId: this.division.id },
          persistFilter: true
        })
        this.weaponsActionsList({
          filter: {}, options: { limit: false }
        })
      }
    }
  },

  mounted(): void {
    Sortable.mount(new Swap())
    Sortable.create(document.querySelector(".v-data-table tbody"), {
      swap: true,
      handle: ".handle",
      onEnd: () => {
        this.$notify({
          type: "warning",
          title: "Ikke implementert",
          message: "Kommer snart"
        })
      }
      // onEnd: this.eventsDivisionsContestantsActionsReorder
    })
  },

  methods: {
    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list",
      eventsDivisionsContestantsActionsReorder: "reorder",
      eventsDivisionsContestantsActionsRemoveOne: "removeOne",
      eventsDivisionsContestantsAutoAssign: "autoAssign"
    }),

    ...mapActions("weapons", {
      weaponsActionsList: "list"
    }),

    eventsDivisionsContestantsManageDialogOpen(): void {
      this.$emit("eventsDivisionsContestantsManageDialogOpen")
    },

    eventsDivisionsContestantsEditDialogOpen(contestant): void {
      this.$emit("eventsContestantsEditDialogOpen", contestant)
    },

    // eventsDivisionsContestantsRemoveOne(contestant): void {
    //   this.$emit("eventsDivisionsContestantsRemoveOne", contestant)
    // },

    // eventsDivisionsContestantsRemoveMany(contestants): void {
    //   this.$emit("eventsDivisionsContestantsRemoveMany", contestants)
    // }
  }
}
</script>
