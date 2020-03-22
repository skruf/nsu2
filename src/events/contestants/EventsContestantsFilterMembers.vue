<template>
  <table-filter-select
    v-slot="item"
    v-model="selection"
    :items="members"
    :loading="loading"
    :item-text="fullName"
    data-testid="eventsContestantsListTableFilterClubMember"
    single-line
    hide-details
    dense
    class="flex-1"
    label="Vis deltaker"
  >
    {{ fullName(item) }}
  </table-filter-select>
</template>

<script lang="ts">
import _uniqueBy from "lodash.uniqby"
import Vue from "vue"
import TableFilterSelect
  from "@/components/TableFilterSelect.vue"

const _uniqueById = (array) => _uniqueBy(array, "id")

export default Vue.extend({
  name: "EventsContestantsFilterMembers",

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
    members(): any {
      return _uniqueById(this.contestants.map(({ clubMember }) => clubMember))
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
    fullName({ firstName, lastName }): string {
      return `${firstName} ${lastName}`
    }
  }
})
</script>
