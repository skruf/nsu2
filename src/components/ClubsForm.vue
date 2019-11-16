<i18n>
{
  "en": {
    "formItemNameLabel": "Name",
    "formItemNamePlaceholder": "Name",
    "formItemNameError": "Name is a required field",
    "formItemLeaderLabel": "Leader",
    "formItemLeaderPlaceholder": "Enter a name",
    "formItemEmailAddressLabel": "Email",
    "formItemEmailAddressPlaceholder": "Enter an email address",
    "formItemAddressLabel": "Address",
    "formItemAddressPlaceholder": "Enter an address",
    "formItemAreaLabel": "Area",
    "formItemAreaPlaceholder": "Enter an area",
    "formItemAreaError": "Area is a required field",
    "formItemCountryLabel": "Country",
    "formItemCountryPlaceholder": "Select a country",
    "formItemCountryError": "Country is a required field",
    "formItemRangeIdLabel": "Range",
    "formItemRangeIdPlaceholder": "Select a shooting range"
  },
  "no": {
    "formItemNameLabel": "Navn",
    "formItemNamePlaceholder": "Navn",
    "formItemNameError": "Navn er et påkrevet felt",
    "formItemLeaderLabel": "Leder",
    "formItemLeaderPlaceholder": "Skriv inn et navn",
    "formItemEmailAddressLabel": "Epost",
    "formItemEmailAddressPlaceholder": "Skriv inn en epost adresse",
    "formItemAddressLabel": "Adresse",
    "formItemAddressPlaceholder": "Skriv inn en adresse",
    "formItemAreaLabel": "Område",
    "formItemAreaPlaceholder": "Skriv inn et område",
    "formItemAreaError": "Område er et påkrevet felt",
    "formItemCountryLabel": "Land",
    "formItemCountryPlaceholder": "Velg et land",
    "formItemCountryError": "Land er et påkrevet felt",
    "formItemRangeIdLabel": "Skyttebane",
    "formItemRangeIdPlaceholder": "Velg en skyttebane"
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
      :label="$t('formItemNameLabel')"
      prop="name"
    >
      <el-input
        v-model="localForm.name"
        :placeholder="$t('formItemNamePlaceholder')"
        data-testid="clubsFormInputName"
      />
    </el-form-item>

    <el-form-item
      label="Forkortelse"
      prop="shortName"
    >
      <el-input
        v-model="localForm.shortName"
        placeholder="Skriv inn forkortelse"
        data-testid="clubsFormInputShortName"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItemLeaderLabel')"
      prop="leader"
    >
      <el-input
        v-model="localForm.leader"
        :placeholder="$t('formItemLeaderPlaceholder')"
        data-testid="clubsFormInputLeader"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItemEmailAddressLabel')"
      prop="emailAddress"
    >
      <el-input
        v-model="localForm.emailAddress"
        :placeholder="$t('formItemEmailAddressPlaceholder')"
        data-testid="clubsFormInputEmailAddress"
      />
    </el-form-item>

    <el-form-item
      label="Telefonnummer"
      prop="phoneNumber"
    >
      <el-input
        v-model="localForm.phoneNumber"
        placeholder="Skriv inn et telefonnummer"
        data-testid="clubsFormInputPhoneNumber"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItemAddressLabel')"
      prop="address"
    >
      <el-input
        v-model="localForm.address"
        :placeholder="$t('formItemAddressPlaceholder')"
        data-testid="clubsFormInputAddress"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItemAreaLabel')"
      prop="area"
    >
      <el-input
        v-model="localForm.area"
        :placeholder="$t('formItemAreaPlaceholder')"
        data-testid="clubsFormInputArea"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItemCountryLabel')"
      prop="country"
    >
      <el-select
        v-model="localForm.country"
        :placeholder="$t('formItemCountryPlaceholder')"
        data-testid="clubsFormSelectCountry"
      >
        <el-option
          v-for="(country, index) in clubsStateCountries"
          :key="index"
          :label="country"
          :value="country"
          :data-testid="`clubsFormSelectCountryValue${country.replace(/\s/g, '')}`"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="Link til webside"
      prop="website"
      data-testid="clubsFormInputWebsite"
    >
      <el-input
        v-model="localForm.website"
        placeholder="Skriv inn en link til klubbens hjemmeside"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItemRangeIdLabel')"
      prop="rangeId"
    >
      <el-select
        v-model="localForm.rangeId"
        :placeholder="$t('formItemRangeIdPlaceholder')"
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
  </el-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"
import { clubsStub } from "@/stubs"

export default Vue.extend({
  name: "ClubsForm",

  props: {
    form: { type: Object, default: () => clubsStub }
  },

  data: function() {
    return {
      localForm: { ...clubsStub },
      formRules: {
        name: { required: true, message: this.$t("formItemNameError") },
        shortName: { required: true, message: "Vennligst skriv inn en forkortelse" },
        area: { required: true, message: this.$t("formItemAreaError") },
        country: { required: true, message: this.$t("formItemCountryError") }
      }
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateCountries: "countries"
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
