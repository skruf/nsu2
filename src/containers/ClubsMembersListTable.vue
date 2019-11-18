<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for members by first or last name",
    "column1Label": "Name/Email",
    "column2Label": "Phone number",
    "column3Label": "Country",
    "removeSelected": "Remove selected",
    "editMember": "Edit member",
    "removeMember": "Remove member",
    "tablePlaceholderText": "No members yet.",
    "tablePlaceholderButton": "Create new?"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter medlemmer med fornavn eller etternavn",
    "column1Label": "Navn/Epost",
    "column2Label": "Telefonnummer",
    "column3Label": "Land",
    "removeSelected": "Slett valgte",
    "editMember": "Rediger medlem",
    "removeMember": "Slett medlem",
    "tablePlaceholderText": "Ingen medlemmer enda.",
    "tablePlaceholderButton": "Opprett ny?"
  }
}
</i18n>

<template>
  <div class="clubs-members-list-table">
    <search-form
      v-model="clubsMembersSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="clubsMembersActionsSetSearchFilter"
    />

    <div v-loading="clubsMembersListIsLoading">
      <el-table
        :data="clubsMembersList"
        :sort-by="clubsMembersSortBy"
        row-key="id"
        class="no-hover"
        empty-text
        data-testid="clubsMembersListTable"
        @selection-change="clubsMembersSelectionChange"
        @sort-change="clubsMembersActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
          class-name="no-print"
        />

        <el-table-column
          prop="member"
          width="60px"
          class-name="no-print"
        >
          <template slot-scope="scope">
            <avatar
              :first-name="scope.row.firstName"
              :last-name="scope.row.lastName"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="firstName"
          sortable="custom"
          :label="$t('column1Label')"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.firstName }} {{ scope.row.lastName }}
            </h6>
            <small class="small">
              {{ scope.row.emailAddress }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="phoneNumber"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            <small class="small">
              {{ scope.row.phoneNumber || "N/A" }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="country"
          :label="$t('column3Label')"
        >
          <template slot-scope="scope">
            <small class="small">
              {{ scope.row.country || "N/A" }}
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
              :class="{ 'disabled': !clubsMembersHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="dispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    data-testid="clubsMembersListTableRowDropdownRemoveMany"
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'clubsMembersRemoveMany',
                      payload: clubsMembersSelection
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" />
                    {{ $t("removeSelected") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="dispatchActions"
            >
              <span
                data-testid="clubsMembersListTableRowDropdown"
                class="el-dropdown-link"
              >
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  data-testid="clubsMembersListTableRowDropdownOpenEditDialog"
                  :command="{
                    handler: 'clubsMembersOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editMember") }}
                </el-dropdown-item>

                <el-dropdown-item
                  divided
                  data-testid="clubsMembersListTableRowDropdownRemoveOne"
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'clubsMembersRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeMember") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="clubsMembersOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>
    </div>

    <el-pagination
      layout="total, sizes, prev, pager, next"
      :page-size="clubsMembersPageSize"
      :current-page="clubsMembersPageCurrent"
      :page-sizes="[ 15, 30, 45, 60 ]"
      :total="clubsMembersCount"
      @size-change="clubsMembersActionsSetPageSize"
      @current-change="clubsMembersActionsSetPageCurrent"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState, mapMutations } from "vuex"
import SearchForm from "@/components/SearchForm.vue"
import Avatar from "@/components/Avatar.vue"

export default Vue.extend({
  name: "ClubsMembersListTable",

  components: {
    SearchForm,
    Avatar
  },

  props: {
    clubId: { type: String, required: true }
  },

  data: () => ({
    clubsMembersSelection: [],
    clubsMembersSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("clubs/members", {
      clubsMembersList: "list",
      clubsMembersCount: "count",
      clubsMembersPageSize: "pageSize",
      clubsMembersPageCurrent: "pageCurrent",
      clubsMembersSortBy: "sortBy",
      clubsMembersListIsLoading: "listIsLoading"
    }),
    clubsMembersHasSelection() {
      return this.clubsMembersSelection.length > 0
    },
    clubsMembersSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsMembersMutationsSetSearchFilter(search) }
    }
  },

  async created() {
    this.clubsMembersMutationsSetListFilter({ clubId: this.clubId })
    await this.clubsMembersActionsList()
  },

  methods: {
    ...mapMutations("clubs/members", {
      clubsMembersMutationsSetListFilter: "SET_LIST_FILTER",
      clubsMembersMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("clubs/members", {
      clubsMembersActionsList: "list",
      clubsMembersActionsSetPageSize: "setPageSize",
      clubsMembersActionsSetPageCurrent: "setPageCurrent",
      clubsMembersActionsSetSorting: "setSorting",
      clubsMembersActionsSetSearchFilter: "setSearchFilter"
    }),
    clubsMembersOpenCreateDialog() {
      this.$emit("clubsMembersOpenCreateDialog")
    },
    clubsMembersSelectionChange(members) {
      this.clubsMembersSelection = members
    },

    clubsMembersOpenEditDialog(member) {
      this.$emit("clubsMembersOpenEditDialog", member)
    },

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    clubsMembersRemoveOne(clubMember) {
      this.$emit("clubsMembersRemoveOne", clubMember)
    },

    clubsMembersRemoveMany(clubMembers) {
      this.$emit("clubsMembersRemoveMany", clubMembers)
    }
  }
})
</script>
