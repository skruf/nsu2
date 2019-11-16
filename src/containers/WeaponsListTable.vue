<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a weapon by name",
    "columnNameNumberLabel": "Name/Nummer",
    "columnCategoryLabel": "Category",
    "columnConditionLabel": "Condition",
    "columnDistanceLabel": "Distance",
    "removeSelected": "Remove selected",
    "editWeapon": "Edit weapon",
    "removeWeapon": "Remove weapon",
    "tablePlaceholderText": "No weapons yet.",
    "tablePlaceholderButton": "Create new?",
    "weaponsRemoveOneConfirmation": "This will remove %{weaponsName} and participants who used this weapon permanently. Continue?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} was removed from the database",
    "weaponsRemoveManyConfirmation": "This will remove %{weaponsCount} weapons and participants who used these weapons permanently. Continue?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} weapons has been removed from the database"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter våpen med navn",
    "columnNameNumberLabel": "Navn/Nummer",
    "columnCategoryLabel": "Kategori",
    "columnConditionLabel": "Tilstand",
    "columnDistanceLabel": "Avstand",
    "removeSelected": "Slett valgte",
    "editWeapon": "Rediger klasse",
    "removeWeapon": "Slett klasse",
    "tablePlaceholderText": "Ingen våpen enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "weaponsRemoveOneConfirmation": "Dette vil fjerne %{weaponsName} og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveOneSuccess": "%{weaponsName} ble fjernet fra databasen",
    "weaponsRemoveManyConfirmation": "Dette vil fjerne %{weaponsCount} våpen og deltakere som brukte denne klassen permanent. Fortsette?",
    "weaponsActionsRemoveManySuccess": "%{weaponsCount} våpen ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="weapons-list-table">
    <search-form
      v-model="weaponsSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="weaponsActionsSetSearchFilter"
    />

    <div v-loading="weaponsIsLoading">
      <el-table
        empty-text
        row-key="id"
        class="no-hover"
        data-testid="weaponsListTable"
        :data="weaponsStateList"
        :sort-by="weaponsStateSortBy"
        @selection-change="weaponsSelectionChange"
        @sort-change="weaponsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
          class-name="no-print"
        />

        <el-table-column
          prop="name"
          sortable="custom"
          :label="$t('columnNameNumberLabel')"
          :sort-orders="weaponsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
            <small class="small">
              {{ scope.row.number }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="category"
          sortable="custom"
          :label="$t('columnCategoryLabel')"
          :sort-orders="weaponsSortOrders"
        >
          <template slot-scope="scope">
            <small class="small">
              {{ scope.row.category }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="distance"
          sortable="custom"
          :label="$t('columnDistanceLabel')"
          :sort-orders="weaponsSortOrders"
        >
          <template slot-scope="scope">
            <small class="small">
              {{ scope.row.distance }} meter
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="condition"
          sortable="custom"
          :label="$t('columnConditionLabel')"
          :sort-orders="weaponsSortOrders"
        >
          <template slot-scope="scope">
            <small class="small">
              {{ scope.row.condition }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
          class-name="no-print"
        >
          <template slot="header">
            <div
              class="table-actions"
              :class="{ 'disabled': !weaponsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="weaponsDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    data-testid="weaponsListTableRowDropdownRemoveMany"
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'weaponsRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" /> {{ $t("removeSelected") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="weaponsDispatchActions"
            >
              <span
                data-testid="weaponsListTableRowDropdown"
                class="el-dropdown-link"
              >
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  data-testid="weaponsListTableRowDropdownOpenEditDialog"
                  :command="{
                    handler: 'weaponsOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" /> {{ $t("editWeapon") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  data-testid="weaponsListTableRowDropdownRemoveOne"
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'weaponsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> {{ $t("removeWeapon") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="weaponsOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="weaponsStatePageSize"
        :current-page="weaponsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="weaponsStateCount"
        @size-change="weaponsActionsSetPageSize"
        @current-change="weaponsActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm.vue"

export default Vue.extend({
  name: "WeaponsListTable",

  components: {
    SearchForm
  },

  data: () => ({
    weaponsSelection: [],
    weaponsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("weapons", {
      weaponsStateListIsLoading: "listIsLoading",
      weaponsStateRemoveOneIsLoading: "removeOneIsLoading",
      weaponsStateRemoveManyIsLoading: "removeManyIsLoading",
      weaponsStateSortBy: "sortBy",
      weaponsStatePageSize: "pageSize",
      weaponsStatePageCurrent: "pageCurrent",
      weaponsStateCount: "count",
      weaponsStateList: "list"
    }),
    weaponsHasSelection() {
      return this.weaponsSelection.length > 0
    },
    weaponsSearchFilter: {
      get() { return this.$store.state.weapons.searchFilterValue },
      set(search) { this.weaponsMutationsSetSearchFilter(search) }
    },
    weaponsIsLoading() {
      return (
        this.weaponsStateListIsLoading ||
        this.weaponsStateRemoveOneIsLoading ||
        this.weaponsStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    await this.weaponsActionsList()
  },

  methods: {
    ...mapMutations("weapons", {
      weaponsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("weapons", {
      weaponsActionsList: "list",
      weaponsActionsRemoveOne: "removeOne",
      weaponsActionsRemoveMany: "removeMany",
      weaponsActionsSetSorting: "setSorting",
      weaponsActionsSetPageSize: "setPageSize",
      weaponsActionsSetPageCurrent: "setPageCurrent",
      weaponsActionsSetSearchFilter: "setSearchFilter"
    }),

    weaponsOpenCreateDialog() {
      this.$emit("weaponsOpenCreateDialog")
    },

    weaponsOpenEditDialog(weapon) {
      this.$emit("weaponsOpenEditDialog", weapon)
    },

    weaponsSelectionChange(weapons) {
      this.weaponsSelection = weapons
    },

    weaponsDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async weaponsRemoveOne(weapon) {
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

    async weaponsRemoveMany() {
      const count = this.weaponsSelection.length

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
        await this.weaponsActionsRemoveMany(this.weaponsSelection)
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
