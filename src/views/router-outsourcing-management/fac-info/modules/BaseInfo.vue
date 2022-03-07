<template>
  <div class="__fac_info_wrapper__">
    <h2>加工商公司信息</h2>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="公司名称" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="公司地址" prop="addressIds">
        <div style="display:flex;margin-top: 4px;">
          <CaseCadeArea ref="caseCadeArea" :area="form.addressIds || []" @change="areaChange" style="width:400px;" />
          <a-input style="margin-left:10px;" v-model="form.addressDetail" placeholder="详细地址" />
        </div>
      </a-form-model-item>
      <a-form-model-item label="公司性质" prop="proDicId">
        <CommonDictionarySelect
          style="width: 100%"
          placeholder="公司性质"
          :text="'加工商公司性质'"
          :dictionaryId.sync="form.proDicId"
          @selected="handleProChange"
        />
      </a-form-model-item>

      <a-form-model-item label="公司主页" prop="netUrl">
        <a-input v-model="form.netUrl" />
      </a-form-model-item>
      <a-form-model-item label="公司法人姓名" prop="juridicalName">
        <a-input v-model="form.juridicalName" />
      </a-form-model-item>
      <a-form-model-item label="公司法人身份证号" prop="juridicalCardNo">
        <a-input v-model="form.juridicalCardNo" />
      </a-form-model-item>
      <a-form-model-item label="营业执照" prop="licenseUrl">
        <UploadFile
          key="image"
          ref="uploadImage"
          :config="uploadImageConfig"
          @change="fileList => fileChange(fileList, 'image')"
        />
      </a-form-model-item>
      <a-form-model-item label="注册资金" prop="registerMon">
        <a-input v-model="form.registerMon" />
      </a-form-model-item>
      <a-form-model-item label="公司电话" prop="tel">
        <a-input v-model="form.tel" />
      </a-form-model-item>
      <a-form-model-item label="成立时间" prop="buildYear">
        <a-input v-model="form.buildYear" />
      </a-form-model-item>
      <a-form-model-item label="诚信等级" prop="faithDicId">
        <CommonDictionarySelect
          style="width: 100%"
          placeholder="诚信等级"
          :text="'诚信级别'"
          :dictionaryId.sync="form.faithDicId"
          @selected="handleFaithChange"
        />
      </a-form-model-item>
      <a-form-model-item label="职工人数" prop="employeeCount">
        <a-input v-model="form.employeeCount" />
      </a-form-model-item>
      <a-form-model-item label="场地范围" prop="groundRange">
        <a-input v-model="form.groundRange" />
      </a-form-model-item>
      <a-form-model-item label="年产值" prop="annualMon">
        <a-input v-model="form.annualMon" />
      </a-form-model-item>
      <a-form-model-item label="商业风险" prop="riskDicId">
        <CommonDictionarySelect
          style="width: 100%"
          placeholder="商业风险"
          :text="'加工商商业风险'"
          :dictionaryId.sync="form.riskDicId"
          @selected="handleRiskChange"
        />
      </a-form-model-item>
    </a-form-model>
    <div class="steps-action">
      <a-button type="primary" @click="next">
        下一步
      </a-button>
    </div>
  </div>
</template>

<script>
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import CaseCadeArea from '@/components/CustomerList/CaseCadeArea'
import UploadFile from './UploadFile'

export default {
  name: 'baseInfo',
  components: {
    CaseCadeArea,
    CommonDictionarySelect,
    UploadFile
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      form: {
        name: '',
        addressIds: [],
        addressDetail: '',
        proDicId: '',
        netUrl: '',
        juridicalName: '',
        juridicalCardNo: '',
        licenseUrl: '',
        registerMon: '',
        tel: '',
        buildYear: '',
        faithDicId: '',
        employeeCount: 0,
        groundRange: '',
        annualMon: '',
        riskDicId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],
        addressIds: [
          {
            type: 'array',
            required: true,
            message: '请输入公司地址',
            trigger: 'change'
          }
        ],
        resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
      },
      uploadImageConfig: {
        maxFileCount: 3,
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: true,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          attr: {
            icon: 'plus',
            type: 'link'
          }
        }
      }
    }
  },
  methods: {
    areaChange({ area, text }) {
      this.form = {
        ...this.form,
        addressIds: area,
        addressNames: text
      }
    },
    handleProChange(record) {
      this.form = {
        ...this.form,
        proDicName: record.text
      }
    },
    handleFaithChange(record) {
      this.form = {
        ...this.form,
        faithDicName: record.text
      }
    },
    handleRiskChange(record) {
      this.form = {
        ...this.form,
        riskDicName: record.text
      }
    },
    fileChange(fileList, type) {
      this.form = {
        ...this.form,
        licenseUrl: fileList.map(f => f.url).join(',')
      }
    },
    next() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          let current = 0,type = 'next'
          that.$emit('change',current,type,this.form)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
</style>
