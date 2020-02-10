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
    "tablePlaceholderButton": "Create new?"
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
    "tablePlaceholderButton": "Opprett ny?"
  }
}
</i18n>

<template>
  <div>
    <div class="table-controls">
      <table-filter-search
        v-model="clubsMembersSearchFilter"
        :label="$t('searchFormPlaceholder')"
        data-testid="clubsMembersSearchFilterInput"
      />

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
      :search="clubsMembersSearchFilter"
      :loading="clubsMembersStateListIsLoading"
      :loading-text="$t('loading')"
      :no-data-text="$t('tablePlaceholderText')"
      :show-select="true"
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
import { mapActions, mapState } from "vuex"
import TableFilterSearch from "@/components/TableFilterSearch.vue"

export default Vue.extend({
  name: "ClubsMembersListTable",

  components: {
    TableFilterSearch
  },

  props: {
    club: { type: Object, required: true }
  },

  data() {
    return {
      clubsMembersSelection: [],
      clubsMembersSearchFilter: "",
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
      clubsMembersStateList: "list"
    }),
    clubsMembersHasSelection(): boolean {
      return this.clubsMembersSelection.length > 0
    }
  },

  watch: {
    club: {
      immediate: true,
      handler: function(): void {
        if(!this.club) return
        this.clubsMembersActionsList({
          filter: { clubId: this.club.id },
          persistFilter: true
        })
      }
    }
  },

  methods: {
    ...mapActions("clubs/members", {
      clubsMembersActionsList: "list"
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
