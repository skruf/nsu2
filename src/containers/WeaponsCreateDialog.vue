<i18n>
{
  "en": {
    "title": "Create weapon",
    "weaponsActionsCreateSuccess": "%{weaponsName} was successfully added to the database"
  },
  "no": {
    "title": "Opprett våpen",
    "weaponsActionsCreateSuccess": "%{weaponsName} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="create-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @close="close"
  >
    <div
      v-loading="weaponsStateCreateIsLoading"
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
        data-testid="weaponsCreateDialogFormButtonSubmit"
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
  name: "WeaponsCreateDialog",

  components: {
    WeaponsForm
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...weaponsStub }
    }
  },

  computed: mapState("weapons", {
    weaponsStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("weapons", {
      weaponsActionsCreate: "create"
    }),

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
          await this.weaponsActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("weaponsActionsCreateSuccess", {
              weaponsName: this.form.name
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
      this.$refs.weaponsForm.resetFields()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
})
</script>
