<style>
input[type=date]::-webkit-inner-spin-button,
input[type=date]::-webkit-calendar-picker-indicator {
  -webkit-appearance: none;
  display: none;
}
</style>

<template>
  <v-menu
    ref="datePickerMenu"
    v-model="datePickerMenuShown"
    :return-value.sync="v"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="v"
        :label="label"
        :data-testid="dataTestid"
        :rules="rules"
        :class="className"
        :dense="dense"
        type="date"
        hint="DD/MM/YYYY"
        outlined
        v-bind="attrs"
        v-on="on"
        @keydown.enter="$refs.datePickerMenu.save(v)"
      />
    </template>

    <v-date-picker
      v-model="v"
      data-testid="datePicker"
      no-title
      scrollable
      @input="$refs.datePickerMenu.save(v)"
    />
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "DatePicker",

  props: {
    value: { type: String, default: (): string => "" },
    label: { type: String, required: true },
    dataTestid: { type: String, default: (): string => "datepicker-input" },
    rules: { type: Array, default: (): boolean => false },
    format: { type: String, default: (): string => "DD-MMM-YY" },
    className: { type: String, default: (): string => "" },
    dense: { type: Boolean, default: false, required: false }
  },

  data: () => ({
    datePickerMenuShown: false,
    v: ""
  }),

  computed: {
    input(): string {
      return this.value !== ""
        ? this.$date(this.value).format(this.format)
        : ""
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(data): void {
        if(data !== this.v) this.v = data
      }
    },

    v(v): void {
      this.$emit("input", v)
    }
  }
})
</script>
