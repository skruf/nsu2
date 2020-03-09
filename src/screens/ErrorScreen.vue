<style scoped>
#error-screen {
  text-align: center;
}
.error_title {
  margin: 50px 0;
}
.error_image {
  max-width: 70px;
  margin: 0 auto;
}
.error_text {
  max-width: 700px;
  margin: 50px auto;
}
</style>

<template>
  <div class="flex items-center justify-center">
    <!-- <img
      class="error_image"
      src="../../../static/img/error.svg"
    > -->

    <h1 class="error_title">
      An error occurred!
    </h1>

    <p
      v-if="error"
      class="error_text"
    >
      {{ error }}
    </p>

    <v-btn
      text
      @click="navBack"
    >
      Prøv på nytt
    </v-btn>
  </div>
</template>

<script lang="ts">
import config from "@/app.config"

export default {
  name: "ErrorScreen",

  props: {
    error: { type: String, default: "" }
  },

  created(): void {
    if(config.env === "web") {
      console.error(this.error)
    } else {
      require("electron-log").error(this.error)
    }
  },

  methods: {
    navBack(): void {
      this.$router.go(-1)
    }
  }
}
</script>
