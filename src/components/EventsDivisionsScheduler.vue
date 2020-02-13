<style scoped>
.grid-container {
  @apply flex flex-col border-b border-l border-solid border-border;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.contestant {
  @apply border-t border-r border-solid border-border flex flex-col items-center justify-center h-20 bg-white cursor-pointer;
}
.contestant:hover {
  @apply bg-gray-200;
}
.top-left-corner {
  @apply w-12 border-t border-r border-solid border-border;
}
.time {
  @apply border-t border-r border-solid border-border flex items-center justify-center flex-initial text-xs text-gray-700 h-20;
}
.lane {
  @apply flex-1 text-center border-t border-r border-solid border-border py-3 text-xs text-gray-700;
}
</style>

<template>
  <div class="-mx-px">
    <div class="flex max-w-xl p-5 pb-0">
      <!--
      v-model="selection"
      item-value="id"
      :data-testid="dataTestid"
      -->
      <div class="mr-2 flex-1">
        <v-select
          :items="[ '15 Marsj, 2020', '16 Marsj, 2020' ]"
          label="Dag"
          outlined
          single-line
          dense
          clearable
          append-icon="expand_more"
        />
      </div>

      <div class="ml-2 flex-1">
        <v-select
          :items="[ '25 meter', '50 meter' ]"
          label="Distanse"
          outlined
          single-line
          dense
          clearable
          append-icon="expand_more"
        />
      </div>
    </div>

    <div class="grid-container">
      <div class="flex">
        <div class="top-left-corner" />
        <div class="lane">
          1
        </div>
        <div class="lane">
          2
        </div>
        <div class="lane">
          3
        </div>
        <div class="lane">
          4
        </div>
      </div>

      <div class="flex">
        <div class="w-12">
          <div
            v-for="(time, index) of [
              '08:00', '09:00', '10:00',
              '11:00', '12:00', '13:00',
              '14:00', '15:00', '16:00'
            ]"
            :key="index"
            class="time"
          >
            {{ time }}
          </div>
        </div>

        <div
          ref="grid"
          class="grid flex-1"
        >
          <template v-for="(contestants, time) in schedule">
            <div
              v-for="(contestant, index) of contestants"
              :key="`${time}-${index}`"
              class="contestant"
            >
              <div class="text-sm -mb-1">
                {{ contestant.firstName }} {{ contestant.lastName }}
              </div>

              <div class="text-xs opacity-50">
                {{ contestant.weapon }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Sortable, Swap } from "sortablejs/modular/sortable.core.esm"

const cell = {
  id: "1",
  firstName: "Jackson",
  lastName: "Lopez",
  weapon: "Tordenskjold"
}

const row = {
  1: { ...cell },
  2: { ...cell },
  3: { ...cell },
  4: { ...cell },
}

export default Vue.extend({
  name: "EventsDivisionsScheduler",

  data() {
    return {
      schedule: {
        "08:00": { ...row },
        "09:00": { ...row },
        "10:00": { ...row },
        "11:00": { ...row },
        "12:00": { ...row },
        "13:00": { ...row },
        "14:00": { ...row },
        "15:00": { ...row },
        "16:00": { ...row }
      }
    }
  },

  mounted(): void {
    const grid = this.$refs.grid
    Sortable.mount(new Swap())
    Sortable.create(grid, {
      swap: true,
      handle: ".contestant",
      onEnd: () => {
        this.$notify({
          type: "warning",
          title: "Ikke implementert",
          message: "Kommer snart"
        })
      }
      // onEnd: this.eventsDivisionsContestantsActionsReorder
    })
  }
})
</script>
