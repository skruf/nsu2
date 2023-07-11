<template>
  <table-filter-select
    v-slot="item"
    v-model="selection"
    :items="divisions"
    :loading="loading"
    :item-text="divisionName"
    data-testid="eventsContestantsListTableFilterDivision"
    single-line
    hide-details
    dense
    class="flex-1"
    label="Vis standplassliste"
  >
    {{ divisionName(item) }}
  </table-filter-select>
</template>

<script lang="ts">
import _uniqueBy from "lodash.uniqby"
import Vue from "vue"
import { sortCollator } from "@/utils"
import TableFilterSelect
  from "@/components/TableFilterSelect.vue"

const _uniqueById = (array) => _uniqueBy(array, "id")

export default Vue.extend({
  name: "EventsContestantsFilterDivisions",

  components: {
    TableFilterSelect
  },

  props: {
    value: { type: Array, required: true },
    contestants: { type: Array, required: true },
    loading: { type: Boolean, required: false }
  },

  data() {
    return {
      selection: []
    }
  },

  computed: {
    divisions(): any {
      return _uniqueById(this.contestants.map(({ division }) => division))
        .sort((a, b) => {
          if(!a?.startsAt || !b?.startsAt) return -1
          const _a = a.day ? `${a.day} ${a.startsAt}` : a.startsAt
          const _b = b.day ? `${b.day} ${b.startsAt}` : b.startsAt
          return sortCollator.compare(_a, _b)
        })
    }
  },

  watch: {
    selection(v): void {
      this.$emit("input", v)
    }
  },

  created() {
    this.selection = this.value
  },

  methods: {
    divisionName(division): string {
      return division && division.day && division.distance
        ? `${this.$date(division.day).format("dddd DD MMM")} - ${division.distance} meter`
        : "Ikke tildelt"
    }
  }
})
</script>
