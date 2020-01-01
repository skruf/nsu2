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
    "eventsFormApprobatedActiveText": "Is officially approbated"
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
    "eventsFormApprobatedActiveText": "Er offisielt approbert"
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

    <v-menu
      ref="eventsFormStartTimeDialog"
      v-model="eventsFormStartTimeDialogShow"
      :close-on-content-click="false"
      :return-value.sync="startEndAt"
      data-testid="eventsFormStartsAtMenu"
      transition="scale-transition"
      min-width="290px"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="eventsFormStartEndInput"
          :label="$t('eventsFormDatesLabel')"
          :rules="[(v) => !!v || $t('eventsFormTitleError')]"
          data-testid="eventsFormStartsAtInput"
          readonly
          outlined
          v-on="on"
        />
      </template>

      <v-date-picker
        v-model="startEndAt"
        :range="true"
        no-title
        scrollable
      >
        <v-spacer />

        <v-btn
          text
          color="primary"
          data-testid="eventsFormStartsAtCancelButton"
          @click="eventsFormStartTimeDialogShow = false"
        >
          {{ $t("close") }}
        </v-btn>

        <v-btn
          text
          color="primary"
          data-testid="eventsFormStartsAtOkButton"
          @click="$refs.eventsFormStartTimeDialog.save(startEndAt)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-menu>

    <v-select
      v-model="value.categoryId"
      :items="eventsCategoriesStateList"
      :loading="eventsCategoriesStateListIsLoading"
      :label="$t('eventsFormCategoryLabel')"
      item-text="name"
      item-value="id"
      data-testid="eventsFormCategorySelect"
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

    <v-snackbar
      v-model="showValidationError"
      color="error"
      multi-line
      right
      top
    >
      <v-icon
        color="white"
        class="mr-4"
      >
        error
      </v-icon>

      {{ $t("validationError") }}

      <v-btn
        text
        data-testid="eventsFormErrorCloseButton"
        @click="showValidationError = false"
      >
        {{ $t("close") }}
      </v-btn>
    </v-snackbar>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import { eventsStub } from "@/stubs"

export default Vue.extend({
  name: "EventsForm",

  props: {
    value: { type: Object, default: (): object => eventsStub }
  },

  data: () => ({
    showValidationError: false,
    eventsFormStartTimeDialogShow: false,
    startEndAt: []
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
    }),

    eventsFormStartEndInput(): string {
      return [ this.value.startsAt, this.value.endsAt ].join(" / ")
    }
  },

  watch: {
    startEndAt: {
      handler(v): void {
        if(v.length > 0) this.value.startsAt = v[0]
        if(v.length > 1) this.value.endsAt = v[1]
      }
    },
    value: {
      deep: true,
      immediate: true,
      handler(data): void {
        this.$emit("input", data)
      }
    }
  },

  created() {
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
