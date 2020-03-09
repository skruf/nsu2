<style scoped>
.textarea-hover {

}
.textarea-wrapper {
  display: none;
}
.textarea-hover:hover .textarea-wrapper,
.textarea-wrapper:focus {
  display: block;
}
</style>

<template>
  <div class="textarea-hover relative">
    <div>
      {{ value }}
    </div>

    <div class="textarea-wrapper -m-2 p-2 bg-white absolute inset-0 border-border border-solid border rounded-md">
      <textarea
        v-model="value"
        class="w-full h-full -ml-px -mt-px"
      />
    </div>

    <!-- <v-textarea
      v-model="editValue"
      v-bind="$attrs"
      :rules="[(v) => !!v || $t('eventsContestantsResultsNotesInputError')]"
      class="textarea-hover-input absolute inset-0 w-full h-full"
      hide-details
      auto-grow
      light
    /> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "EventsContestantsNotes",

  props: {
    value: { type: String, required: true },
    loading: { type: Boolean, default: false },
    dataTestid: { type: String, required: false, default: "" }
  },

  data() {
    return {
      editValue: ""
    }
  },

  watch: {
    editValue(v): void {
      this.$emit("input", v)
    }
  },

  created() {
    this.editValue = this.value
  },

  methods: {
    submit() {
      //
    }
  }
})
</script>
