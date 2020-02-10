<template>
  <iframe
    class="h-full w-full"
    :src="url"
  />
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "MapView",
  props: {
    lat: { type: String, required: true },
    lng: { type: String, required: true },
    zoom: { type: Number, default: 15 }
  },
  computed: {
    url(): string {
      return `https://www.google.com/maps?q=${this.lat},${this.lng}&z=${this.zoom}&hl=no&output=embed`
    }
  }
})
</script>
