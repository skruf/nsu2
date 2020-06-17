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

.grid,
.time-labels {
  padding-top: 43px;
}

.grid {
  overflow-x: auto;
  position: relative;
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
}

/* .contestant-cell.dragging {
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
  min-height: 5rem;
  break-before: page;
}

.top-left-corner {
  @apply absolute top-0 left-0 right-0;
}

.top-left-corner,
.lane {
  @apply bg-white;
  height: 42px;
}

.time-labels {
  @apply h-full relative;
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

.add-cell {
  cursor: default;
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

.contestant-sticker-container {
  @apply w-full bg-white items-center justify-center flex-wrap;
  margin-top: -84px;
  display: none;
}
.contestant-sticker-cell {
  break-before: page;
  @apply items-center justify-center inline-flex flex-col w-1/3 bg-white border-b border-r border-solid border-border text-sm p-3;
  min-height: 37mm;
  max-height: 37mm;
}
.contestant-sticker-cell:nth-child(3n) {
  @apply border-r-0;
}
.contestant-sticker-cell-wrapper {
  @apply max-w-xs w-full mx-auto flex flex-col justify-center;
}
.contestant-sticker-cell-container {
  display: flex;
  flex: initial;
}
.contestant-sticker-cell-key {
  min-width: 4.5rem;
}
.placeholder-container {
  @apply border-border border-t border-solid p-5 flex flex-col items-center justify-center h-64;
}

@media print {
  .cell,
  .lane {
    min-width: 0;
  }
  .top-left-corner,
  .time,
  .lane,
  .cell {
    @apply border-border border-r border-b border-solid;
  }
  .top-left-corner,
  .time {
    @apply border-l;
  }
  .time:last-child,
  .cell:last-child {
    border-radius: 0;
  }
  .print-mode-divisionStickers .contestant-sticker-container {
    display: block;
  }
  .print-mode-divisionStickers .schedule-container {
    display: none;
  }
  .print-mode-divisionSchedule .schedule-container {
    @apply absolute inset-x-0 top-0 w-full z-10 m-0 rounded-none border-0 border-t;
  }
  .grid {
    @apply ml-0;
  }
  .time-labels,
  .lane-labels,
  .grid,
  .unassigned-contestants {
    grid-gap: 0px;
  }
  .grid,
  .time-labels {
    padding-top: 42px;
  }
  .add-cell .v-icon {
    display: none;
  }
  .time span,
  .lane span {
    opacity: 1 !important;
  }
  .cell > * {
    font-size: 12px;
  }
}
</style>

<style>
.unassigned-search-filter .v-input__slot::before {
  border-color: #dce3e6 !important;
}

.unassigned-search-filter .v-input__slot {
  @apply px-4 pt-1 pb-2;
}

.unassigned-search-filter .v-label {
  font-size: 0.9rem;
}

@media print {
  .schedule-container .v-text-field--outlined fieldset {
    border: none;
  }
  .schedule-container .v-text-field--outlined .v-input__append-inner,
  .schedule-container .v-input .v-label {
    display: none;
  }
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
    "unAssignedTitle": "Unassigned contestants",
    "divisionsPlaceholder": "No divisions selected. Pick one above or create a new."
  },
  "no": {
    "eventsDivisionsListTableNoDataText": "Ingen deltakere enda",
    "eventsDivisionsListTableCreateDialogOpenButton": "Legg til ny?",
    "eventsDivisionsSearchFilterPlaceholder": "Søk etter standplasslister",
    "unAssignedSearchFilterLabel": "Søk etter deltakere",
    "divisionSelectLabel": "Standplassliste",
    "unAssignedContestantsNoData": "Ingen tilgjengelige deltakere",
    "unAssignedTitle": "Tilgjengelige deltakere",
    "divisionsPlaceholder": "Ingen valgt standplasslister. Velg en ovenfor eller opprett ny."
  }
}
</i18n>

<template>
  <div class="flex items-start">
    <div
      v-if="hasDivision && hasSchedule"
      class="contestant-sticker-container"
    >
      <template v-for="time of times">
        <template v-for="stand of stands">
          <div
            v-if="schedule[time] && schedule[time][stand]"
            :key="`${time}-${stand}`"
            class="contestant-sticker-cell"
          >
            <div class="contestant-sticker-cell-wrapper">
              <div class="contestant-sticker-cell-container">
                <div class="contestant-sticker-cell-key">
                  Nr:
                </div>
                <div>
                  {{ schedule[time][stand].number }}
                </div>
              </div>

              <div class="contestant-sticker-cell-container">
                <div class="contestant-sticker-cell-key">
                  Dato:
                </div>
                <div>
                  {{ eventsDivisionsStateSelected.day }}
                </div>
              </div>

              <div class="contestant-sticker-cell-container">
                <div class="contestant-sticker-cell-key">
                  Tid:
                </div>
                <div>
                  {{ time }}
                </div>
              </div>

              <div class="contestant-sticker-cell-container">
                <div class="contestant-sticker-cell-key">
                  Bane:
                </div>
                <div>
                  {{ stand }}
                </div>
              </div>

              <div class="contestant-sticker-cell-container">
                <div class="contestant-sticker-cell-key">
                  Våpen:
                </div>
                <div>
                  <events-contestants-weapon-label
                    :contestant="schedule[time][stand]"
                    :show-calibre="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>

    <div class="container schedule-container flex">
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
              class="mb-2 w-full"
              data-testid="eventsDivisionsCreateDialogOpenButton"
              @click.stop="eventsDivisionsCreateDialogOpen"
            >
              <v-icon left>
                add
              </v-icon>
              {{ $t("create") }} {{ $t("division") }}
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
                <avatar
                  class="mx-0 absolute left-0 top-0 print:static"
                  style="border-radius:0;"
                  size="small"
                  :colour="schedule[time][stand].colour"
                  :value="schedule[time][stand].number"
                />

                <div>
                  <events-contestants-name-label
                    :contestant="schedule[time][stand]"
                  />
                </div>

                <div class="text-muted">
                  <events-contestants-weapon-label
                    :contestant="schedule[time][stand]"
                  />
                </div>
              </div>

              <div
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
              >
                <v-icon small>
                  add
                </v-icon>
              </div>
            </template>
          </template>
        </div>
      </div>

      <div
        v-else
        class="placeholder-container"
      >
        <div class="text-muted">
          {{ $t("divisionsPlaceholder") }}
        </div>

        <v-btn
          text
          class="mb-2"
          data-testid="eventsDivisionsCreateDialogOpenButton"
          @click.stop="eventsDivisionsCreateDialogOpen"
        >
          <v-icon left>
            add
          </v-icon>
          {{ $t("create") }} {{ $t("division") }}
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
            <avatar
              class="mx-0 absolute left-0 top-0"
              style="border-radius:0;"
              size="small"
              :colour="contestant.colour"
              :value="contestant.number"
            />

            <div>
              <events-contestants-name-label
                :contestant="contestant"
              />
            </div>

            <div class="text-muted">
              <events-contestants-weapon-label
                :contestant="contestant"
              />
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
import EventsContestantsNameLabel
  from "../contestants/EventsContestantsNameLabel.vue"
import EventsContestantsWeaponLabel
  from "../contestants/EventsContestantsWeaponLabel.vue"

export default Vue.extend({
  name: "EventsDivisionsScheduler",

  components: {
    Avatar,
    EventsDivisionsSchedulerDivisionSelectItem,
    EventsContestantsNameLabel,
    EventsContestantsWeaponLabel
  },

  data() {
    return {
      unAssignedSearchFilter: "",
      dragContestantId: null,
      dragType: "",
      isPrinting: false,
      mql: null
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

    // @TODO: handle last time 24:00
    // @TODO: handle minutes (ie. 10:00 + 10:30)
    times() {
      if(!this.eventsDivisionsStateSelected) return
      const times = this.getTimesByDivisionId(this.eventsDivisionsStateSelected.id)

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

      return this.isPrinting
        ? timeline
        : [
          `${newFirstHour}:00`,
          ...timeline,
          `${newLastHour}:00`
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

      const scheduleStands = Array.from({ length: lastStand }, (v, k) => k + 1)
      return this.isPrinting
        ? scheduleStands
        : [
          ...scheduleStands,
          lastStand + 1
        ]
    },

    schedule() {
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
    this.mql = window.matchMedia("print")
    this.mql.addListener(this.onPrinting)
    const divisions = this.eventsDivisionsStateList
    if(!divisions.length) return
    this.eventsDivisionsActionsSelect({ id: divisions[0].id })
  },

  beforeDestroy(): void {
    this.eventsDivisionsMutationsSetSelected({})
    this.mql.removeListener(this.onPrinting)
  },

  methods: {
    onPrinting(e: MediaQueryList | MediaQueryListEvent): void {
      this.isPrinting = e.matches
      this._update(this._render())
      this.setGridTemplateColumns()
    },

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

    setGridTemplateColumns(): void {
      this.$refs.grid.style.gridTemplateColumns = "1fr "
        .repeat(this.stands.length)
        .slice(0, -1)
    },

    resizeColumn(): void {
      if(!this.hasDivision) return
      const stands = this.stands
      if(!stands) return
      this.$nextTick(() => {
        this.setGridTemplateColumns()
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
      this.$emit("eventsContestantsCreateDialogOpen", { time, stand })
    },

    eventsContestantsEditDialogOpen(contestant): void {
      this.$emit("eventsContestantsEditDialogOpen", contestant)
    }
  }
})
</script>
