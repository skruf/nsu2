<template>
  <table-filter-select
    v-slot="item"
    v-model="selection"
    :items="clubs"
    :loading="loading"
    :item-text="clubName"
    data-testid="eventsContestantsListTableFilterClub"
    single-line
    hide-details
    dense
    class="flex-1"
    label="Vis klubb"
  >
    {{ clubName(item) }}
  </table-filter-select>
</template>

<script lang="ts">
import _uniqueBy from "lodash.uniqby"
import Vue from "vue"
import TableFilterSelect
  from "@/components/TableFilterSelect.vue"

const _uniqueById = (array) => _uniqueBy(array, "id")

export default Vue.extend({
  name: "EventsContestantsFilterClubs",

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
    clubsMembers(): any {
      return _uniqueById(this.contestants.map(({ clubMember }) => clubMember))
    },
    clubs(): any {
      return _uniqueById(this.clubsMembers.map(({ club }) => club))
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
    clubName(club): string {
      return club && club.name
        ? `${club.name} (${club.shortName})`
        : "Ikke tildelt"
    }
  }
})
</script>
