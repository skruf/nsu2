<i18n>
{
  "en": {
    "title": "Rediger medlem",
    "clubsMembersActionsEditOneSuccess": "%{fullName} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger medlem",
    "clubsMembersActionsEditOneSuccess": "%{fullName} ble oppdatert i databasen"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="edit-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    :append-to-body="true"
    @open="open"
    @close="close"
  >
    <div
      v-loading="clubsMembersStateEditIsLoading"
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
        data-testid="clubsMembersEditDialogButtonSubmit"
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
  name: "ClubsMembersEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    club: { type: Object, required: false, default: () => null },
    clubMember: { type: Object, default: () => clubsMembersStub }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...clubsMembersStub }
    }
  },

  computed: mapState("clubs/members", {
    clubsMembersStateEditIsLoading: "editIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    async open() {
      this.form = { ...this.clubMember }
      if(this.club) this.form.clubId = this.club.id
    },

    ...mapActions("clubs/members", {
      clubsMembersActionsEditOne: "editOne"
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
          await this.clubsMembersActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("title"),
            message: this.$t("clubsMembersActionsEditOneSuccess", {
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
