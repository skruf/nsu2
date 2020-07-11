<template>
  <div class="py-2 flex items-center w-full">
    <div class="flex-1">
      {{ division.day | date("dddd") }}
      <!-- kl. {{ division.startsAt }} -->
      <!-- [{{ division.eventId }}] -->
      <div class="text-muted">
        {{ division.day | date }}
      </div>
    </div>

    <div class="flex-1">
      {{ division.distance }} meter
      <div class="text-muted">
        Distanse
      </div>
    </div>

    <div class="flex-1">
      kl. {{ division.startsAt }}
      <div class="text-muted">
        Første start
      </div>
    </div>

    <div class="flex-1">
      kl. {{ division.endsAt }}
      <div class="text-muted">
        Siste start
      </div>
    </div>

    <div class="flex-1">
      {{ division.standsCount }}
      <div class="text-muted">
        Baner
      </div>
    </div>

    <div class="flex-1">
      {{ division.contestantsCount }}
      <div class="text-muted">
        Starter
      </div>
    </div>

    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "EventsDivisionsSchedulerDivisionSelectItem",
  props: {
    division: { type: Object, required: true }
  }
})
</script>
