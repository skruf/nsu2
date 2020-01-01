<i18n>
{
  "en": {
    "title": "Select a division",
    "divisionsListPlaceholderText": "No divisions yet.",
    "divisionsListPlaceholderButton": "Create division"
  },
  "no": {
    "title": "Velg en standplassliste",
    "divisionsListPlaceholderText": "Ingen standplasslister enda.",
    "divisionsListPlaceholderButton": "Opprett standplassliste"
  }
}
</i18n>

<template>
  <div class="">
    <v-list
      nav
      dense
      color="transparent"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="flex justify-between items-center">
            Velg en standplass

            <v-progress-circular
              v-if="eventsDivisionsStateListIsLoading"
              :size="24"
              color="primary"
              indeterminate
            />

            <v-btn
              icon
              color="primary"
              @click.stop="eventsDivisionsCreateDialogOpen"
              data-testid="eventsDivisionsCreateDialogOpenButton"
            >
              <v-icon>
                add
              </v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item-group
        v-model="eventsDivisionsListMenuDivisionSelectedIndex"
        color="primary"
      >
        <v-list-item
          v-for="(division, index) in eventsDivisionsStateList"
          :key="division.id"
          @click="eventsDivisionsListMenuDivisionSelect(division, index)"
          data-testid="eventsDivisionsListMenuDivisionListItem"
        >
          <v-list-item-icon>
            <v-icon>
              chevron_left
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ division.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex"

export default {
  name: "EventsDivisionsListMenu",

  data: () => ({
    eventsDivisionsListMenuDivisionSelected: null,
    eventsDivisionsListMenuDivisionSelectedIndex: null
  }),

  computed: {
    ...mapState("events", {
      eventsStateSelected: "selected"
    }),

    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateList: "list"
    })
  },

  async created() {
    await this.eventsDivisionsActionsList({
      eventId: this.eventsStateSelected.id
    })
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list"
    }),

    eventsDivisionsListMenuDivisionSelect(division) {
      this.eventsDivisionsListMenuDivisionSelected = division
      this.$emit("eventsDivisionsListMenuDivisionSelect", division)
    },

    eventsDivisionsCreateDialogOpen() {
      this.$emit("eventsDivisionsCreateDialogOpen")
    }
  }
}
</script>
