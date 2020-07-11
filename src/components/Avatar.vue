<style scoped>
.avatar {
  @apply inline-flex items-center justify-center text-center mr-2 rounded font-semibold text-xs bg-primary text-white;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 1.1rem;
}

@media print {
  .avatar {
    @apply py-0 mr-0 w-auto bg-transparent;
    color: inherit;
  }
}
</style>

<template>
  <div
    ref="avatar"
    class="avatar"
    :class="size"
    v-bind="$attrs"
  >
    {{ value }}
  </div>
</template>

<script>
import Vue from "vue"

export default Vue.extend({
  name: "Avatar",
  props: {
    value: { type: [ String, Number ], required: true },
    colour: { type: String, default: null },
    size: { type: String, default: "" }
  },
  // mounted() {
  //   if(!this.colour) return
  //   this.$refs.avatar.style.backgroundColor = this.colour
  // }
})
</script>
