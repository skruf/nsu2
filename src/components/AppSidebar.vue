<style>
.v-navigation-drawer .v-list-item__icon,
.v-navigation-drawer .v-list-item__content {
  @apply m-0;
}

.v-navigation-drawer .v-list-item__icon {
  @apply py-2;
}
.v-navigation-drawer .v-list-item__content {
  @apply py-1;
}

.v-navigation-drawer .v-list-item {
  min-height: 24px;
  color: #fff !important;
  text-decoration: none !important;
}

.v-navigation-drawer__border {
  width: 0;
}

.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  @apply mr-5;
}

.v-navigation-drawer--mini-variant .v-list-item__icon,
.v-navigation-drawer--mini-variant .v-list-item__content {
  margin-right: 0 !important;
}

.v-navigation-drawer--mini-variant .v-list-item__icon {
  @apply py-2;
}
</style>

<i18n>
{
  "en": {
    "events": "Events",
    "all": "All",
    "upcoming": "Upcoming",
    "history": "History",
    "categories": "Categories",
    "clubs": "Clubs",
    "weapons": "Weapons",
    "ranges": "Ranges",
    "records": "Records",
    "settings": "Settings"
  },
  "no": {
    "events": "Stevner",
    "all": "Alle",
    "upcoming": "Kommende",
    "history": "Avsluttet",
    "categories": "Kategorier",
    "clubs": "Klubber",
    "weapons": "Våpen",
    "ranges": "Skyttebaner",
    "records": "Rekorder",
    "settings": "Innstillinger"
  }
}
</i18n>

<template>
  <v-navigation-drawer
    :mini-variant.sync="isOpen"
    app
    dark
    permanent
    color="primary"
    width="200"
  >
    <div class="flex justify-center px-1 my-4">
      <v-img
        src="@/assets/img/nsu-logo.png"
        aspect-ratio="1"
        class="lighten-2 block mx-px"
        max-width="84px"
      />
    </div>

    <v-list nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        :exact="item.exact || false"
        link
      >
        <v-list-item-icon>
          <v-img
            :src="item.icon"
            aspect-ratio="1"
            class="opacity-75"
            max-width="22px"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-btn
      icon
      class="absolute bottom-0 left-0"
      @click.stop="toggle"
    >
      <v-icon>
        <template v-if="isOpen">
          chevron_right
        </template>
        <template v-else>
          chevron_left
        </template>
      </v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "AppSidebar",

  data() {
    return {
      isOpen: false,
      items: [
        { title: this.$t("events"), icon: require("@/assets/icons/events.svg"), to: "/events" },
        { title: this.$t("categories"), icon: require("@/assets/icons/categories.svg"), to: "/events/categories", exact: true },
        { title: this.$t("clubs"), icon: require("@/assets/icons/clubs.svg"), to: "/clubs" },
        { title: this.$t("weapons"), icon: require("@/assets/icons/weapons.svg"), to: "/weapons" },
        { title: this.$t("ranges"), icon: require("@/assets/icons/ranges.svg"), to: "/ranges" },
        // { title: this.$t("records"), icon: require("@/assets/icons/records.svg"), to: "/records" },
        { title: this.$t("settings"), icon: require("@/assets/icons/settings.svg"), to: "/settings" }
      ]
    }
  },

  watch: {
    isOpen(): void {
      localStorage.isOpen = this.isOpen
    }
  },

  created() {
    if(localStorage.isOpen === undefined) return
    this.isOpen = localStorage.isOpen === "true"
  },

  methods: {
    toggle(): void {
      this.isOpen = !this.isOpen
    },

    navTo(url): void {
      this.$router.push(url)
    }
  }
})
</script>
