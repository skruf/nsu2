<style scoped>
.schedule-container {
  @apply flex-col border-b border-l border-solid border-border min-w-0;
  flex: 2;
}

.time-labels,
.lane-labels,
.grid,
.unassigned-contestants {
  display: grid;
  grid-gap: 1px;
}

.grid {
  overflow-x: auto;
  position: relative;
  padding-top: 43px;
  margin-left: 1px;
}

.cell {
  @apply text-base text-center flex flex-col items-center justify-center bg-white cursor-pointer leading-tight p-1;
  font-size: 0.9rem;
}

.time:last-child {
  border-bottom-left-radius: 0.5rem;
}

.cell:last-child {
  border-bottom-right-radius: 0.5rem;
}

.cell.dragover:not(.unassigned-contestants-cell) {
  @apply bg-gray-100;
  /* background-color: rgba(0, 0, 0, 0.8); */
}

/* .contestant-cell.dragging {
  background-color: green;
} */

.contestant-cell,
.unassigned-contestants-cell {
  position: relative;
}

.contestant-cell:hover,
.unassigned-contestants-cell:hover {
  @apply bg-gray-100;
}

.cell,
.time {
  @apply h-20;
}

.top-left-corner,
.lane {
  @apply bg-white;
  height: 42px;
}

.time-labels {
  @apply h-full;
}

.time {
  @apply flex items-center justify-center flex-initial text-xs text-gray-700 bg-white;
}

.top-left-corner,
.time {
  min-width: 64px;
}

.lane {
  @apply flex-1 text-center py-3 text-xs text-gray-700;
}

.time:nth-child(2) span,
.time:last-child span,
.lane:last-child span,
.add-cell > * {
  @apply opacity-25;
}

.cell,
.lane {
  min-width: 160px;
}

.lane-labels {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  grid-template-columns: inherit;
}

.add-cell:hover > * {
  @apply opacity-100;
  color: blue;
}

.unassigned-container {
  @apply flex-col min-w-0 mr-5 ml-0 overflow-y-auto;
  max-width: 321px;
}

.unassigned-contestants {
  grid-template-columns: 1fr 1fr;
  @apply bg-border;
}

.unassigned-search-filter {
  @apply border-t border-b border-solid border-border mt-1;
}

.unassigned-contestants-no-data {
  @apply text-center text-sm opacity-50 px-5 py-10;
  grid-column: span 2;
}

.remove-contestant-overlay {
  @apply absolute z-10 inset-0 w-full h-full p-5 flex flex-col items-center justify-center text-white text-lg p-5;
  background-color: rgba(0, 0, 0, 0.8);
}

.contestant-print-container {
  @apply w-full bg-white items-center justify-center flex-wrap;
}
.contestant-print-cell {
  break-before: page;
  @apply items-center justify-center inline-flex flex-col w-1/2 bg-white border border-solid border-border;
  min-height: 7.42cm;
  max-height: 7.42cm;
  /* min-height: 7.425cm; */
  /* max-height: 7.425cm; */
  /* width: 21cm; */
  /* height: 29.7cm; */
}
.contestant-print-cell-key {
  min-width: 8rem;
}

.placeholder-container {
  @apply border-border border-t border-solid p-5 flex flex-col items-center justify-center h-64;
}
</style>

<style>
.unassigned-search-filter .v-input__slot::before {
  border-color: #dce3e6 !important;
}

.unassigned-search-filter .v-input__slot {
  @apply px-4 py-1;
}

.unassigned-search-filter .v-label {
  font-size: 0.9rem;
}
</style>

