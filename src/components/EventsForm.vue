<i18n>
{
  "en": {
    "eventsFormTitleLabel": "Title",
    "eventsFormTitlePlaceholder": "Enter a title",
    "eventsFormTitleError": "Title is a required field",
    "eventsFormDatesLabel": "Start / End",
    "eventsFormDatesPickerStart": "Start date",
    "eventsFormDatesPickerEnd": "End date",
    "eventsFormDatesError": "Dates is a required field",
    "eventsFormCategoryLabel": "Category",
    "eventsFormCategoryPlaceholder": "Select a category",
    "eventsFormCategoryError": "Category is a required field",
    "eventsFormOrganizerLabel": "Organizer",
    "eventsFormOrganizerPlaceholder": "Select the organizer",
    "eventsFormOrganizerError": "Organizer is a required field",
    "eventsFormRangeLabel": "Range",
    "eventsFormRangePlaceholder": "Select the range",
    "eventsFormRangeError": "Range is a required field",
    "eventsFormApprobatedLabel": "Approbated",
    "eventsFormApprobatedActiveText": "Is officially approbated",
    "eventsFormStartsAtLabel": "Starts at",
    "eventsFormStartsAtError": "Start is a required field",
    "eventsFormEndsAtLabel": "Ends at",
    "eventsFormEndsAtError": "End is a required field"
  },
  "no": {
    "eventsFormTitleLabel": "Tittel",
    "eventsFormTitlePlaceholder": "Skriv inn tittel",
    "eventsFormTitleError": "Tittel er et påkrevd felt",
    "eventsFormDatesLabel": "Start / Slutt",
    "eventsFormDatesPickerStart": "Start dato",
    "eventsFormDatesPickerEnd": "Slutt dato",
    "eventsFormDatesError": "Dato er et påkrevd felt",
    "eventsFormCategoryLabel": "Kategori",
    "eventsFormCategoryPlaceholder": "Velg en kategori",
    "eventsFormCategoryError": "Kategori er et påkrevd felt",
    "eventsFormOrganizerLabel": "Arrangør",
    "eventsFormOrganizerPlaceholder": "Velg en klubb",
    "eventsFormOrganizerError": "Arrangør er et påkrevd felt",
    "eventsFormRangeLabel": "Skyttebane",
    "eventsFormRangePlaceholder": "Velg en skyttebane",
    "eventsFormRangeError": "Skyttebane er et påkrevd felt",
    "eventsFormApprobatedLabel": "Approbert",
    "eventsFormApprobatedActiveText": "Er offisielt approbert",
    "eventsFormStartsAtLabel": "Starter den",
    "eventsFormStartsAtError": "Starter er et påkrevet felt",
    "eventsFormEndsAtLabel": "Slutter den",
    "eventsFormEndsAtError": "Slutter er et påkrevet felt"
  }
}
</i18n>

<template>
  <v-form ref="localForm">
    <v-text-field
      v-model="value.title"
      :label="$t('eventsFormTitleLabel')"
      :rules="[(v) => !!v || $t('eventsFormTitleError')]"
      data-testid="eventsFormTitleInput"
      class="mb-3"
      outlined
      required
    />

    <div class="flex">
      <date-picker
        v-model="value.startsAt"
        :label="$t('eventsFormStartsAtLabel')"
        :rules="[(v) => !!v || $t('eventsFormStartsAtError')]"
        class-name="mr-2"
        data-testid="eventsFormStartsAtInput"
        required
      />

      <date-picker
        v-model="value.endsAt"
        :label="$t('eventsFormEndsAtLabel')"
        :rules="[(v) => !!v || $t('eventsFormEndsAtError')]"
        class-name="ml-2"
        data-testid="eventsFormEndsAtInput"
        required
      />
    </div>

    <v-select
      v-model="value.categoryId"
      :items="eventsCategoriesStateList"
      :loading="eventsCategoriesStateListIsLoading"
      :label="$t('eventsFormCategoryLabel')"
      data-testid="eventsFormCategorySelect"
      item-text="name"
      item-value="id"
      class="mb-3"
      outlined
    />

    <v-select
      v-model="value.organizerId"
      :items="clubsStateList"
      :loading="clubsStateListIsLoading"
      :label="$t('eventsFormOrganizerLabel')"
      item-text="name"
      item-value="id"
      data-testid="eventsFormOrganizerSelect"
      class="mb-3"
      outlined
    />

    <v-select
      v-model="value.rangeId"
      :items="rangesStateList"
      :loading="rangesStateListIsLoading"
      :label="$t('eventsFormRangeLabel')"
      item-text="name"
      item-value="id"
      data-testid="eventsFormRangeSelect"
      class="mb-3"
      outlined
    />

    <v-switch
      v-model="value.approbated"
      :label="$t('eventsFormApprobatedLabel')"
      data-testid="eventsFormApprobatedSwitch"
    />

    <error-validation-notification
      v-model="showValidationError"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import { eventsStub } from "@/stubs"
import DatePicker from "@/components/DatePicker.vue"
import ErrorValidationNotification from "@/components/ErrorValidationNotification.vue"

export default Vue.extend({
  name: "EventsForm",

  components: {
    DatePicker,
    ErrorValidationNotification
  },

  props: {
    value: { type: Object, default: (): object => eventsStub }
  },

  data: () => ({
    showValidationError: false
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "createIsLoading",
      clubsStateList: "list"
    }),

    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list"
    }),

    ...mapState("events/categories", {
      eventsCategoriesStateListIsLoading: "listIsLoading",
      eventsCategoriesStateList: "list"
    })
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(data): void {
        this.$emit("input", data)
      }
    }
  },

  created() {
    // @TODO: check if stale
    this.clubsActionsList()
    this.rangesActionsList()
    this.eventsCategoriesActionsList()
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsList: "list"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    ...mapActions("events/categories", {
      eventsCategoriesActionsList: "list"
    }),

    submit(cb): void {
      this.$refs.localForm.validate()
        ? cb()
        : this.showValidationError = true
    },

    resetFields(): void {
      this.$refs.localForm.reset()
    }
  }
})
</script>
