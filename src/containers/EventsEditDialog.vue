<i18n>
{
  "en": {
    "title": "Edit event",
    "eventsActionsEditOneSuccess": "%{eventName} was successfully updated in the database"
  },
  "no": {
    "title": "Rediger stevnet",
    "eventsActionsEditOneSuccess": "%{eventName} var oppdatert i databasen"
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
    custom-class="edit-dialog"
    :title="$t('title')"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsStateEditIsLoading"
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
        data-testid="eventsEditDialogButtonSubmit"
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
  name: "EventsEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, default: () => ({ ...eventsStub, dates: [] }) }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsStub, dates: [] }
    }
  },

  components: {
    EventsForm
  },

  computed: mapState("events", {
    eventsStateEditIsLoading: "editIsLoading"
  }),

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    async open() {
      this.form = {
        ...this.event,
        dates: [
          this.event.startsAt,
          this.event.endsAt
        ]
      }

      await this.clubsActionsList()
      await this.rangesActionsList()

      const categoriesObserver = async (categories) => {
        this.categoriesIsLoading = true
        this.categories = categories
        this.categoriesIsLoading = false
      }

      const categoriesError = (e) => {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }

      this.categoriesSub = db.events_categories
        .find()
        .$.subscribe(categoriesObserver, categoriesError)
    },

    ...mapActions("events", {
      eventsActionsEditOne: "editOne"
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
          await this.eventsActionsEditOne(data)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("eventsActionsEditOneSuccess", {
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
      // this.form = { ...eventsStub, dates: [] }
      this.$refs.eventsForm.resetFields()
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
})
</script>
