<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a club by name",
    "columnNameLabel": "Name",
    "columnAreaStreetAddressLabel": "Area/Address",
    "columnLeaderFullNameEmailLabel": "Leader/Email",
    "columnMembersCountLabel": "Members",
    "removeSelected": "Remove selected",
    "editClub": "Edit club",
    "removeClub": "Remove club",
    "tablePlaceholderButton": "Create new?",
    "tablePlaceholderText": "No clubs yet."
  },
  "no": {
    "searchFormPlaceholder": "Søk etter en klubb med navn",
    "columnNameLabel": "Navn",
    "columnAreaStreetAddressLabel": "Område/Adresse",
    "columnLeaderFullNameEmailLabel": "Leder/Epost",
    "columnMembersCountLabel": "Medlemmer",
    "removeSelected": "Slett valgte",
    "editClub": "Rediger klubb",
    "removeClub": "Slett klubb",
    "tablePlaceholderButton": "Opprett ny?",
    "tablePlaceholderText": "Ingen klubber enda."
  }
}
</i18n>

<template>
  <div class="clubs-list-table">
    <search-form
      v-model="clubsSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="clubsActionsSetSearchFilter"
    />

    <div v-loading="clubsStateListIsLoading">
      <el-table
        :data="clubsStateList"
        :sort-by="clubsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        data-testid="clubsListTable"
        @selection-change="clubsSelectionChange"
        @row-click="clubsRowClick"
        @sort-change="clubsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
          class-name="no-print"
        />

        <el-table-column
          prop="name"
          sortable="custom"
          :label="$t('columnNameLabel')"
          :sort-orders="clubsSortOrders"
        >
          <template slot-scope="scope">
            <h6
              class="h6"
              data-testid="clubsListTableNameCellContent"
            >
              {{ scope.row.name }}
            </h6>
            <small class="small">
              {{ scope.row.shortName }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="area"
          sortable="custom"
          :label="$t('columnAreaStreetAddressLabel')"
          :sort-orders="clubsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.area }}
            </h6>
            <small class="small">
              {{ scope.row.streetAddress }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="leader"
          sortable="custom"
          :label="$t('columnLeaderFullNameEmailLabel')"
          :sort-orders="clubsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.leader }}
            </h6>
            <small class="small">
              {{ scope.row.emailAddress || "N/A" }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="membersCount"
          width="115px"
          :label="$t('columnMembersCountLabel')"
          :sort-orders="clubsSortOrders"
        />

        <el-table-column
          width="50"
          align="right"
          class-name="no-print"
        >
          <template slot="header">
            <div
              class="table-actions"
              :class="{ 'disabled': !clubsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="clubsDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    data-testid="clubsListTableRowDropdownRemoveMany"
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'clubsRemoveMany',
                      payload: clubsSelection
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" /> {{ $t('removeSelected') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="clubsDispatchActions"
              @click.native.stop
            >
              <span
                data-testid="clubsListTableRowDropdown"
                class="el-dropdown-link"
              >
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  data-testid="clubsListTableRowDropdownOpenEditDialog"
                  :command="{
                    handler: 'clubsOpenEditOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" /> {{ $t('editClub') }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  data-testid="clubsListTableRowDropdownRemoveOne"
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'clubsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> {{ $t('removeClub') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="clubsOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="clubsStatePageSize"
        :current-page="clubsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="clubsStateCount"
        @size-change="clubsActionsSetPageSize"
        @current-change="clubsActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm.vue"

export default Vue.extend({
  name: "ClubsListTable",

  components: {
    SearchForm
  },

  data: () => ({
    clubsSelection: [],
    clubsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateSortBy: "sortBy",
      clubsStatePageSize: "pageSize",
      clubsStatePageCurrent: "pageCurrent",
      clubsStateCount: "count",
      clubsStateList: "list"
    }),
    clubsHasSelection() {
      return this.clubsSelection.length > 0
    },
    clubsSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsMutationsSetSearchFilter(search) }
    }
  },

  async created() {
    await this.clubsActionsList()
  },

  methods: {
    ...mapMutations("clubs", {
      clubsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list",
      clubsActionsSetSorting: "setSorting",
      clubsActionsSetPageSize: "setPageSize",
      clubsActionsSetPageCurrent: "setPageCurrent",
      clubsActionsSetSearchFilter: "setSearchFilter"
    }),

    clubsRowClick(club) {
      this.$router.push(`/clubs/${club.id}`)
    },

    clubsSelectionChange(clubs) {
      this.clubsSelection = clubs
    },

    clubsDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    clubsOpenCreateDialog() {
      this.$emit("clubsOpenCreateDialog")
    },

    clubsOpenEditOne(club) {
      this.$emit("clubsOpenEditDialog", club)
    },

    clubsRemoveOne(club) {
      this.$emit("clubsRemoveOne", club)
    },

    clubsRemoveMany(clubs) {
      this.$emit("clubsRemoveMany", clubs)
    }
  }
})
</script>
