<i18n>
{
  "en": {
    "title": "Create event",
    "eventsActionsCreateSuccess": "%{eventName} was successfully added to the database"
  },
  "no": {
    "title": "Opprett stevne",
    "eventsActionsCreateSuccess": "%{eventName} var opprettet i databasen"
  }
}
</i18n>

<style lang="stylus">
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-select
  width 100%
.el-range-editor .el-range-input
  width 50%
</style>

<template>
  <el-dialog
    custom-class="create-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @close="close"
  >
    <div
      v-loading="eventsStateCreateIsLoading"
      class="dialog_content"
    >
      <events-form
        v-if="visible"
        ref="eventsForm"
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
        data-testid="eventsCreateDialogButtonSubmit"
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
import { db } from "@/db"
import { eventsStub } from "@/stubs"
import EventsForm from "@/components/EventsForm.vue"

export default Vue.extend({
  name: "EventsCreateDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  components: {
    EventsForm
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsStub, dates: [] }
    }
  },

  computed: mapState("events", {
    eventsStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("events", {
      eventsActionsCreate: "create"
    }),

    submit() {
      this.$refs.eventsForm.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        const data = { ...this.form }

        if(typeof data.dates[0] !== "string") {
          data.startsAt = data.dates[0].toISOString()
        }

        if(typeof data.dates[1] !== "string") {
          data.endsAt = data.dates[1].toISOString()
        }

        delete data.dates

        try {
          await this.eventsActionsCreate(data)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("eventsActionsCreateSuccess", {
              eventName: data.title
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
      this.$refs.eventsForm.resetFields()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
})
</script>
