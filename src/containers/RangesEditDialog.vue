<i18n>
{
  "en": {
    "title": "Edit range",
    "rangesActionsEditOneSuccess": "%{rangeName} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger skyttebane",
    "rangesActionsEditOneSuccess": "%{rangeName} ble oppdatert i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    :title="$t('title')"
    custom-class="edit-dialog"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="rangesStateEditOneIsLoading"
      class="dialog_content"
    >
      <ranges-form
        v-if="visible"
        ref="rangesForm"
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
        data-testid="rangesEditDialogButtonSubmit"
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
import { rangesStub } from "@/stubs"
import RangesForm from "@/components/RangesForm.vue"

export default Vue.extend({
  name: "RangesEditDialog",

  components: {
    RangesForm
  },

  props: {
    shown: { type: Boolean, default: false },
    range: { type: Object, default: () => rangesStub }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...rangesStub }
    }
  },

  computed: mapState("ranges", {
    rangesStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsEditOne: "editOne"
    }),

    open() {
      this.form = { ...this.range }
    },

    submit() {
      this.$refs.rangesForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.rangesActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("rangesActionsEditOneSuccess", {
              rangeName: this.form.name
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
      this.$refs.rangesForm.resetFields()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
})
</script>
