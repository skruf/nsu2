<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for members",
    "columnFirstNameLabel": "First Name",
    "columnLastNameLabel": "Last Name",
    "columnEmailAddressLabel": "Email Address",
    "columnPhoneNumberLabel": "Phone Number",
    "columnCountryLabel": "Country",
    "removeSelected": "Remove selected",
    "editMember": "Edit member",
    "removeMember": "Remove member",
    "tablePlaceholderText": "No members yet.",
    "tablePlaceholderButton": "Create new?",
    "createDialogOpen": "Create member"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter medlemmer",
    "columnFirstNameLabel": "Fornavn",
    "columnLastNameLabel": "Etternavn",
    "columnEmailAddressLabel": "E-post",
    "columnPhoneNumberLabel": "Telefon",
    "columnCountryLabel": "Land",
    "removeSelected": "Slett valgte",
    "editMember": "Rediger medlem",
    "removeMember": "Slett medlem",
    "tablePlaceholderText": "Ingen medlemmer enda.",
    "tablePlaceholderButton": "Opprett ny?",
    "createDialogOpen": "Opprett medlem"
  }
}
</i18n>

<template>
  <div>
    <div class="table-controls">
      <table-filter-search
        v-model="searchFilter"
        :label="$t('searchFormPlaceholder')"
        data-testid="clubsMembersSearchFilterInput"
      />

      <v-btn
        class="ml-auto"
        color="white"
        data-testid="clubsMembersCreateDialogOpenButton"
        @click.stop="createDialogOpen"
      >
        <v-icon left>
          add
        </v-icon>
        {{ $t("createDialogOpen") }}
      </v-btn>
    </div>

    <v-data-table
      v-model="selection"
      :headers="headers"
      :items="members"
      :search="searchFilter"
      :loading="loading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
      :items-per-page="100"
      data-testid="clubsMembersListTable"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              data-testid="clubsMembersListTableRowDropdown"
              small
              icon
              v-bind="attrs"
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
              @click.stop="editDialogOpen(item)"
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
              @click.stop="removeOne(item)"
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
          <template v-slot:activator="{ on: { click }, attrs }">
            <v-btn
              :disabled="!clubsMembersHasSelection"
              data-testid="clubsMembersListTableHeaderDropdown"
              small
              icon
              v-bind="attrs"
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
              @click.stop="removeMany(selection)"
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
import TableFilterSearch
  from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "ClubsMembersListTable",

  components: {
    TableFilterSearch
  },

  props: {
    members: { type: Array, default: (): [] => [] },
    loading: { type: Boolean, default: true }
  },

  data() {
    return {
      selection: [],
      searchFilter: "",
      headers: [{
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
    clubsMembersHasSelection(): boolean {
      return this.selection.length > 0
    }
  },

  methods: {
    createDialogOpen(): void {
      this.$emit("createDialogOpen")
    },

    editDialogOpen(member): void {
      this.$emit("editDialogOpen", member)
    },

    removeOne(member): void {
      this.$emit("removeOne", member)
    },

    removeMany(members): void {
      this.$emit("removeMany", members)
    }
  }
})
</script>
