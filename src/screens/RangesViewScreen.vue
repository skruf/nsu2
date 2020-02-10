<i18n>
{
  "en": {
    "breadcrumb1Label": "Ranges",
    "editRange": "Edit range",
    "removeRange": "Remove range",
    "area": "Area",
    "rangesRemoveOneConfirmation": "This will remove %{rangeName} permanently. Continue?",
    "rangesActionsRemoveOneSuccess": "%{rangeName} was removed from the database",
    "mapPlaceholder": "Add coordinates to view the map",
    "rangesEditDialogOpen": "Edit range"
  },
  "no": {
    "breadcrumb1Label": "Skyttebaner",
    "editRange": "Rediger skyttebane",
    "removeRange": "Fjern skyttebane",
    "area": "Område",
    "rangesRemoveOneConfirmation": "Dette vil fjerne %{rangeName} permanent. Fortsette?",
    "rangesActionsRemoveOneSuccess": "%{rangeName} ble fjernet fra databasen",
    "mapPlaceholder": "Legg inn koordinater for å se kartet",
    "rangesEditDialogOpen": "Rediger skyttebane"
  }
}
</i18n>

<template>
  <div class="screen">
    <v-app-bar
      color="primary"
      class="screen-bar"
      dark
      flat
    >
      <v-toolbar-title class="screen-title">
        <div class="print:mb-2 print:text-2xl">
          {{ rangesStateSelected.name }}

          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                data-testid="rangesViewDropdown"
                small
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  more_horiz
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                data-testid="rangesViewDropdownOpenEditDialog"
                @click="rangesEditDialogOpen()"
              >
                <v-list-item-title class="flex items-center">
                  <v-icon>
                    edit
                  </v-icon>

                  <span class="ml-2">
                    {{ $t("edit") }}
                  </span>
                </v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item
                data-testid="rangesViewDropdownRemoveOne"
                @click="rangesRemoveOne(rangesStateSelected)"
              >
                <v-list-item-title class="flex items-center">
                  <v-icon color="red">
                    delete_forever
                  </v-icon>

                  <span class="ml-2 red--text">
                    {{ $t("remove") }}
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <data-grid :loading="rangesStateSelectedIsLoading">
          <template :slot="$t('area')">
            {{ rangesStateSelected.area }}
          </template>

          <template
            v-if="rangesStateSelected.streetAddress"
            slot="Adresse"
          >
            {{ rangesStateSelected.streetAddress }}
          </template>

          <template slot="Land">
            {{ rangesStateSelected.country }}
          </template>

          <template slot="Type">
            {{ rangesStateSelected.type }}
          </template>
        </data-grid>
      </v-toolbar-title>

      <v-btn
        icon
        data-testid="rangesViewPrintButton"
        @click="print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="screen-wrapper">
      <v-breadcrumbs
        :items="[
          { to: '/ranges', text: $t('breadcrumb1Label') },
          { to: `/ranges/${rangesStateSelected.id}`,
            text: rangesStateSelected.name }
        ]"
      />

      <map-view
        v-if="rangesStateSelected.lat && rangesStateSelected.lng"
        :lat="rangesStateSelected.lat"
        :lng="rangesStateSelected.lng"
      />

      <div
        v-else
        class="flex flex-col items-center justify-center"
      >
        <div class="mb-4 text-muted">
          {{ $t("mapPlaceholder") }}
        </div>

        <v-btn
          color="primary"
          data-testid="rangesEditDialogOpenButton"
          @click.stop="rangesEditDialogOpen"
        >
          {{ $t("rangesEditDialogOpen") }}
        </v-btn>
      </div>
    </div>

    <ranges-edit-dialog
      :shown.sync="rangesEditDialogShown"
      :range="rangesStateSelected"
    />
  </div>
</template>

<script lang="ts">
/**
 * @typedef {import('../types').Ranges} Ranges
 */

import Vue from "vue"
import { mapActions, mapState } from "vuex"
import RangesEditDialog from "@/components/RangesEditDialog.vue"
import DataGrid from "@/components/DataGrid.vue"
import MapView from "@/components/MapView.vue"

export default Vue.extend({
  name: "RangesViewScreen",

  components: {
    RangesEditDialog,
    DataGrid,
    MapView
  },

  data: () => ({
    rangesEditDialogShown: false
  }),

  computed: {
    ...mapState("ranges", {
      rangesStateSelectedIsLoading: "selectedIsLoading",
      rangesStateRemoveOneIsLoading: "removeOneIsLoading",
      rangesStateSelected: "selected"
    }),
    rangesIsLoading(): boolean {
      return (
        this.rangesStateSelectedIsLoading ||
        this.rangesStateRemoveOneIsLoading
      )
    }
  },

  watch: {
    "$route.params.rangeId": {
      immediate: true,
      handler: function(id): void {
        this.rangesActionsSelect({ id })
      }
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsSelect: "select",
      rangesActionsRemoveOne: "removeOne"
    }),

    rangesEditDialogOpen(): void {
      this.rangesEditDialogShown = true
    },

    async rangesRemoveOne(range): Promise<void> {
      try {
        await this.$confirm(
          this.$t("rangesRemoveOneConfirmation", {
            rangeName: range.name
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.rangesActionsRemoveOne(range)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("rangesActionsRemoveOneSuccess", {
            rangeName: range.name
          })
        })
        this.$router.push("/ranges")
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    }
  }
})
</script>
