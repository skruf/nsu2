<i18n>
{
  "en": {
    "title": "Create club",
    "submitSuccess": "%{name} was successfully added to the database"
  },
  "no": {
    "title": "Opprett klubb",
    "submitSuccess": "%{name} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="create-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsStateCreateIsLoading"
      class="dialog_content"
    >
      <clubs-form
        v-if="visible"
        ref="clubsForm"
        :form.sync="form"
      />
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="clear"
      >
        {{ $t("cancel") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        data-testid="clubsCreateDialogFormButtonSubmit"
        @click="submit"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { clubsStub } from "@/stubs"
import ClubsForm from "@/components/ClubsForm.vue"

export default Vue.extend({
  name: "ClubsCreateDialog",

  components: {
    ClubsForm
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...clubsStub }
    }
  },

  computed: mapState("clubs", {
    clubsStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsCreate: "create"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    async open() {
      await this.rangesActionsList()
    },

    async submit() {
      this.$refs.clubsForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.clubsActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("submitSuccess", {
              name: this.form.name
            })
          })
          this.close()
          this.clear()
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      })
    },

    clear() {
      this.$refs.clubsForm.resetFields()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", this.visible)
    }
  }
})
</script>
