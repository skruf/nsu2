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
    "eventsDivisionsContestantsSearchFilterPlaceholder": "Search for contestants",
    "autoAssign": "Assign contestants",
    "eventsDivisionsContestantsRemoveOneConfirmation": "This will remove %{contestantFullName} from the division. Continue?",
    "eventsDivisionsContestantsRemoveOneSuccess": "%{contestantFullName} was removed from the division"
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
    "eventsDivisionsContestantsSearchFilterPlaceholder": "Søk etter deltakere",
    "autoAssign": "Fyll deltakere",
    "eventsDivisionsContestantsRemoveOneConfirmation": "Dette vil fjerne %{contestantFullName} fra standplasslisten. Fortsette?",
    "eventsDivisionsContestantsRemoveOneSuccess": "%{contestantFullName} ble fjernet fra standplasslisten"
  }
}
</i18n>

<template>
  <div>
    <div class="table-controls">
      <table-filter-search
        v-model="eventsDivisionsContestantsSearchFilter"
        :label="$t('eventsDivisionsContestantsSearchFilterPlaceholder')"
        data-testid="eventsDivisionsContestantsSearchFilterInput"
      />

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
      :items="eventsDivisionsContestantsIsLoading ? [] : eventsDivisionsContestantsStateList"
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
        {{ item.weapon.name }} ({{ item.weapon.distance }})
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu
          bottom
          left
        >
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              data-testid="eventsDivisionsContestantsTableRowMenuButton"
              small
              icon
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
              @click.stop="eventsDivisionsContestantsRemoveOne(item)"
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
import TableFilterSearch from "@/components/TableFilterSearch.vue"
import { Sortable, Swap } from "sortablejs/modular/sortable.core.esm"

export default {
  name: "EventsDivisionsContestantsListTable",

  components: {
    TableFilterSearch
  },

  props: {
    division: { type: Object, required: true }
  },

  data() {
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

    async eventsDivisionsContestantsRemoveOne(contestant): Promise<void> {
      const fullName = `${contestant.clubMember.firstName} ${contestant.clubMember.lastName}`
      try {
        await this.$confirm(
          this.$t("eventsDivisionsContestantsRemoveOneConfirmation", {
            contestantFullName: fullName
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.eventsDivisionsContestantsActionsRemoveOne(contestant)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsDivisionsContestantsRemoveOneSuccess", {
            contestantFullName: fullName
          })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    // eventsDivisionsContestantsRemoveMany(contestants): void {
    //   this.$emit("eventsDivisionsContestantsRemoveMany", contestants)
    // }
  }
}
</script>
