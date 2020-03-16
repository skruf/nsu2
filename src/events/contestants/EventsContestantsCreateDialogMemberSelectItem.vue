<template>
  <div class="py-2 flex items-center justify-between">
    <div class="flex-1">
      {{ member.firstName }} {{ member.lastName }}
      <div class="text-muted">
        {{ $t("member") }}
      </div>
    </div>

    <div class="flex-1 text-sm">
      {{ member.club ? member.club.name : "-" }}
      <div class="text-muted">
        {{ $t("club") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "EventsContestantsCreateDialogMemberSelectItem",
  props: {
    member: { type: Object, required: true }
  }
})
</script>
