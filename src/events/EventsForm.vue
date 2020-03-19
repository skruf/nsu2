<i18n>
{
  "en": {
    "eventsFormTitleLabel": "Title (*)",
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
    "eventsFormStartsAtLabel": "Starts at (*)",
    "eventsFormStartsAtError": "Start is a required field",
    "eventsFormEndsAtLabel": "Ends at (*)",
    "eventsFormEndsAtError": "End is a required field",
    "eventsCategoriesRemoveOneConfirmation": "This will remove %{eventsCategoryName} and events that used this category permanently. Continue?",
    "eventsCategoriesActionsRemoveOneSuccess": "%{eventsCategoryName} was removed from the database",
    "eventsCategoriesRemoveManyConfirmation": "This will remove %{eventsCategoriesCount} categories and events that used these categories permanently. Continue?",
    "eventsCategoriesActionsRemoveManySuccess": "%{eventsCategoriesCount} eventsCategories has been removed from the database"
  },
  "no": {
    "eventsFormTitleLabel": "Tittel (*)",
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
    "eventsFormStartsAtLabel": "Starter den (*)",
    "eventsFormStartsAtError": "Starter er et påkrevet felt",
    "eventsFormEndsAtLabel": "Slutter den (*)",
    "eventsFormEndsAtError": "Slutter er et påkrevet felt",
    "eventsCategoriesRemoveOneConfirmation": "Dette vil fjerne %{eventsCategoryName} og stevner som brukte denne kategorien permanent. Fortsette?",
    "eventsCategoriesActionsRemoveOneSuccess": "%{eventsCategoryName} ble fjernet fra databasen",
    "eventsCategoriesRemoveManyConfirmation": "Dette vil fjerne %{eventsCategoriesCount} kategorier og stevner som brukte denne kategorien permanent. Fortsette?",
    "eventsCategoriesActionsRemoveManySuccess": "%{eventsCategoriesCount} kategorier ble fjernet fra databasen"
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

    <div class="flex mb-3">
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

    <v-autocomplete
      v-model="value.categoryId"
      :items="eventsCategoriesStateList"
      :label="$t('eventsFormCategoryLabel')"
      :loading="eventsCategoriesIsLoading"
      data-testid="eventsFormCategorySelect"
      item-text="name"
      item-value="id"
      class="mb-3"
      outlined
      append-icon="expand_more"
    >
      <template v-slot:prepend-item>
        <v-btn
          text
          class="py-4 mb-2 w-full"
          data-testid="eventsCategoriesCreateDialogOpenButton"
          @click.stop="eventsCategoriesCreateDialogOpen"
        >
          <v-icon left>
            add
          </v-icon>
          {{ $t("create") }} {{ $t("category") }}
        </v-btn>
      </template>

      <template v-slot:item="{ item }">
        <div class="flex justify-between items-center">
          {{ item.name }}

          <v-menu>
            <template v-slot:activator="{ on: { click }, attrs }">
              <v-btn
                data-testid="eventsCategoriesSelectDropdown"
                small
                icon
                v-bind="attrs"
                @click.stop="click"
              >
                <v-icon>
                  more_horiz
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                data-testid="eventsCategoriesEditDialogOpen"
                @click.stop="eventsCategoriesEditDialogOpen(item)"
              >
                <v-list-item-title class="flex items-center">
                  <v-icon>
                    edit
                  </v-icon>
                  <span class="ml-2">
                    {{ $t("edit") }} {{ $t("category") }}
                  </span>
                </v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item
                data-testid="eventsCategoriesRemoveOne"
                @click.stop="eventsCategoriesRemoveOne(item)"
              >
                <v-list-item-title class="flex items-center">
                  <v-icon color="red">
                    delete_forever
                  </v-icon>
                  <span class="ml-2 red--text">
                    {{ $t("remove") }} {{ $t("category") }}
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-autocomplete>

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

    <events-categories-create-dialog
      :shown.sync="eventsCategoriesCreateDialogShown"
      @created="setCategory"
    />

    <events-categories-edit-dialog
      :shown.sync="eventsCategoriesEditDialogShown"
      :events-category="eventsCategoriesEditDialogEventsCategory"
      @edited="setCategory"
    />

    <confirm ref="confirm" />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import eventsStub from "./events.stub"
import DatePicker from "@/components/DatePicker.vue"
import EventsCategoriesCreateDialog
  from "./categories/EventsCategoriesCreateDialog.vue"
import EventsCategoriesEditDialog
  from "./categories/EventsCategoriesEditDialog.vue"
import Confirm from "@/components/Confirm.vue"

export default Vue.extend({
  name: "EventsForm",

  components: {
    DatePicker,
    EventsCategoriesCreateDialog,
    EventsCategoriesEditDialog,
    Confirm
  },

  props: {
    value: { type: Object, default: (): object => eventsStub }
  },

  data: () => ({
    eventsCategoriesCreateDialogShown: false,
    eventsCategoriesEditDialogShown: false,
    eventsCategoriesEditDialogEventsCategory: {}
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
      eventsCategoriesStateList: "list",
      eventsCategoriesStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsCategoriesStateRemoveManyIsLoading: "removeManyIsLoading"
    }),

    eventsCategoriesIsLoading(): boolean {
      return (
        this.eventsCategoriesStateRemoveOneIsLoading ||
        this.eventsCategoriesStateRemoveManyIsLoading ||
        this.eventsCategoriesStateListIsLoading
      )
    }
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
      eventsCategoriesActionsList: "list",
      eventsCategoriesActionsRemoveOne: "removeOne",
      eventsCategoriesActionsRemoveMany: "removeMany"
    }),

    submit(cb): void {
      this.$refs.localForm.validate()
        ? cb()
        : this.$error(this.$t("validationError"))
    },

    resetFields(): void {
      this.$refs.localForm.reset()
    },

    eventsCategoriesCreateDialogOpen(): void {
      this.eventsCategoriesCreateDialogShown = true
    },

    eventsCategoriesEditDialogOpen(eventsCategory): void {
      this.eventsCategoriesEditDialogShown = true
      this.eventsCategoriesEditDialogEventsCategory = eventsCategory
    },

    async eventsCategoriesRemoveOne(eventsCategory): Promise<void> {
      const eventsCategoryName = eventsCategory.name

      if(!await this.$refs.confirm.dangerous(
        this.$t("eventsCategoriesRemoveOneConfirmation", {
          eventsCategoryName
        })
      )) return

      try {
        await this.eventsCategoriesActionsRemoveOne(eventsCategory)
        this.$success(this.$t("eventsCategoriesActionsRemoveOneSuccess", {
          eventsCategoryName
        }))
      } catch(e) {
        this.$error(e.message)
      }
    },

    async eventsCategoriesRemoveMany(eventsCategories): Promise<void> {
      const count = eventsCategories.length

      if(!await this.$refs.confirm.dangerous(
        this.$t("eventsCategoriesRemoveManyConfirmation", {
          eventsCategoriesCount: count
        })
      )) return

      try {
        await this.eventsCategoriesActionsRemoveMany(eventsCategories)
        this.$success(this.$t("eventsCategoriesActionsRemoveManySuccess", {
          eventsCategoriesCount: count
        }))
      } catch(e) {
        this.$error(e.message)
      }
    },

    setCategory(category): void {
      this.value.categoryId = category.id
    }
  }
})
</script>
