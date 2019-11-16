<i18n>
{
  "en": {
    "title": "Edit club",
    "submitSuccess": "%{name} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger klubb",
    "submitSuccess": "%{name} var oppdatert i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="edit-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsStateEditIsLoading"
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
        @click="close"
      >
        {{ $t("cancel") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        data-testid="clubsEditDialogFormButtonSubmit"
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
  name: "ClubsEditDialog",

  components: {
    ClubsForm
  },

  props: {
    shown: { type: Boolean, default: false },
    club: { type: Object, default: () => clubsStub }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...clubsStub }
    }
  },

  computed: mapState("clubs", {
    clubsStateEditIsLoading: "editIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsEditOne: "editOne"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    async open() {
      this.form = { ...this.club }
      await this.rangesActionsList()
    },

    submit() {
      this.$refs.clubsForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.clubsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("submitSuccess", {
              name: this.form.name
            })
          })
          this.clear()
          this.close()
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
