<i18n>
{
  "en": {
    "formItemNumberLabel": "Number",
    "formItemNumberPlaceholder": "Enter a class number",
    "formItemNumberError": "Number is a required field",
    "formItemNameLabel": "Name",
    "formItemNamePlaceholder": "Enter a name",
    "formItemNameError": "Name is a required field",
    "formItemCategoryLabel": "Category",
    "formItemCategoryPlaceholder": "Select a category",
    "formItemCategoryError": "Category is a required field",
    "formItemConditionLabel": "Condition",
    "formItemConditionPlaceholder": "Select a condition",
    "formItemConditionError": "Condition is a required field",
    "formItemDistanceLabel": "Distance",
    "formItemDistanceError": "Distance is a required field"
  },
  "no": {
    "formItemNumberLabel": "Nummer",
    "formItemNumberPlaceholder": "Skriv et nummer",
    "formItemNumberError": "Nummer er et påkrevd felt",
    "formItemNameLabel": "Navn",
    "formItemNamePlaceholder": "Skriv et navn",
    "formItemNameError": "Navn er et påkrevd felt",
    "formItemCategoryLabel": "Kategori",
    "formItemCategoryPlaceholder": "Velg en kategori",
    "formItemCategoryError": "Kategori er et påkrevd felt",
    "formItemConditionLabel": "Tilstand",
    "formItemConditionPlaceholder": "Velg en tilstand",
    "formItemConditionError": "Tilstand er et påkrevd felt",
    "formItemDistanceLabel": "Avstand",
    "formItemDistanceError": "Avstand er et påkrevd felt"
  }
}
</i18n>

<template>
  <el-form
    ref="localForm"
    label-position="top"
    :model="localForm"
    :rules="formRules"
  >
    <el-form-item
      prop="number"
      :label="$t('formItemNumberLabel')"
    >
      <el-input
        v-model="form.number"
        :placeholder="$t('formItemNumberPlaceholder')"
        data-testid="weaponsFormInputNumber"
      />
    </el-form-item>

    <el-form-item
      prop="name"
      :label="$t('formItemNameLabel')"
    >
      <el-input
        v-model="form.name"
        :placeholder="$t('formItemNamePlaceholder')"
        data-testid="weaponsFormInputName"
      />
    </el-form-item>

    <el-form-item
      prop="category"
      :label="$t('formItemCategoryLabel')"
    >
      <el-select
        v-model="form.category"
        :placeholder="$t('formItemCategoryPlaceholder')"
        data-testid="weaponsFormSelectCategory"
      >
        <el-option
          v-for="(category, index) in weaponsStateCategories"
          :key="index"
          :label="category"
          :value="category"
          :data-testid="`weaponsFormSelectCategoryValue${category.replace(/\s/g, '')}`"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="condition"
      :label="$t('formItemConditionLabel')"
    >
      <el-select
        v-model="form.condition"
        :placeholder="$t('formItemConditionPlaceholder')"
        data-testid="weaponsFormSelectCondition"
      >
        <el-option
          v-for="(condition, index) in weaponsStateConditions"
          :key="index"
          :label="condition"
          :value="condition"
          :data-testid="`weaponsFormSelectConditionValue${condition.replace(/\s/g, '')}`"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      :label="$t('formItemDistanceLabel')"
      prop="distance"
    >
      <el-input-number
        v-model="form.distance"
        controls-position="right"
        size="small"
        :min="0"
        data-testid="weaponsFormInputDistance"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from "vuex"
import { weaponsStub } from "@/stubs"

export default {
  name: "WeaponsForm",

  props: {
    form: { type: Object, default: () => weaponsStub }
  },

  data: function() {
    return {
      localForm: { ...weaponsStub },
      formRules: {
        number: { required: true, message: this.$t("formItemNumberError") },
        name: { required: true, message: this.$t("formItemNameError") },
        category: { required: true, message: this.$t("formItemCategoryError") },
        condition: { required: true, message: this.$t("formItemConditionError") },
        distance: { required: true, message: this.$t("formItemDistanceError") }
      }
    }
  },

  computed: mapState("weapons", {
    weaponsStateCategories: "categories",
    weaponsStateConditions: "conditions"
  }),

  watch: {
    localForm: {
      deep: true,
      handler(data) {
        this.$emit("update:form", data)
      }
    }
  },

  created() {
    this.localForm = this.form
  },

  methods: {
    validate(cb) {
      this.$refs.localForm.validate(cb)
    },

    resetFields() {
      this.$refs.localForm.resetFields()
    }
  }
}
</script>
