<i18n>
{
  "en": {
    "breadcrumbWeaponLabel": "Classes",
    "breadcrumbAllLabel": "All",
    "screenTitle": "Classes",
    "weaponsCreateDialogOpenButton": "Create class",
    "weaponsRemoveOneConfirmation": "This will remove %{weaponsName} and participants who used this weapon permanently. Continue?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} was removed from the database",
    "weaponsRemoveManyConfirmation": "This will remove %{weaponsCount} classes and participants who used these classes permanently. Continue?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} classes has been removed from the database"
  },
  "no": {
    "breadcrumbWeaponLabel": "Klasse",
    "breadcrumbAllLabel": "Alle",
    "screenTitle": "Klasse",
    "weaponsCreateDialogOpenButton": "Opprett klasse",
    "weaponsRemoveOneConfirmation": "Dette vil fjerne %{weaponsName} og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} ble fjernet fra databasen",
    "weaponsRemoveManyConfirmation": "Dette vil fjerne %{weaponsCount} klasse og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} klasse ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="screen">
    <v-app-bar
      class="screen-bar"
      height="auto"
      flat
    >
      <v-toolbar-title class="screen-title">
        {{ $t("screenTitle") }}
      </v-toolbar-title>

      <v-btn
        icon
        data-testid="eventsListPrintButton"
        @click="$print"
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="container">
      <weapons-list-table
        :weapons="weaponsStateList"
        :loading="loading"
        @weaponsCreateDialogOpen="weaponsCreateDialogOpen"
        @weaponsEditDialogOpen="weaponsEditDialogOpen"
        @weaponsRemoveOne="weaponsRemoveOne"
        @weaponsRemoveMany="weaponsRemoveMany"
      />
    </div>

    <weapons-create-dialog
      :shown.sync="weaponsCreateDialogShown"
    />

    <weapons-edit-dialog
      :shown.sync="weaponsEditDialogShown"
      :weapon="weaponsEditDialogWeapon"
    />

    <confirm ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import WeaponsListTable from "./WeaponsListTable.vue"
import WeaponsCreateDialog from "./WeaponsCreateDialog.vue"
import WeaponsEditDialog from "./WeaponsEditDialog.vue"
import Confirm from "@/components/Confirm.vue"

export default Vue.extend({
  name: "WeaponsListScreen",

  components: {
    WeaponsListTable,
    WeaponsCreateDialog,
    WeaponsEditDialog,
    Confirm
  },

  data: () => ({
    weaponsCreateDialogShown: false,
    weaponsEditDialogShown: false,
    weaponsEditDialogWeapon: {}
  }),

  computed: {
    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateList: "list",
      weaponsStateRemoveOneIsLoading: "removeOneIsLoading",
      weaponsStateRemoveManyIsLoading: "removeManyIsLoading"
    }),
    loading(): boolean {
      return (
        this.weaponsStateListIsLoading ||
        this.weaponsStateRemoveOneIsLoading ||
        this.weaponsStateRemoveManyIsLoading
      )
    }
  },

  created() {
    this.weaponsActionsList()
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsList: "list",
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
      if(!await this.$refs.confirm.dangerous(
        this.$t("weaponsRemoveOneConfirmation", {
          weaponsName: weapon.name
        })
      )) return

      try {
        await this.weaponsActionsRemoveOne(weapon)
        this.$success(this.$t("weaponsActionsRemoveOneSuccess", {
          weaponsName: weapon.name
        }))
      } catch(e) {
        this.$error(e.message)
      }
    },

    async weaponsRemoveMany(weapons): Promise<void> {
      const count = weapons.length

      if(!await this.$refs.confirm.dangerous(
        this.$t("weaponsRemoveManyConfirmation", {
          weaponsCount: count
        })
      )) return

      try {
        await this.weaponsActionsRemoveMany(weapons)
        this.$success(this.$t("weaponsActionsRemoveManySuccess", {
          weaponsCount: count
        }))
      } catch(e) {
        this.$error(e.message)
      }
    }
  }
})
</script>
