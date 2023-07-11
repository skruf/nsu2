<i18n>
{
  "en": {
    "dialogTitle": "Edit member",
    "clubsMembersActionsEditOneSuccess": "%{fullName} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger medlem",
    "clubsMembersActionsEditOneSuccess": "%{fullName} ble redigert i databasen"
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
      data-testid="clubsMembersEditDialogForm"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import ActionDialog from "@/components/ActionDialog.vue"
import clubsMembersStub from "./clubs.members.stub"
import ClubsMembersForm from "./ClubsMembersForm.vue"

export default Vue.extend({
  name: "ClubsMembersEditDialog",

  components: {
    ActionDialog,
    ClubsMembersForm
  },

  props: {
    shown: { type: Boolean, default: false },
    member: { type: Object, required: true }
  },

  data() {
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
    member: {
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
      const fullName = `${this.form.firstName} ${this.form.lastName}`

      this.$refs.clubsMembersForm.submit(async () => {
        try {
          await this.clubsMembersActionsEditOne(this.form)
          this.$success(this.$t("clubsMembersActionsEditOneSuccess", {
            fullName
          }))
          this.close()
        } catch(e) {
          this.$error(e.message)
        }
      })
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
