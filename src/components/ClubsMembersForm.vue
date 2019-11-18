<i18n>
{
  "en": {
    "formItem1Label": "First Name",
    "formItem1Placeholder": "Enter a first name",
    "formItem1Error": "First name is a required field",
    "formItem2Label": "Last Name",
    "formItem2Placeholder": "Enter a last name",
    "formItem2Error": "Last name is a required field",
    "formItem3Label": "Email Address",
    "formItem3Placeholder": "Enter a email address",
    "formItem3Error": "Email is a required field",
    "formItem4Label": "Phone Number",
    "formItem4Placeholder": "Enter a phone number",
    "formItem5Label": "Country",
    "formItem5Placeholder": "Select a country",
    "formItem6Label": "Club",
    "formItem6Placeholder": "Please select a club",
    "formItem6Error": "Select a club"
  },
  "no": {
    "formItem1Label": "Fornavn",
    "formItem1Placeholder": "Skriv inn fornavn",
    "formItem1Error": "Fornavn er et påkrevd felt",
    "formItem2Label": "Etternavn",
    "formItem2Placeholder": "Skriv inn etternavn",
    "formItem2Error": "Etternavn er et påkrevd felt",
    "formItem3Label": "Epost adresse",
    "formItem3Placeholder": "Skriv inn en e-post adresse",
    "formItem3Error": "Epost adresse er et påkrevd felt",
    "formItem4Label": "Telefonnummer",
    "formItem4Placeholder": "Skriv inn et telefonnummer",
    "formItem5Label": "Land",
    "formItem5Placeholder": "Velg et land",
    "formItem6Label": "Klubb",
    "formItem6Placeholder": "Velg en klubb",
    "formItem6Error": "Klubb er et påkrevd felt"
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
      :label="$t('formItem1Label')"
      prop="firstName"
    >
      <el-input
        v-model="form.firstName"
        data-testid="clubsMembersFormInputFirstName"
        :placeholder="$t('formItem1Placeholder')"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItem2Label')"
      prop="lastName"
    >
      <el-input
        v-model="form.lastName"
        data-testid="clubsMembersFormInputLastName"
        :placeholder="$t('formItem2Placeholder')"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItem3Label')"
      prop="emailAddress"
    >
      <el-input
        v-model="form.emailAddress"
        data-testid="clubsMembersFormInputEmailAddress"
        :placeholder="$t('formItem3Placeholder')"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItem4Label')"
      prop="phoneNumber"
    >
      <el-input
        v-model="form.phoneNumber"
        :placeholder="$t('formItem4Placeholder')"
      />
    </el-form-item>

    <el-form-item
      :label="$t('formItem5Label')"
      prop="country"
    >
      <el-select
        v-model="form.country"
        filterable
        :placeholder="$t('formItem5Placeholder')"
      >
        <el-option
          v-for="(country, index) in clubsMembersStateCountries"
          :key="index"
          :label="country"
          :value="country"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="clubId"
      :label="$t('formItem6Label')"
    >
      <el-select
        v-model="form.clubId"
        filterable
        :placeholder="$t('formItem6Placeholder')"
        :loading="clubsStateListIsLoading"
      >
        <el-option
          v-for="clubItem in clubsStateList"
          :key="clubItem.id"
          :label="clubItem.name"
          :value="clubItem.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState, mapActions } from "vuex"
import { clubsStub } from "@/stubs"

export default Vue.extend({
  name: "ClubsForm",

  props: {
    form: { type: Object, default: () => clubsStub },
    club: { type: Object, required: false, default: () => null }
  },

  data: function() {
    return {
      localForm: { ...clubsStub },
      formRules: {
        firstName: { required: true, message: this.$t('formItem1Error') },
        lastName: { required: true, message: this.$t('formItem2Error') },
        email: { required: true, message: this.$t('formItem3Error') },
        clubId: { required: true, message: this.$t('formItem6Error') }
      }
    }
  },

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateList: "list"
    }),

    ...mapState("clubs/members", {
      clubsMembersStateCreateIsLoading: "createIsLoading",
      clubsMembersStateCountries: "countries"
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
    if(this.club) this.form.clubId = this.club.id
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsList: "list"
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
