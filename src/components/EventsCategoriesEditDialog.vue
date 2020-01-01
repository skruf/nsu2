<i18n>
{
  "en": {
    "dialogTitle": "Edit category",
    "eventsCategoriesActionsEditOneSuccess": "%{eventsCategoryName} was successfully updated in the database"
  },
  "no": {
    "dialogTitle": "Rediger kategori",
    "eventsCategoriesActionsEditOneSuccess": "%{eventsCategoryName} ble redigert i databasen"
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
        data-testid="eventsCategoriesEditDialogSubmitButton"
        :loading="eventsCategoriesStateEditOneIsLoading"
        @click="submit"
      >
        {{ $t("save") }}
      </v-btn>
    </template>

    <events-categories-form
      ref="eventsCategoriesForm"
      v-model="form"
    />
  </action-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapState } from "vuex"
import { eventsCategoriesStub } from "@/stubs"
import EventsCategoriesForm from "@/components/EventsCategoriesForm.vue"
import ActionDialog from "@/components/ActionDialog.vue"

export default Vue.extend({
  name: "EventsCategoriesEditDialog",

  components: {
    EventsCategoriesForm,
    ActionDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    eventsCategory: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsCategoriesStub }
    }
  },

  computed: mapState("events/categories", {
    eventsCategoriesStateEditOneIsLoading: "editOneIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    },
    eventsCategory: {
      immediate: true,
      handler(data): void {
        this.form = { ...data }
      }
    }
  },

  methods: {
    ...mapActions("events/categories", {
      eventsCategoriesActionsEditOne: "editOne"
    }),

    submit(): void {
      this.$refs.eventsCategoriesForm.submit(async () => {
        try {
          await this.eventsCategoriesActionsEditOne(this.form)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("eventsCategoriesActionsEditOneSuccess", {
              eventsCategoryName: this.form.name
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

    clear(): void {
      this.$refs.eventsCategoriesForm.resetFields()
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
