<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  functional: true,
  props: {
    contestant: { type: Object, required: true }
  },
  render(createElement, context: any) {
    const contestant = context.props.contestant
    const { weapon, condition, calibre } = contestant
    return context._v(`${weapon.name} (${condition.charAt(0)}) ${calibre}mm`)
  }
})
</script>
