<i18n>
{
  "en": {
    "dialogTitle": "Edit member",
    "clubsMembersActionsEditOneSuccess": "%{clubsMemberName} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger medlem",
    "clubsMembersActionsEditOneSuccess": "%{clubsMemberName} ble redigert i databasen"
  }
}
</i18n>

<template>
  <action-dialog :shown.sync="visible">
    <template v-slot:title>
      {{ $t("dialogTitle") }}
    </template>

    <template v-slot:actions>
      <v-btn
        text
        data-testid="clubsMembersEditDialogSubmitButton"
        :loading="clubsMembersStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <clubs-members-form
      ref="clubsMembersForm"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { clubsMembersStub } from "@/stubs"
import ClubsMembersForm from "@/components/ClubsMembersForm.vue"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "ClubsMembersEditDialog",

  components: {
    ClubsMembersForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    clubMember: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...clubsMembersStub }
    }
  },

  computed: mapState("clubs/members", {
    clubsMembersStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    clubMember: {
      immediate: true,
      handler(data): void {
        this.form = { ...data }
      }
    }
  },

  methods: {
    ...mapActions("clubs/members", {
      clubsMembersActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.clubsMembersForm.submit(async () => {
        try {
          await this.clubsMembersActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("clubsMembersActionsEditOneSuccess", {
              clubsMemberName: this.form.name
            })
          })
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

    close(): void {
      this.visible = false
    }
  }
})
</script>
