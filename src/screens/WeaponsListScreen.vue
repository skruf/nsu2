<i18n>
{
  "en": {
    "breadcrumbWeaponLabel": "Weapons",
    "breadcrumbAllLabel": "All",
    "screenTitle": "Weapons",
    "weaponsCreateDialogOpenButton": "Create weapon",
    "weaponsRemoveOneConfirmation": "This will remove %{weaponsName} and participants who used this weapon permanently. Continue?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} was removed from the database",
    "weaponsRemoveManyConfirmation": "This will remove %{weaponsCount} weapons and participants who used these weapons permanently. Continue?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} weapons has been removed from the database"
  },
  "no": {
    "breadcrumbWeaponLabel": "Våpen",
    "breadcrumbAllLabel": "Alle",
    "screenTitle": "Våpen",
    "weaponsCreateDialogOpenButton": "Opprett våpen",
    "weaponsRemoveOneConfirmation": "Dette vil fjerne %{weaponsName} og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} ble fjernet fra databasen",
    "weaponsRemoveManyConfirmation": "Dette vil fjerne %{weaponsCount} våpen og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} våpen ble fjernet fra databasen"
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
        {{ $t("screenTitle") }}
      </v-toolbar-title>

      <v-btn
        icon
        data-testid="eventsListPrintButton"
        @click="print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="screen-wrapper">
      <v-breadcrumbs
        :items="[
          { to: '/weapons', text: $t('breadcrumbWeaponLabel') },
          { to: '', text: $t('breadcrumbAllLabel') }
        ]"
      />

      <div v-loading="weaponsRemoveIsLoading">
        <weapons-list-table
          @weaponsCreateDialogOpen="weaponsCreateDialogOpen"
          @weaponsEditDialogOpen="weaponsEditDialogOpen"
          @weaponsRemoveOne="weaponsRemoveOne"
          @weaponsRemoveMany="weaponsRemoveMany"
        />
      </div>
    </div>

    <weapons-create-dialog
      :shown.sync="weaponsCreateDialogShown"
    />

    <weapons-edit-dialog
      :shown.sync="weaponsEditDialogShown"
      :weapon="weaponsEditDialogWeapon"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import WeaponsListTable from "@/components/WeaponsListTable.vue"
import WeaponsCreateDialog from "@/components/WeaponsCreateDialog.vue"
import WeaponsEditDialog from "@/components/WeaponsEditDialog.vue"

export default Vue.extend({
  name: "WeaponsListScreen",

  components: {
    WeaponsListTable,
    WeaponsCreateDialog,
    WeaponsEditDialog
  },

  data: () => ({
    weaponsCreateDialogShown: false,
    weaponsEditDialogShown: false,
    weaponsEditDialogWeapon: {}
  }),

  computed: {
    ...mapState("weapons", {
      weaponsStateRemoveOneIsLoading: "removeOneIsLoading",
      weaponsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    weaponsRemoveIsLoading(): boolean {
      return (
        this.weaponsStateRemoveOneIsLoading ||
        this.weaponsStateRemoveManyIsLoading
      )
    }
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsRemoveOne: "removeOne",
      weaponsActionsRemoveMany: "removeMany",
    }),

    weaponsCreateDialogOpen(): void {
      this.weaponsCreateDialogShown = true
    },

    weaponsEditDialogOpen(weapon): void {
      this.weaponsEditDialogShown = true
      this.weaponsEditDialogWeapon = weapon
    },

    async weaponsRemoveOne(weapon): Promise<void> {
      try {
        await this.$confirm(
          this.$t("weaponsRemoveOneConfirmation", {
            weaponsName: weapon.name
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
        await this.weaponsActionsRemoveOne(weapon)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("weaponsActionsRemoveOneSuccess", {
            weaponsName: weapon.name
          })
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async weaponsRemoveMany(weapons): Promise<void> {
      const count = weapons.length

      try {
        await this.$confirm(
          this.$t("weaponsRemoveManyConfirmation", {
            weaponsCount: count
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
        await this.weaponsActionsRemoveMany(weapons)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("weaponsActionsRemoveManySuccess", {
            weaponsCount: count
          })
        })
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
