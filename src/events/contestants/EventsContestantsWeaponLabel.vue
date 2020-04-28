<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  functional: true,
  props: {
    contestant: { type: Object, required: true },
    showCalibre: { type: Boolean, default: true }
  },
  render(createElement, context: any) {
    const contestant = context.props.contestant
    const { weapon, calibre } = contestant
    // (${condition.charAt(0)})
    let s = `${weapon.name}`
    if(context.props.showCalibre) s = `${s} ${calibre}`
    return context._v(s)
  }
})
</script>
