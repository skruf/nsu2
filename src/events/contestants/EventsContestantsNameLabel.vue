<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  functional: true,
  props: {
    contestant: { type: Object, required: true }
  },
  render(createElement, context: any) {
    const contestant = context.props.contestant
    const { firstName, lastName } = contestant.clubMember
    return context._v(`${firstName} ${lastName}`)
  }
})
</script>
