<i18n>
{
  "en": {
    "formItemTitleLabel": "Title",
    "formItemTitlePlaceholder": "Enter a title",
    "formItemTitleError": "Title is a required field",
    "formItemDatesLabel": "Start / End",
    "formItemDatesPickerStart": "Start date",
    "formItemDatesPickerEnd": "End date",
    "formItemDatesError": "Dates is a required field",
    "formItemCategoryLabel": "Category",
    "formItemCategoryPlaceholder": "Select a category",
    "formItemCategoryError": "Category is a required field",
    "formItemOrganizerLabel": "Organizer",
    "formItemOrganizerPlaceholder": "Select the organizer",
    "formItemOrganizerError": "Organizer is a required field",
    "formItemRangeLabel": "Range",
    "formItemRangePlaceholder": "Select the range",
    "formItemRangeError": "Range is a required field",
    "formItemApprobatedLabel": "Approbated",
    "formItemApprobatedActiveText": "Is officially approbated"
  },
  "no": {
    "formItemTitleLabel": "Tittel",
    "formItemTitlePlaceholder": "Skriv inn tittel",
    "formItemTitleError": "Tittel er et påkrevd felt",
    "formItemDatesLabel": "Start / Slutt",
    "formItemDatesPickerStart": "Start dato",
    "formItemDatesPickerEnd": "Slutt dato",
    "formItemDatesError": "Dato er et påkrevd felt",
    "formItemCategoryLabel": "Kategori",
    "formItemCategoryPlaceholder": "Velg en kategori",
    "formItemCategoryError": "Kategori er et påkrevd felt",
    "formItemOrganizerLabel": "Arrangør",
    "formItemOrganizerPlaceholder": "Velg en klubb",
    "formItemOrganizerError": "Arrangør er et påkrevd felt",
    "formItemRangeLabel": "Skyttebane",
    "formItemRangePlaceholder": "Velg en skyttebane",
    "formItemRangeError": "Skyttebane er et påkrevd felt",
    "formItemApprobatedLabel": "Approbert",
    "formItemApprobatedActiveText": "Er offisielt approbert"
  }
}
</i18n>

<template>
  <el-form
    ref="form"
    label-position="top"
    :model="form"
    :rules="formRules"
  >
    <el-form-item
      prop="title"
      :label="$t('formItemTitleLabel')"
    >
      <el-input
        v-model="form.title"
        data-testid="eventsFormInputTitle"
        :placeholder="$t('formItemTitlePlaceholder')"
      />
    </el-form-item>

    <el-form-item
      prop="dates"
      :label="$t('formItemDatesLabel')"
    >
      <el-date-picker
        v-model="form.dates"
        type="daterange"
        range-separator="to"
        data-testid="eventsFormDatePickerDates"
        :start-placeholder="$t('formItemDatesPickerStart')"
        :end-placeholder="$t('formItemDatesPickerEnd')"
      />
    </el-form-item>

    <el-form-item
      prop="categoryId"
      :label="$t('formItemCategoryLabel')"
    >
      <el-select
        v-model="form.categoryId"
        data-testid="eventsFormSelectCategory"
        :placeholder="$t('formItemCategoryPlaceholder')"
        :loading="categoriesIsLoading"
      >
        <el-option
          v-for="category in categories"
          :data-testid="`eventsFormSelectCategoryValue${category.name.replace(/\s/g, '')}`"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="organizerId"
      :label="$t('formItemOrganizerLabel')"
    >
      <el-select
        v-model="form.organizerId"
        :placeholder="$t('formItemOrganizerPlaceholder')"
        :loading="clubsStateListIsLoading"
      >
        <el-option
          v-for="club in clubsStateList"
          :key="club.id"
          :label="`${club.name} (${club.area})`"
          :value="club.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="rangeId"
      :label="$t('formItemRangeLabel')"
    >
      <el-select
        v-model="form.rangeId"
        :placeholder="$t('formItemRangePlaceholder')"
        :loading="rangesStateListIsLoading"
      >
        <el-option
          v-for="range in rangesStateList"
          :key="range.id"
          :label="`${range.name} (${range.area})`"
          :value="range.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="approbated"
      data-testid="eventsFormLabelApprobated"
      :label="$t('formItemApprobatedLabel')"
    >
      <el-switch
        v-model="form.approbated"
        :active-text="$t('formItemApprobatedActiveText')"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import { eventsStub } from "@/stubs"
import { db } from "@/db"

export default Vue.extend({
  name: "EventsForm",

  props: {
    form: { type: Object, default: () => eventsStub }
  },

  data: function() {
    return {
      categories: [],
      categoriesSub: null,
      categoriesIsLoading: false,
      localForm: { ...eventsStub },
      formRules: {
        title: { required: true, message: this.$t("formItemTitleError") },
        dates: { required: true, message: this.$t("formItemDatesError") }
      }
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "createIsLoading",
      clubsStateList: "list"
    }),

    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list"
    })
  },

  watch: {
    localForm: {
      deep: true,
      handler(data) {
        this.$emit("update:form", data)
      }
    }
  },

  async created() {
    this.localForm = this.form
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

  methods: {
    ...mapActions("clubs", {
      clubsActionsList: "list"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    validate(cb) {
      this.$refs.localForm.validate(cb)
    },

    resetFields() {
      this.$refs.localForm.resetFields()
    }
  }
})
</script>
