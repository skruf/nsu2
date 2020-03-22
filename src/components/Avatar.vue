<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @apply w-4 text-center mr-2 inline-block rounded font-semibold text-xs bg-primary text-white;
  padding-top: 2px;
  padding-bottom: 2px;
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
