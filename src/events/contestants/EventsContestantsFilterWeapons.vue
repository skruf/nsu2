<template>
  <table-filter-select
    v-model="selection"
    v-slot="item"
    :items="weapons"
    :loading="loading"
    :item-text="weaponName"
    data-testid="eventsContestantsListTableFilterWeapon"
    single-line
    hide-details
    dense
    class="flex-1"
    label="Vis deltaker"
  >
    {{ weaponName(item) }}
  </table-filter-select>
</template>

<script lang="ts">
import _uniqueBy from "lodash.uniqby"
import Vue from "vue"
import TableFilterSelect
  from "@/components/TableFilterSelect.vue"

const _uniqueById = (array) => _uniqueBy(array, "id")

export default Vue.extend({
  name: "EventsContestantsFilterWeapons",

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
    weapons(): any {
      return _uniqueById(this.contestants.map(({ weapon }) => weapon))
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
    weaponName({ name }): string {
      return name
    }
  }
})
</script>
