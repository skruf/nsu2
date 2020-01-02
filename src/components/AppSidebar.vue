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
    permanent
  >
    <div class="mx-auto px-4 my-4">
      <v-img
        src="@/assets/img/nsu-logo.png"
        aspect-ratio="1"
        class="lighten-2 block mx-auto"
        max-width="84px"
      />
    </div>

    <v-divider />

    <v-list
      dense
      nav
    >
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        link
      >
        <v-list-item-icon>
          <v-icon>
            {{ item.icon }}
          </v-icon>
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

  watch: {
    isOpen(): void {
      localStorage.isOpen = this.isOpen
    }
  },

  data: function() {
    return {
      isOpen: false,
      items: [
        { title: this.$t("events"), icon: "event", to: "/events" },
        { title: this.$t("categories"), icon: "category", to: "/events/categories" },
        { title: this.$t("clubs"), icon: "house", to: "/clubs" },
        { title: this.$t("weapons"), icon: "sports", to: "/weapons" },
        { title: this.$t("ranges"), icon: "adjust", to: "/ranges" },
        // { title: this.$t("records"), icon: "emoji_events", to: "/records" },
        { title: this.$t("settings"), icon: "settings_applications", to: "/settings" }
      ]
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
