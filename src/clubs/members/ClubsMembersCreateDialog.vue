<i18n>
{
  "en": {
    "dialogTitle": "Create member",
    "clubsMembersActionsCreateSuccess": "%{clubsMemberName} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett medlem",
    "clubsMembersActionsCreateSuccess": "%{clubsMemberName} ble lagt til i databasen"
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
        data-testid="clubsMembersCreateDialogSubmitButton"
        :loading="clubsMembersStateCreateIsLoading"
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
import clubsMembersStub from "./clubs.members.stub"
import ClubsMembersForm from "./ClubsMembersForm.vue"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "ClubsMembersCreateDialog",

  components: {
    ClubsMembersForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    club: { type: Object, required: false, default: (): null => null }
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
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    club(club): void {
      if(!club) return
      this.form.clubId = club.id
    }
  },

  methods: {
    ...mapActions("clubs/members", {
      clubsMembersActionsCreate: "create"
    }),

    submit(): void {
      this.$refs.clubsMembersForm.submit(async () => {
        try {
          await this.clubsMembersActionsCreate(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("clubsMembersActionsCreateSuccess", {
              clubsMemberName: this.form.name
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

    clear(): void {
      this.$refs.clubsMembersForm.resetFields()
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
