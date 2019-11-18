<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for an event by title or club",
    "column1Label": "Starts/Ends",
    "column2Label": "Title/Approbated",
    "column2LabelIsApprobated": "Is approbated",
    "column2LabelIsntApprobated": "Isn't approbated",
    "column3Label": "Range/Organizer",
    "column4Label": "Category",
    "removeSelected": "Remove selected",
    "editEvent": "Edit event",
    "removeEvent": "Remove event",
    "tablePlaceholderText": "No events yet.",
    "tablePlaceholderButton": "Create new?"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter et stevne med tittel eller klubb",
    "column1Label": "Starter/Slutter",
    "column2Label": "Tittel/Approbert",
    "column2LabelIsApprobated": "Er approbert",
    "column2LabelIsntApprobated": "Ikke approbert",
    "column3Label": "Skyttebane/Arrangør",
    "column4Label": "Kategori",
    "removeSelected": "Slett valgte",
    "editEvent": "Rediger stevne",
    "removeEvent": "Slett stevne",
    "tablePlaceholderText": "Ingen stevner enda.",
    "tablePlaceholderButton": "Opprett ny?"
  }
}
</i18n>

<template>
  <div class="events-list-table">
    <search-form
      v-model="eventsSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="eventsActionsSetSearchFilter"
    />

    <div v-loading="eventsStateListIsLoading">
      <el-table
        :data="eventsStateList"
        :sort-by="eventsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        data-testid="eventsListTable"
        @selection-change="eventsSelectionChange"
        @row-click="eventsRowClick"
        @sort-change="eventsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
          class-name="no-print"
        />

        <el-table-column
          prop="startsAt"
          width="150px"
          sortable="custom"
          :label="$t('column1Label')"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.startsAt | moment("MMM, D") }}
            </h6>
            <small class="small">
              {{ scope.row.endsAt | moment("MMM, D") }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="title"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6
              class="h6"
              data-testid="eventsListTableTitleCellContent"
            >
              {{ scope.row.title }}
            </h6>
            <small class="small">
              <template v-if="scope.row.approbated">
                <i class="el-icon-star-on" />
                {{ $t("column2LabelIsApprobated") }}
              </template>
              <template v-else>
                <i class="el-icon-star-off" />
                {{ $t("column2LabelIsntApprobated") }}
              </template>
            </small>
          </template>
        </el-table-column>

        <!-- prop="clubId"
        sortable="custom" -->
        <el-table-column
          :label="$t('column3Label')"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.range ? scope.row.range.name : "N/A" }}
            </h6>
            <small class="small">
              {{ scope.row.club ? scope.row.club.name : "N/A" }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="categoryId"
          sortable="custom"
          :label="$t('column4Label')"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            {{ scope.row.category ? scope.row.category.name : "N/A" }}
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
              :class="{ 'disabled': !eventsHasSelection }"
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
                    data-testid="eventsListTableRowDropdownRemoveMany"
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'eventsRemoveMany'
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
              @click.native.stop
            >
              <span
                data-testid="eventsListTableRowDropdown"
                class="el-dropdown-link"
              >
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  data-testid="eventsListTableRowDropdownOpenEditDialog"
                  :command="{
                    handler: 'eventsOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editEvent") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  data-testid="eventsListTableRowDropdownRemoveOne"
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'eventsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeEvent") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="eventsOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="eventsStatePageSize"
        :current-page="eventsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="eventsStateCount"
        @size-change="eventsActionsSetPageSize"
        @current-change="eventsActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm.vue"

export default Vue.extend({
  name: "EventsListTable",

  components: {
    SearchForm
  },

  data: () => ({
    eventsSelection: [],
    eventsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events", {
      eventsStateListIsLoading: "listIsLoading",
      eventsStateSortBy: "sortBy",
      eventsStatePageSize: "pageSize",
      eventsStatePageCurrent: "pageCurrent",
      eventsStateCount: "count",
      eventsStateList: "list"
    }),

    eventsHasSelection() {
      return this.eventsSelection.length > 0
    },

    eventsSearchFilter: {
      get() { return this.$store.state.events.searchFilterValue },
      set(search) { this.eventsMutationsSetSearchFilter(search) }
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("events", {
      eventsActionsList: "list",
      eventsActionsSetSorting: "setSorting",
      eventsActionsSetPageSize: "setPageSize",
      eventsActionsSetPageCurrent: "setPageCurrent",
      eventsActionsSetSearchFilter: "setSearchFilter"
    }),

    eventsOpenCreateDialog() {
      this.$emit("eventsOpenCreateDialog")
    },

    eventsOpenEditDialog(event) {
      this.$emit("eventsOpenEditDialog", event)
    },

    eventsRowClick(event) {
      this.$router.push(`/events/${event.id}`)
    },

    eventsSelectionChange(events) {
      this.eventsSelection = events
    },

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    eventsRemoveOne(event) {
      this.$emit("eventsRemoveOne", event)
    },

    eventsRemoveMany(events) {
      this.$emit("eventsRemoveMany", events)
    }
  }
})
</script>
