<i18n>
{
  "en": {
    "formItemNameLabel": "Name",
    "formItemNamePlaceholder": "Enter a name",
    "formItemNameError": "Name is a required field",
    "formItemStreetAddressLabel": "Address",
    "formItemStreetAddressPlaceholder": "Enter a address",
    "formItemAreaLabel": "Area",
    "formItemAreaPlaceholder": "Enter an area",
    "formItemAreaError": "Area is a required field",
    "formItemCountryLabel": "Country",
    "formItemCountryPlaceholder": "Select a country",
    "formItemCountryError": "Country is a required field",
    "formItemLatLabel": "Latitude",
    "formItemLatPlaceholder": "Enter coordinates",
    "formItemLngLabel": "Longitude",
    "formItemLngPlaceholder": "Enter coordinates",
    "formItemTypeLabel": "Type",
    "formItemTypePlaceholder": "Select a type",
    "formItemTypeError": "Type is a required field"
  },
  "no": {
    "formItemNameLabel": "Navn",
    "formItemNamePlaceholder": "Skriv et navn",
    "formItemNameError": "Navn er et påkrevd felt",
    "formItemStreetAddressLabel": "Adresse",
    "formItemStreetAddressPlaceholder": "Skriv en adresse",
    "formItemAreaLabel": "Område",
    "formItemAreaPlaceholder": "Skriv et område",
    "formItemAreaError": "Område er et påkrevd felt",
    "formItemCountryLabel": "Land",
    "formItemCountryPlaceholder": "Velg et land",
    "formItemCountryError": "Land er et påkrevd felt",
    "formItemLatLabel": "Breddegrad",
    "formItemLatPlaceholder": "Skriv inn koordinater",
    "formItemLngLabel": "Lengdegrad",
    "formItemLngPlaceholder": "Skriv inn koordinater",
    "formItemTypeLabel": "Type",
    "formItemTypePlaceholder": "Velg en type",
    "formItemTypeError": "Type er et påkrevd felt"
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
      prop="name"
      :label="$t('formItemNameLabel')"
    >
      <el-input
        v-model="form.name"
        data-testid="rangesFormInputName"
        :placeholder="$t('formItemNamePlaceholder')"
      />
    </el-form-item>

    <el-form-item
      prop="streetAddress"
      :label="$t('formItemStreetAddressLabel')"
    >
      <el-input
        v-model="form.streetAddress"
        data-testid="rangesFormInputStreetAddress"
        :placeholder="$t('formItemStreetAddressPlaceholder')"
      />
    </el-form-item>

    <el-form-item
      prop="area"
      :label="$t('formItemAreaLabel')"
    >
      <el-input
        v-model="form.area"
        data-testid="rangesFormInputArea"
        :placeholder="$t('formItemAreaPlaceholder')"
      />
    </el-form-item>

    <el-form-item
      prop="country"
      :label="$t('formItemCountryLabel')"
    >
      <el-select
        v-model="form.country"
        data-testid="rangesFormSelectCountry"
        :placeholder="$t('formItemCountryPlaceholder')"
      >
        <el-option
          v-for="(country, index) in rangesStateCountries"
          :key="index"
          :label="country"
          :value="country"
          :data-testid="`rangesFormSelectCountryValue${country}`"
        />
      </el-select>
    </el-form-item>

    <div class="flex">
      <div class="flex-1 mr-2">
        <el-form-item
          prop="lat"
          :label="$t('formItemLatLabel')"
        >
          <el-input
            v-model="form.lat"
            :placeholder="$t('formItemLatPlaceholder')"
          />
        </el-form-item>
      </div>

      <div class="flex-1 ml-2">
        <el-form-item
          prop="lng"
          :label="$t('formItemLngLabel')"
        >
          <el-input
            v-model="form.lng"
            :placeholder="$t('formItemLngPlaceholder')"
          />
        </el-form-item>
      </div>
    </div>

    <el-form-item
      prop="type"
      :label="$t('formItemTypeLabel')"
    >
      <el-select
        v-model="form.type"
        data-testid="rangesFormSelectType"
        :placeholder="$t('formItemTypePlaceholder')"
      >
        <el-option
          v-for="(type, index) in [ 'Utebane', 'Innebane' ]"
          :key="index"
          :label="type"
          :value="type"
          :data-testid="`rangesFormSelectTypeValue${type}`"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"
import { rangesStub } from "@/stubs"

export default Vue.extend({
  name: "RangesForm",

  props: {
    form: { type: Object, default: () => rangesStub }
  },

  data: function() {
    return {
      localForm: { ...rangesStub },
      formRules: {
        name: { required: true, message: this.$t("formItemNameError") },
        area: { required: true, message: this.$t("formItemAreaError") },
        country: { required: true, message: this.$t("formItemCountryError") },
        type: { required: true, message: this.$t("formItemTypeError") }
      }
    }
  },

  computed: mapState("ranges", {
    rangesStateCountries: "countries"
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
})
</script>
