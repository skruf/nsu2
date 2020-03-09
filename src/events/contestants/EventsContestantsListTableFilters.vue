<template>
  <v-form
    ref="filterForm"
    class="flex items-center"
  >
    <table-filter-select
      v-model="value.clubMemberIds"
      v-slot="item"
      :items="clubsMembers"
      :loading="loading"
      :item-text="({ firstName, lastName }) => `${firstName} ${lastName}`"
      data-testid="eventsContestantsListTableFilterClubMember"
      single-line
      hide-details
      dense
      class="flex-1"
      label="Vis deltaker"
    >
      {{ item.firstName }} {{ item.lastName }}
    </table-filter-select>

    <table-filter-select
      v-model="value.clubIds"
      v-slot="item"
      :items="clubs"
      :loading="loading"
      :item-text="({ name, shortName }) => `${name} (${shortName})`"
      data-testid="eventsContestantsListTableFilterClub"
      single-line
      hide-details
      dense
      class="flex-1 mx-5"
      label="Vis klubb"
    >
      {{ item.shortName }}
    </table-filter-select>

    <table-filter-select
      v-model="value.weaponIds"
      v-slot="item"
      :items="weapons"
      :loading="loading"
      item-text="name"
      data-testid="eventsContestantsListTableFilterWeapon"
      single-line
      hide-details
      dense
      class="flex-1"
      label="Vis våpen"
    >
      {{ item.name }}
    </table-filter-select>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import TableFilterSelect from "@/components/TableFilterSelect.vue"

export default Vue.extend({
  name: "EventsContestantsListTableFilters",

  components: {
    TableFilterSelect
  },

  props: {
    value: { type: Object, required: true },
    contestants: { type: Array, required: true },
    loading: { type: Boolean, required: false }
  },

  computed: {
    clubsMembers(): [] {
      return this.contestants.map(({ clubMember }) => clubMember)
    },
    weapons(): [] {
      return this.contestants.map(({ weapon }) => weapon)
    },
    clubs(): [] {
      return this.clubsMembers.map(({ club }) => club)
    }
  }
})
</script>
