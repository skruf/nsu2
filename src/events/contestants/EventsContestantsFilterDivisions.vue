<template>
  <table-filter-select
    v-model="selection"
    v-slot="item"
    :items="divisions"
    :loading="loading"
    :item-text="divisionName"
    data-testid="eventsContestantsListTableFilterClubMember"
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
import moment from "moment"
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
      return _uniqueById(
        this.contestants.map(({ division }) => division)
      )
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
        ? `${moment(division.day).format("ddd, DD/MMM")} - ${division.distance} meter`
        : "Ikke tildelt"
    }
  }
})
</script>
