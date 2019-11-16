<i18n>
{
  "en": {
    "breadcrumb1Label": "Weapons",
    "breadcrumb2Label": "All",
    "title": "Weapons",
    "weaponsOpenCreateDialogButton": "Create weapon"
  },
  "no": {
    "breadcrumb1Label": "Våpen",
    "breadcrumb2Label": "Alle",
    "title": "Våpen",
    "weaponsOpenCreateDialogButton": "Opprett våpen"
  }
}
</i18n>

<template>
  <el-container
    id="weapons-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/weapons', label: $t('breadcrumb1Label'),
        }, {
          to: '', label: $t('breadcrumb2Label')
        }]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t('title') }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <weapons-list-table
        @weaponsOpenCreateDialog="weaponsOpenCreateDialog"
        @weaponsOpenEditDialog="weaponsOpenEditDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        data-testid="weaponsOpenCreateDialogButton"
        @click="weaponsOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> {{ $t("weaponsOpenCreateDialogButton") }}
      </el-button>
    </el-footer>

    <weapons-create-dialog
      :shown.sync="weaponsShowCreateDialog"
    />

    <weapons-edit-dialog
      :shown.sync="weaponsEditShowDialog"
      :weapon="weaponsEditItem"
    />
  </el-container>
</template>

<script lang="ts">
import Vue from "vue"
import BreadcrumbBar from "@/components/BreadcrumbBar.vue"
import WeaponsListTable from "@/containers/WeaponsListTable.vue"
import WeaponsCreateDialog from "@/containers/WeaponsCreateDialog.vue"
import WeaponsEditDialog from "@/containers/WeaponsEditDialog.vue"

export default Vue.extend({
  name: "WeaponsListScreen",

  components: {
    BreadcrumbBar,
    WeaponsListTable,
    WeaponsCreateDialog,
    WeaponsEditDialog
  },

  data: () => ({
    weaponsShowCreateDialog: false,
    weaponsEditShowDialog: false,
    weaponsEditItem: {}
  }),

  methods: {
    weaponsOpenCreateDialog() {
      this.weaponsShowCreateDialog = true
    },
    weaponsOpenEditDialog(weaponClass) {
      this.weaponsEditShowDialog = true
      this.weaponsEditItem = weaponClass
    }
  }
})
</script>
