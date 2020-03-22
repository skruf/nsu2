<i18n>
{
  "en": {
    "dialogTitle": "Create member",
    "clubsMembersActionsCreateSuccess": "%{fullName} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett medlem",
    "clubsMembersActionsCreateSuccess": "%{fullName} ble lagt til i databasen"
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
      data-testid="clubsMembersCreateDialogForm"
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

  data() {
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
      if(!this.club) return
      this.form.clubId = this.club.id
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
      const fullName = `${this.form.firstName} ${this.form.lastName}`

      this.$refs.clubsMembersForm.submit(async () => {
        try {
          const member = await this.clubsMembersActionsCreate(this.form)
          this.$success(this.$t("clubsMembersActionsCreateSuccess", {
            fullName
          }))
          this.$emit("memberCreated", member)
          this.close()
          this.clear()
        } catch(e) {
          this.$error(e.message)
        }
      })
    },

    clear(): void {
      // this.$refs.clubsMembersForm.resetFields()
      this.form = { ...clubsMembersStub }
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
