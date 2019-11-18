<i18n>
{
  "en": {
    "title": "Edit weapon",
    "weaponsActionsEditOneSuccess": "%{weaponsName} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger våpen",
    "weaponsActionsEditOneSuccess": "%{weaponsName} ble redigert i databasen"
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
      v-loading="weaponsStateEditOneIsLoading"
      class="dialog_content"
    >
      <weapons-form
        v-if="visible"
        ref="weaponsForm"
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
        data-testid="weaponsEditDialogButtonSubmit"
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
import { weaponsStub } from "@/stubs"
import WeaponsForm from "@/components/WeaponsForm.vue"

export default Vue.extend({
  name: "WeaponsEditDialog",

  components: {
    WeaponsForm
  },

  props: {
    shown: { type: Boolean, default: false },
    weapon: { type: Object, default: () => weaponsStub }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...weaponsStub }
    }
  },

  computed: mapState("weapons", {
    weaponsStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsEditOne: "editOne"
    }),

    open() {
      this.form = { ...this.weapon }
    },

    submit() {
      this.$refs.weaponsForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.weaponsActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("weaponsActionsEditOneSuccess", {
              weaponsName: this.form.name
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
      this.$refs.weaponsForm.resetFields()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
})
</script>
