<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a range by name or area",
    "columnNameTypeLabel": "Name/Type",
    "columnAreaAddressLabel": "Area/Address",
    "columnCountryLabel": "Country",
    "removeSelected": "Remove selected",
    "editRange": "Edit range",
    "removeRange": "Remove range",
    "showRangeMap": "Show on map",
    "tablePlaceholderText": "No ranges yet.",
    "tablePlaceholderButton": "Create new?"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter en skyttebane med navn eller område",
    "columnNameTypeLabel": "Navn/Type",
    "columnAreaAddressLabel": "Område/Adresse",
    "columnCountryLabel": "Land",
    "removeSelected": "Slett valgte",
    "editRange": "Rediger skyttebane",
    "removeRange": "Slett skyttebane",
    "showRangeMap": "Vis på kart",
    "tablePlaceholderText": "Ingen skyttebaner enda.",
    "tablePlaceholderButton": "Opprett ny?"
  }
}
</i18n>

<template>
  <div class="ranges-list-table">
    <search-form
      v-model="rangesSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="rangesActionsSetSearchFilter"
    />

    <div v-loading="rangesIsLoading">
      <el-table
        :data="rangesStateList"
        :sort-by="rangesStateSortBy"
        row-key="id"
        class="no-hover"
        empty-text
        data-testid="rangesListTable"
        @selection-change="rangesSelectionChange"
        @sort-change="rangesActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
          class-name="no-print"
        />

        <el-table-column
          prop="name"
          sortable="custom"
          :label="$t('columnNameTypeLabel')"
          :sort-orders="rangesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
            <small class="small">
              {{ scope.row.type }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="area"
          sortable="custom"
          :label="$t('columnAreaAddressLabel')"
          :sort-orders="rangesSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.area }}
            </h6>
            <small class="small">
              {{ scope.row.streetAddress || "N/A" }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="country"
          sortable="custom"
          :label="$t('columnCountryLabel')"
          :sort-orders="rangesSortOrders"
        />

        <el-table-column
          width="50"
          align="right"
          class-name="no-print"
        >
          <template slot="header">
            <div
              class="table-actions"
              :class="{ 'disabled': !rangesHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="rangesTableDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    data-testid="rangesListTableRowDropdownRemoveMany"
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'rangesRemoveMany'
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
              @command="rangesTableDispatchActions"
            >
              <span
                data-testid="rangesListTableRowDropdown"
                class="el-dropdown-link"
              >
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="!(scope.row.lat && scope.row.lng)"
                  :command="{
                    handler: 'rangesOpenMap',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-location el-icon--left" /> {{ $t("showRangeMap") }}
                </el-dropdown-item>
                <el-dropdown-item
                  data-testid="rangesListTableRowDropdownOpenEditDialog"
                  :command="{
                    handler: 'rangesOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" /> {{ $t("editRange") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  data-testid="rangesListTableRowDropdownRemoveOne"
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'rangesRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />  {{ $t("removeRange") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="rangesOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="rangesStatePageSize"
        :current-page="rangesStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="rangesStateCount"
        @size-change="rangesActionsSetPageSize"
        @current-change="rangesActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm.vue"

export default Vue.extend({
  name: "RangesListTable",

  components: {
    SearchForm
  },

  data: () => ({
    rangesSelection: [],
    rangesSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateRemoveOneIsLoading: "removeOneIsLoading",
      rangesStateRemoveManyIsLoading: "removeManyIsLoading",
      rangesStateSortBy: "sortBy",
      rangesStatePageSize: "pageSize",
      rangesStatePageCurrent: "pageCurrent",
      rangesStateCount: "count",
      rangesStateList: "list"
    }),

    rangesHasSelection() {
      return this.rangesSelection.length > 0
    },

    rangesSearchFilter: {
      get() { return this.$store.state.ranges.searchFilterValue },
      set(search) { this.rangesMutationsSetSearchFilter(search) }
    },

    rangesIsLoading() {
      return (
        this.rangesStateListIsLoading ||
        this.rangesStateRemoveOneIsLoading ||
        this.rangesStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    await this.rangesActionsList()
  },

  methods: {
    ...mapMutations("ranges", {
      rangesMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list",
      rangesActionsSetSorting: "setSorting",
      rangesActionsSetPageSize: "setPageSize",
      rangesActionsSetPageCurrent: "setPageCurrent",
      rangesActionsSetSearchFilter: "setSearchFilter"
    }),

    rangesSelectionChange(ranges) {
      this.rangesSelection = ranges
    },

    rangesOpenMap(range) {
      window.open(`https://www.google.com/maps/@${range.lat},${range.lng},15z`)
    },

    rangesTableDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    rangesOpenCreateDialog() {
      this.$emit("rangesOpenCreateDialog")
    },

    rangesOpenEditDialog(range) {
      this.$emit("rangesOpenEditDialog", range)
    },

    rangesRemoveOne(range) {
      this.$emit("rangesRemoveOne", range)
    },

    rangesRemoveMany(ranges) {
      this.$emit("rangesRemoveMany", ranges)
    }
  }
})
</script>
