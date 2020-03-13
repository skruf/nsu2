<style scoped>
.avatar {
  @apply w-6 text-center py-1 mr-2 inline-block rounded font-semibold text-xs;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.avatar.small {
  @apply w-5;
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 10px;
}
</style>

<template>
  <div
    ref="avatar"
    class="avatar"
    :class="size"
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
    colour: { type: String, default: "#f1f2f3" },
    size: { type: String, default: "" }
  },
  mounted() {
    this.$refs.avatar.style.backgroundColor = this.colour
  }
})
</script>
