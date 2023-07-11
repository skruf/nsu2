<i18n>
{
  "en": {
    "dialogTitle": "Create category",
    "eventsCategoriesActionsCreateSuccess": "%{eventsCategoryName} was successfully added to the database"
  },
  "no": {
    "dialogTitle": "Opprett kategori",
    "eventsCategoriesActionsCreateSuccess": "%{eventsCategoryName} ble lagt til i databasen"
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
        data-testid="eventsCategoriesCreateDialogSubmitButton"
        :loading="eventsCategoriesStateCreateIsLoading"
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
import ActionDialog from "@/components/ActionDialog.vue"
import eventsCategoriesStub from "./events.categories.stub"
import EventsCategoriesForm from "./EventsCategoriesForm.vue"

export default Vue.extend({
  name: "EventsCategoriesCreateDialog",

  components: {
    ActionDialog,
    EventsCategoriesForm
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsCategoriesStub }
    }
  },

  computed: mapState("events/categories", {
    eventsCategoriesStateCreateIsLoading: "createIsLoading"
  }),

  watch: {
    visible(visible): void {
      this.$emit("update:shown", visible)
    },
    shown(visible): void {
      this.visible = visible
    }
  },

  methods: {
    ...mapActions("events/categories", {
      eventsCategoriesActionsCreate: "create"
    }),

    submit(): void {
      this.$refs.eventsCategoriesForm.submit(async () => {
        try {
          const category = await this.eventsCategoriesActionsCreate(this.form)
          this.$success(this.$t("eventsCategoriesActionsCreateSuccess", {
            eventsCategoryName: this.form.name
          }))
          this.$emit("created", category)
          this.clear()
          this.close()
        } catch(e) {
          this.$error(e.message)
        }
      })
    },

    clear(): void {
      this.$refs.eventsCategoriesForm.resetFields()
      this.form = { ...eventsCategoriesStub }
    },

    close(): void {
      this.visible = false
    }
  }
})
</script>
