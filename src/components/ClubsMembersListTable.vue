<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for members by first or last name",
    "columnFirstNameLabel": "First Name",
    "columnLastNameLabel": "Last Name",
    "columnEmailAddressLabel": "Email Address",
    "columnPhoneNumberLabel": "Phone Number",
    "columnCountryLabel": "Country",
    "removeSelected": "Remove selected",
    "editMember": "Edit member",
    "removeMember": "Remove member",
    "tablePlaceholderText": "No members yet.",
    "tablePlaceholderButton": "Create new?"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter medlemmer med fornavn eller etternavn",
    "columnFirstNameLabel": "Fornavn",
    "columnLastNameLabel": "Etternavn",
    "columnEmailAddressLabel": "E-post",
    "columnPhoneNumberLabel": "Telefon",
    "columnCountryLabel": "Land",
    "removeSelected": "Slett valgte",
    "editMember": "Rediger medlem",
    "removeMember": "Slett medlem",
    "tablePlaceholderText": "Ingen medlemmer enda.",
    "tablePlaceholderButton": "Opprett ny?"
  }
}
</i18n>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 px-5 no-print">
      <div class="w-full max-w-md">
        <v-text-field
          v-model="clubsMembersSearchFilter"
          :label="$t('searchFormPlaceholder')"
          data-testid="clubsMembersSearchFilterInput"
          prepend-inner-icon="search"
          rounded
          filled
          dense
          hide-details
          single-line
          @keyup.enter="clubsMembersActionsList()"
        />
      </div>

      <v-btn
        color="primary"
        data-testid="clubsMembersCreateDialogOpenButton"
        @click.stop="clubsMembersCreateDialogOpen"
      >
        {{ $t("createNew") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="clubsMembersSelection"
      :headers="clubsMembersHeaders"
      :items="clubsMembersStateList"
      :loading="clubsMembersStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :sort-by="clubsMembersStateSortBy"
      :items-per-page="clubsMembersStatePageSize"
      :page="clubsMembersStatePageCurrent"
      :server-items-length="clubsMembersStateCount"
      :sort-desc="clubsMembersStateOrder"
      data-testid="clubsMembersListTable"
      @update:items-per-page="clubsMembersActionsSetPageSize"
      @update:page="clubsMembersActionsSetPageCurrent"
      @update:sort-by="clubsMembersActionsSetSorting"
      @update:sort-desc="clubsMembersActionsSetOrder"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              data-testid="clubsMembersListTableRowDropdown"
              small
              icon
              @click.stop="click"
            >
              <v-icon>
                more_horiz
              </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              data-testid="clubsMembersListTableRowDropdownOpenEditDialog"
              @click.stop="clubsMembersEditDialogOpen(item)"
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
              data-testid="clubsMembersListTableRowDropdownRemoveOne"
              @click.stop="clubsMembersRemoveOne(item)"
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
      </template>

      <template v-slot:header.actions>
        <v-menu>
          <template v-slot:activator="{ on: { click } }">
            <v-btn
              :disabled="!clubsMembersHasSelection"
              data-testid="clubsMembersListTableHeaderDropdown"
              small
              icon
              @click.stop="click"
            >
              <v-icon>
                more_horiz
              </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              data-testid="clubsMembersListTableHeaderDropdownRemoveMany"
              @click.stop="clubsMembersRemoveMany(clubsMembersSelection)"
            >
              <v-list-item-title class="flex items-center">
                <v-icon color="red">
                  delete_forever
                </v-icon>

                <span class="ml-2 red--text">
                  {{ $t("removeSelected") }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapMutations, mapState } from "vuex"

export default Vue.extend({
  name: "ClubsMembersListTable",

  props: {
    club: { type: Object, required: true }
  },

  data: function() {
    return {
      clubsMembersSelection: [],
      clubsMembersHeaders: [{
        value: "firstName",
        text: this.$t("columnFirstNameLabel")
      }, {
        value: "lastName",
        text: this.$t("columnLastNameLabel")
      }, {
        value: "emailAddress",
        text: this.$t("columnEmailAddressLabel")
      }, {
        value: "phoneNumber",
        text: this.$t("columnPhoneNumberLabel")
      }, {
        value: "country",
        text: this.$t("columnCountryLabel")
      }, {
        value: "actions",
        sortable: false,
        align: "right"
      }]
    }
  },

  computed: {
    ...mapState("clubs/members", {
      clubsMembersStateListIsLoading: "listIsLoading",
      clubsMembersStateSortBy: "sortBy",
      clubsMembersStatePageSize: "pageSize",
      clubsMembersStatePageCurrent: "pageCurrent",
      clubsMembersStateCount: "count",
      clubsMembersStateList: "list",
      clubsMembersStateOrder: "sortDesc"
    }),
    clubsMembersHasSelection(): boolean {
      return this.clubsMembersSelection.length > 0
    },
    clubsMembersSearchFilter: {
      get(): string { return this.$store.state.clubs.members.searchFilterValue },
      set(search): void { this.clubsMembersMutationsSetSearchFilter(search) }
    }
  },

  watch: {
    club: {
      immediate: true,
      handler: function(): void {
        if(!this.club) return
        this.clubsMembersMutationsSetListFilter({ clubId: this.club.id })
        this.clubsMembersActionsList()
      }
    },

    clubsMembersSearchFilter(v): void {
      if(v !== "") return
      this.clubsMembersMutationsSetListFilter({ clubId: this.club.id })
      this.clubsMembersActionsList()
    }
  },

  methods: {
    ...mapMutations("clubs/members", {
      clubsMembersMutationsSetSearchFilter: "SET_SEARCH_FILTER",
      clubsMembersMutationsSetListFilter: "SET_LIST_FILTER"
    }),

    ...mapActions("clubs/members", {
      clubsMembersActionsList: "list",
      clubsMembersActionsSetSorting: "setSorting",
      clubsMembersActionsSetPageSize: "setPageSize",
      clubsMembersActionsSetPageCurrent: "setPageCurrent",
      clubsMembersActionsSetSearchFilter: "setSearchFilter",
      clubsMembersActionsSetOrder: "setOrder"
    }),

    clubsMembersCreateDialogOpen(): void {
      this.$emit("clubsMembersCreateDialogOpen")
    },

    clubsMembersEditDialogOpen(club): void {
      this.$emit("clubsMembersEditDialogOpen", club)
    },

    clubsMembersRemoveOne(club): void {
      this.$emit("clubsMembersRemoveOne", club)
    },

    clubsMembersRemoveMany(clubs): void {
      this.$emit("clubsMembersRemoveMany", clubs)
    }
  }
})
</script>