<i18n>
{
  "en": {
    "eventsDivisionsListTableNoDataText": "No participants yet.",
    "eventsDivisionsListTableCreateDialogOpenButton": "Add new?",
    "eventsDivisionsSearchFilterPlaceholder": "Search for divisions",
    "unAssignedSearchFilterLabel": "Search for contestants",
    "divisionSelectLabel": "Division",
    "unAssignedContestantsNoData": "No unassigned contestants",
    "unAssignedTitle": "Unassigned contestants"
  },
  "no": {
    "eventsDivisionsListTableNoDataText": "Ingen deltakere enda",
    "eventsDivisionsListTableCreateDialogOpenButton": "Legg til ny?",
    "eventsDivisionsSearchFilterPlaceholder": "Søk etter standplasslister",
    "unAssignedSearchFilterLabel": "Søk etter deltakere",
    "divisionSelectLabel": "Standplassliste",
    "unAssignedContestantsNoData": "Ingen tilgjengelige deltakere",
    "unAssignedTitle": "Tilgjengelige deltakere"
  }
}
</i18n>

<template>
  <div class="flex items-start">
    <div
      v-if="hasDivision && hasSchedule"
      class="contestant-print-container hidden print:block"
    >
      <template v-for="time of times">
        <template v-for="stand of stands">
          <div
            v-if="schedule[time] && schedule[time][stand]"
            :key="`${time}-${stand}`"
            class="contestant-print-cell items-center"
          >
            <div class="max-w-md w-full mx-auto flex flex-col justify-center">
              <div class="flex flex-initial">
                <div class="contestant-print-cell-key">
                  Nr:
                </div>
                <div>
                  {{ schedule[time][stand].number }}
                </div>
              </div>

              <div class="flex flex-initial">
                <div class="contestant-print-cell-key">
                  Dato:
                </div>
                <div>
                  {{ eventsDivisionsStateSelected.day }}
                </div>
              </div>

              <div class="flex flex-initial">
                <div class="contestant-print-cell-key">
                  Tid:
                </div>
                <div>
                  {{ time }}
                </div>
              </div>

              <div class="flex flex-initial">
                <div class="contestant-print-cell-key">
                  Bane:
                </div>
                <div>
                  {{ stand }}
                </div>
              </div>

              <div class="flex flex-initial">
                <div class="contestant-print-cell-key">
                  Våpen:
                </div>
                <div>
                  {{ schedule[time][stand].weapon.name }} ({{ schedule[time][stand].weapon.condition }})
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>

    <div class="container schedule-container flex print:hidden">
      <div class="p-5">
        <v-select
          :value="eventsDivisionsStateSelected.id"
          :items="eventsDivisionsStateList"
          :label="$t('divisionSelectLabel')"
          :loading="eventsDivisionsStateListIsLoading"
          data-testid="eventsDivisionsSelectDivisionId"
          item-value="id"
          outlined
          hide-details
          dense
          @input="changeDivision"
        >
          <template v-slot:prepend-item>
            <v-btn
              text
              class="py-4 mb-2 w-full"
              data-testid="eventsDivisionsCreateDialogOpenButton"
              @click.stop="eventsDivisionsCreateDialogOpen"
            >
              <v-icon left>
                add
              </v-icon>
              Ny standplass
            </v-btn>
          </template>

          <template v-slot:selection="{ item }">
            <events-divisions-scheduler-division-select-item
              data-testid="eventsDivisionsSchedulerDivisionSelectSelection"
              :division="item"
            />
          </template>

          <template v-slot:item="{ item }">
            <events-divisions-scheduler-division-select-item
              data-testid="eventsDivisionsSchedulerDivisionSelectItem"
              :division="item"
            >
              <v-menu>
                <template v-slot:activator="{ on: { click }, attrs }">
                  <v-btn
                    data-testid="eventsDivisionsSelectDropdown"
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
                    data-testid="eventsDivisionsEditDialogOpen"
                    @click.stop="eventsDivisionsEditDialogOpen(item)"
                  >
                    <v-list-item-title class="flex items-center">
                      <v-icon>
                        edit
                      </v-icon>
                      <span class="ml-2">
                        Rediger listen
                      </span>
                    </v-list-item-title>
                  </v-list-item>

                  <v-divider />

                  <v-list-item
                    data-testid="eventsDivisionsRemoveOne"
                    @click.stop="eventsDivisionsRemoveOne(item)"
                  >
                    <v-list-item-title class="flex items-center">
                      <v-icon color="red">
                        delete_forever
                      </v-icon>
                      <span class="ml-2 red--text">
                        Slett listen
                      </span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </events-divisions-scheduler-division-select-item>
          </template>
        </v-select>
      </div>

      <div
        v-if="hasDivision && hasSchedule"
        class="flex w-full bg-border rounded-b-lg border-t border-border border-solid"
      >
        <div class="time-labels">
          <div class="top-left-corner" />
          <div
            v-for="time of times"
            :key="time"
            class="time"
          >
            <span>{{ time }}</span>
          </div>
        </div>

        <div
          ref="grid"
          class="grid flex-1"
        >
          <div class="lane-labels">
            <div
              v-for="stand of stands"
              :key="stand"
              class="lane"
            >
              <span>{{ stand }}</span>
            </div>
          </div>

          <template v-for="time of times">
            <template v-for="stand of stands">
              <div
                v-if="schedule[time] && schedule[time][stand]"
                :key="`${time}-${stand}`"
                class="cell contestant-cell"
                :class="{ 'dragging': isDragging }"
                :data-time="time"
                :data-stand="stand"
                :data-contestantid="schedule[time][stand].id"
                :draggable="true"
                data-testid="assignedContestantCell"
                @dragenter="addDragOverClass"
                @dragleave="removeDragOverClass"
                @dragstart="dragStartAssigned"
                @dragover="dragOver"
                @dragend="dragEnd"
                @drop="dropSwap"
                @click="eventsContestantsEditDialogOpen(schedule[time][stand])"
              >
                <!-- <div class="text-muted">
                  {{ schedule[time][stand].id }}
                  ({{ schedule[time][stand].divisionId }})
                  [{{ schedule[time][stand].eventId }}]
                </div> -->

                <avatar
                  class="mx-0 absolute left-0 top-0"
                  style="border-radius:0;"
                  size="small"
                  :colour="schedule[time][stand].colour"
                  :value="schedule[time][stand].number"
                />

                <div>
                  {{ schedule[time][stand].clubMember.firstName }} {{ schedule[time][stand].clubMember.lastName }}
                  <!-- [{{ schedule[time][stand].clubMember.club.shortName }}] -->
                </div>

                <div class="text-muted">
                  {{ schedule[time][stand].weapon.name }} ({{ schedule[time][stand].weapon.condition.charAt(0) }})
                  <!-- {{ schedule[time][stand].weapon.distance }} -->
                </div>
              </div>

              <button
                v-else
                :key="`${time}-${stand}`"
                class="cell add-cell"
                :data-time="time"
                :data-stand="stand"
                data-testid="addContestantCell"
                @dragenter="addDragOverClass"
                @dragleave="removeDragOverClass"
                @dragover="dragOver"
                @drop="dropAddOrUpdate"
                @click="eventsContestantsCreateDialogOpen(time, stand)"
              >
                <v-icon small>
                  add
                </v-icon>
              </button>
            </template>
          </template>
        </div>
      </div>

      <div
        v-else
        class="placeholder-container"
      >
        <div class="text-muted">
          Ingen standplasslister enda.
        </div>

        <v-btn
          text
          class="py-4 mb-2"
          data-testid="eventsDivisionsCreateDialogOpenButton"
          @click.stop="eventsDivisionsCreateDialogOpen"
        >
          <v-icon left>
            add
          </v-icon>
          Ny standplass
        </v-btn>
      </div>
    </div>

    <div
      v-if="hasDivision"
      class="container unassigned-container relative flex print:hidden"
    >
      <v-fade-transition>
        <div
          v-if="dragType === 'assigned'"
          class="remove-contestant-overlay"
          data-testid="removeContestantOverlay"
          @dragover="dragOver"
          @drop="dropUnAssign"
        >
          Fjern fra standplasslisten
          <v-icon
            large
            color="white"
            class="mt-2"
          >
            delete
          </v-icon>
        </div>
      </v-fade-transition>

      <div class="p-5 pt-4 pb-3">
        {{ $t("unAssignedTitle") }}
      </div>

      <div class="px-5 pb-3 text-sm">
        Viser <strong>{{ unAssigned.length }}</strong> tilgjengelige deltakere som skyter med våpen på <strong>{{ eventsDivisionsStateSelected.distance }} meter</strong>. Det er totalt <strong>{{ getUnAssigned.length }}</strong> tilgjengelige deltakere på stevnet.
      </div>

      <v-text-field
        v-model="unAssignedSearchFilter"
        :label="$t('unAssignedSearchFilterLabel')"
        class="unassigned-search-filter"
        data-testid="unAssignedSearchFilter"
        prepend-inner-icon="search"
        flat
        dense
        hide-details
        single-line
      />

      <div class="unassigned-contestants">
        <template v-if="unAssigned.length">
          <div
            v-for="contestant in unAssigned"
            :key="contestant.id"
            class="cell unassigned-contestants-cell"
            :data-contestantid="contestant.id"
            :draggable="true"
            data-testid="unAssignedContestant"
            @dragstart="dragStartUnAssigned"
            @dragover="dragOver"
            @dragend="dragEnd"
            @click="eventsContestantsEditDialogOpen(contestant)"
          >
            <!-- <div class="text-muted">
              {{ contestant.id }}
              {{ contestant.divisionId }}
              {{ contestant.eventId }}
            </div> -->

            <avatar
              class="mx-0 absolute left-0 top-0"
              style="border-radius:0;"
              size="small"
              :colour="contestant.colour"
              :value="contestant.number"
            />

            <div>
              {{ contestant.clubMember.firstName }} {{ contestant.clubMember.lastName }}
            </div>

            <div class="text-muted">
              {{ contestant.weapon.name }} ({{ contestant.weapon.condition.charAt(0) }})
              <!-- {{ contestant.weapon.distance }} -->
            </div>
          </div>
        </template>

        <div
          v-else
          class="unassigned-contestants-no-data"
        >
          {{ $t("unAssignedContestantsNoData") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState, mapGetters, mapMutations } from "vuex"
import Avatar from "@/components/Avatar.vue"
import EventsDivisionsSchedulerDivisionSelectItem
  from "./EventsDivisionsSchedulerDivisionSelectItem.vue"

export default Vue.extend({
  name: "EventsDivisionsScheduler",

  components: {
    Avatar,
    EventsDivisionsSchedulerDivisionSelectItem
  },

  data() {
    return {
      unAssignedSearchFilter: "",
      dragContestantId: null,
      dragType: ""
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateSelectedIsLoading: "selectedIsLoading",
      eventsStateSelected: "selected"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateList: "list",
      eventsDivisionsStateSelectedIsLoading: "selectedIsLoading",
      eventsDivisionsStateSelected: "selected"
    }),
    ...mapState("events/contestants", {
      eventsContestantsStateListIsLoading: "listIsLoading",
      eventsContestantsStateList: "list",
      eventsContestantsStateEditOneIsLoading: "editOneIsLoading",
      eventsContestantsStateEditManyIsLoading: "editManyIsLoading"
    }),
    ...mapGetters("events/contestants", {
      getTimesByDivisionId: "timesByDivisionId",
      getStandsByDivisionId: "standsByDivisionId",
      getScheduleByDivisionId: "scheduleByDivisionId",
      getUnAssignedByWeaponDistance: "unAssignedByWeaponDistance",
      getUnAssigned: "unAssigned"
    }),

    isDragging(): boolean {
      return this.dragType !== ""
    },

    hasDivision(): boolean {
      return Object.keys(this.eventsDivisionsStateSelected).length > 1
    },

    times() {
      if(!this.eventsDivisionsStateSelected) return
      const times = this.getTimesByDivisionId(this.eventsDivisionsStateSelected.id)

      // @TODO: handle last time 24:00
      // @TODO: handle minutes (ie. 10:00 + 10:30)

      const { startsAt } = this.eventsDivisionsStateSelected
      let firstHour = parseInt(startsAt, 10)
      let lastHour = firstHour

      if(times.length) {
        const firstTime = times[0].split(":")
        const firstTimeHour = parseInt(firstTime[0], 10)
        if(firstTimeHour < firstHour) firstHour = firstTimeHour

        const lastTime = times[times.length - 1].split(":")
        lastHour = parseInt(lastTime[0], 10)
      }

      const withMissingHours = Array.from(
        { length: lastHour - firstHour + 1 },
        (v, k) => k + firstHour
      )

      const timeline = withMissingHours.reduce((acc, hour) => {
        const existingTime = times.find((timeString) => {
          return hour === parseInt(timeString.split(":")[0], 10)
        })
        if(existingTime) {
          acc.push(existingTime)
        } else {
          let newHour: string | number = hour
          if(newHour < 10) newHour = `0${newHour}`
          acc.push(`${newHour}:00`)
        }
        return acc
      }, [])

      let newLastHour: string | number = lastHour + 1
      if(newLastHour < 10) newLastHour = `0${newLastHour}`

      let newFirstHour: string | number = firstHour - 1
      if(newFirstHour < 10) newFirstHour = `0${newFirstHour}`

      return [
        `${newFirstHour}:00`,
        ...timeline,
        `${newLastHour}:00`
        // `${newLastHour}:${lastTime[1]}`
      ]
    },

    stands() {
      if(!this.eventsDivisionsStateSelected) return

      const stands = this.getStandsByDivisionId(
        this.eventsDivisionsStateSelected.id
      )
      const { standsCount } = this.eventsDivisionsStateSelected
      let lastStand = Math.max(...stands)
      if(lastStand < standsCount) lastStand = standsCount

      return [
        ...Array.from({ length: lastStand }, (v, k) => k + 1),
        lastStand + 1
      ]
    },

    schedule(): object {
      if(!this.eventsDivisionsStateSelected) return
      return this.getScheduleByDivisionId(
        this.eventsDivisionsStateSelected.id
      )
    },

    unAssigned(): any {
      if(!this.eventsDivisionsStateSelected) return []
      return this.getUnAssignedByWeaponDistance(
        this.eventsDivisionsStateSelected.distance
      ).filter((item) => {
        if(
          !this.unAssignedSearchFilter ||
          this.unAssignedSearchFilter === ""
        ) {
          return true
        }
        return JSON.stringify(item)
          .toLowerCase()
          .includes(this.unAssignedSearchFilter.toLowerCase())
      })
    },

    hasSchedule(): boolean {
      if(!this.times || !this.stands) return false
      return this.times.length > 0 && this.stands.length > 0
    }
  },

  watch: {
    stands: "resizeColumn"
  },

  created() {
    const divisions = this.eventsDivisionsStateList
    if(!divisions.length) return
    this.eventsDivisionsActionsSelect({ id: divisions[0].id })
  },

  beforeDestroy(): void {
    this.eventsDivisionsMutationsSetSelected({})
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsSelect: "select"
    }),
    ...mapMutations("events/divisions", {
      eventsDivisionsMutationsSetSelected: "SET_SELECTED"
    }),
    ...mapActions("events/contestants", {
      eventsContestantsActionsEditOne: "editOne",
      eventsContestantsActionsEditMany: "editMany"
    }),

    changeDivision(id): void {
      this.eventsDivisionsActionsSelect({ id })
    },

    resizeColumn(): void {
      if(!this.hasDivision) return
      const stands = this.stands
      if(!stands) return
      this.$nextTick(() => {
        this.$refs.grid.style.gridTemplateColumns = "1fr "
          .repeat(stands.length)
          .slice(0, -1)
      })
    },

    getCell(e): HTMLElement {
      if(!e) return
      return e.path.find((elem) => (
        elem.className &&
        elem.className !== "" &&
        elem.className.includes("cell"))
      )
    },

    addDragOverClass(e: DragEvent): void {
      const cell: HTMLElement = this.getCell(e)
      if(cell) cell.classList.add("dragover")
    },

    removeDragOverClass(e: DragEvent): void {
      const cell: HTMLElement = this.getCell(e)
      cell.classList.remove("dragover")
    },

    dragOver(e: DragEvent): void {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = "move"
      this.addDragOverClass(e)
    },

    dragEnd(e: DragEvent): void {
      this.dragContestantId = null
      this.dragType = ""
      this.removeDragOverClass(e)
    },

    dragStartUnAssigned(e): void {
      this.dragType = "unAssigned"
      const data = e.target.dataset
      this.dragContestantId = data.contestantid
    },

    dragStartAssigned(e): void {
      this.dragType = "assigned"
      const data = e.target.dataset
      e.dataTransfer.setData("time", data.time)
      e.dataTransfer.setData("stand", data.stand)
      e.dataTransfer.effectAllowed = "move"
      this.dragContestantId = data.contestantid
    },

    dropAddOrUpdate(e: DragEvent): void {
      const cell = this.getCell(e)
      if(!cell) return
      const toTime = cell.dataset.time
      const toStand = cell.dataset.stand
      this.eventsContestantsActionsEditOne({
        ...this.eventsContestantsStateList.find(
          ({ id }) => this.dragContestantId === id
        ),
        time: toTime,
        stand: parseInt(toStand, 10),
        divisionId: this.eventsDivisionsStateSelected.id
      })
    },

    dropSwap(e: DragEvent): void {
      const cell = this.getCell(e)
      if(!cell) return
      const toTime = cell.dataset.time
      const toStand = cell.dataset.stand
      const contestants = []

      if(this.dragType === "unAssigned") {
        const dragContestant = this.eventsContestantsStateList.find(
          (c) => this.dragContestantId === c.id
        )
        contestants.push({
          ...dragContestant,
          time: toTime,
          stand: parseInt(toStand, 10),
          divisionId: this.eventsDivisionsStateSelected.id
        })

        const dropOnContestant = this.schedule[toTime][toStand]
        contestants.push({
          ...dropOnContestant,
          time: undefined,
          stand: undefined,
          divisionId: undefined,
          division: undefined
        })
      }

      if(this.dragType === "assigned") {
        const fromTime = e.dataTransfer.getData("time")
        const fromStand = e.dataTransfer.getData("stand")
        if(fromTime === toTime && fromStand === toStand) return

        const dragContestant = this.schedule[fromTime][fromStand]
        contestants.push({
          ...dragContestant,
          time: toTime,
          stand: parseInt(toStand, 10),
          divisionId: this.eventsDivisionsStateSelected.id
        })

        if(this.schedule[toTime] && this.schedule[toTime][toStand]) {
          const dropOnContestant = this.schedule[toTime][toStand]
          contestants.push({
            ...dropOnContestant,
            time: fromTime,
            stand: parseInt(fromStand, 10),
            divisionId: this.eventsDivisionsStateSelected.id
          })
        }
      }

      this.eventsContestantsActionsEditMany(contestants)
    },

    dropUnAssign(): void {
      const dropOnContestant = this.eventsContestantsStateList.find(
        (c) => this.dragContestantId === c.id
      )
      this.eventsContestantsActionsEditMany([{
        ...dropOnContestant,
        time: undefined,
        stand: undefined,
        divisionId: undefined,
        division: undefined
      }])
    },

    eventsDivisionsCreateDialogOpen(): void {
      this.$emit("eventsDivisionsCreateDialogOpen")
    },

    eventsDivisionsEditDialogOpen(division): void {
      this.$emit("eventsDivisionsEditDialogOpen", division)
    },

    eventsDivisionsRemoveOne(division): void {
      this.$emit("eventsDivisionsRemoveOne", division)
    },

    eventsContestantsCreateDialogOpen(time: string, stand: string): void {
      // @TODO: assign time / stand when choosing division
      this.$emit("eventsContestantsCreateDialogOpen", { time, stand })
    },

    eventsContestantsEditDialogOpen(contestant): void {
      // @TODO: assign time / stand when choosing division
      this.$emit("eventsContestantsEditDialogOpen", contestant)
    }
  }
})
</script>
