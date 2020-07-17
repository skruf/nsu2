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
    :mini-variant="isOpen"
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
        to="/events"
        :exact="false"
        link
      >
        <v-list-item-icon>
          <v-img
            :src="require('@/assets/icons/events.svg')"
            aspect-ratio="1"
            class="opacity-75"
            max-width="22px"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t("events") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        to="/clubs"
        :exact="false"
        link
      >
        <v-list-item-icon>
          <v-img
            :src="require('@/assets/icons/clubs.svg')"
            aspect-ratio="1"
            class="opacity-75"
            max-width="22px"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t("clubs") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        to="/weapons"
        :exact="false"
        link
      >
        <v-list-item-icon>
          <v-img
            :src="require('@/assets/icons/weapons.svg')"
            aspect-ratio="1"
            class="opacity-75"
            max-width="22px"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t("weapons") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        to="/ranges"
        :exact="false"
        link
      >
        <v-list-item-icon>
          <v-img
            :src="require('@/assets/icons/ranges.svg')"
            aspect-ratio="1"
            class="opacity-75"
            max-width="22px"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t("ranges") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- <v-list-item
        to="/records"
        :exact="false"
        link
      >
        <v-list-item-icon>
          <v-img
            :src="require('@/assets/icons/records.svg')"
            aspect-ratio="1"
            class="opacity-75"
            max-width="22px"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t("records") }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <v-list-item
        to="/settings"
        :exact="false"
        link
      >
        <v-list-item-icon>
          <v-img
            :src="require('@/assets/icons/settings.svg')"
            aspect-ratio="1"
            class="opacity-75"
            max-width="22px"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t("settings") }}
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

  data: () => ({
    isOpen: false
  }),

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
