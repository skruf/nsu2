<i18n>
{
  "en": {
    "title": "Create member",
    "clubsMembersActionsCreateSuccess": "%{fullName} was successfully added to the database"
  },
  "no": {
    "title": "Opprett et medlem",
    "clubsMembersActionsCreateSuccess": "%{fullName} ble lagt til i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="create-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    :append-to-body="true"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsMembersStateCreateIsLoading"
      class="dialog_content"
    >
      <clubs-members-form
        v-if="visible"
        ref="clubsMembersForm"
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
        data-testid="clubsMembersCreateDialogButtonSubmit"
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
import { clubsMembersStub } from "@/stubs"

export default Vue.extend({
  name: "ClubsMembersCreateDialog",

  props: {
    shown: { type: Boolean, default: false },
    club: { type: Object, required: false, default: () => null }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...clubsMembersStub }
    }
  },

  computed: mapState("clubs/members", {
    clubsMembersStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    async open() {
      if(this.club) this.form.clubId = this.club.id
    },

    ...mapActions("clubs/members", {
      clubsMembersActionsCreate: "create"
    }),

    submit() {
      this.$refs.clubsMembersForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        try {
          await this.clubsMembersActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("clubsMembersActionsCreateSuccess", {
              fullName: `${this.form.firstName} ${this.form.lastName}`
            })
          })
          this.close()
          this.clear()
        } catch(e) {
          this.$notify({
            title: "Oops!",
            type: "error",
            message: e.message
          })
        }
      })
    },

    clear() {
      this.$refs.clubsMembersForm.resetFields()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
})
</script>
