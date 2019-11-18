<i18n>
{
  "en": {
    "title": "Create range",
    "rangesActionsCreateSuccess": "%{rangeName} was successfully added to the database"
  },
  "no": {
    "title": "Opprett skyttebane",
    "rangesActionsCreateSuccess": "%{rangeName} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    :title="$t('title')"
    custom-class="create-dialog"
    :visible.sync="visible"
    @close="close"
  >
    <div
      v-loading="rangesStateCreateIsLoading"
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
        data-testid="rangesCreateDialogButtonSubmit"
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
  name: "RangesCreateDialog",

  components: {
    RangesForm
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...rangesStub }
    }
  },

  computed: mapState("ranges", {
    rangesStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsCreate: "create"
    }),

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
          await this.rangesActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("rangesActionsCreateSuccess", {
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
