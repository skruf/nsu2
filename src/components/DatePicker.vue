<template>
  <v-menu
    ref="datePickerMenu"
    v-model="datePickerMenuShown"
    :close-on-content-click="false"
    :return-value.sync="v"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="input"
        :label="label"
        :data-testid="testid"
        :rules="rules"
        :class="className"
        readonly
        outlined
        required
        v-bind="attrs"
        v-on="on"
      />
    </template>

    <v-date-picker
      v-model="v"
      data-testid="datePicker"
      no-title
      scrollable
    >
      <v-spacer />

      <v-btn
        text
        color="primary"
        data-testid="datePickerCancelButton"
        @click="datePickerMenuShown = false"
      >
        {{ $t("cancel") }}
      </v-btn>

      <v-btn
        text
        color="primary"
        data-testid="datePickerSaveButton"
        @click="$refs.datePickerMenu.save(v)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue"
import moment from "moment"

export default Vue.extend({
  name: "DatePicker",

  props: {
    value: { type: String, default: (): string => "" },
    label: { type: String, required: true },
    testid: { type: String, default: (): string => "datepicker-input" },
    rules: { type: Array, default: (): boolean => false },
    format: { type: String, default: (): string => "DD-MMM-YY" },
    className: { type: String, default: (): string => "" }
  },

  data: () => ({
    datePickerMenuShown: false,
    v: ""
  }),

  computed: {
    input(): string {
      return this.value !== ""
        ? moment(this.value).format(this.format)
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
