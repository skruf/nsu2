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

    const n = weapon.name

    const q = n.split(" - ")
    const short = q[0]
    const or = q[1].charAt(0)

    const s = `${short} ${or}`

    console.log(q)

    // let s = `${weapon.name}`
    // if(context.props.showCalibre) s = `${s} ${short}`
    // if(context.props.showCalibre) s = `${s} ${calibre}`
    return context._v(s)
  }
})
</script>
