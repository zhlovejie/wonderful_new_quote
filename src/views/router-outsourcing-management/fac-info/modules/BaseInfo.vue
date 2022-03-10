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
        <a-input-number
          :precision="2"
          :min="0"
          v-model="form.registerMon"
          style="width: 100%"
          placeholder="注册资金(元)"
        />
      </a-form-model-item>
      <a-form-model-item label="公司电话" prop="tel">
        <a-input v-model="form.tel" />
      </a-form-model-item>
      <a-form-model-item label="成立时间" prop="buildYear">
        <a-month-picker placeholder="成立时间" v-model="form.buildYear" style="width:100%;" />
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
        <a-input-number
          :precision="0"
          :min="1"
          v-model="form.employeeCount"
          style="width: 100%"
          placeholder="职工人数"
        />
      </a-form-model-item>
      <a-form-model-item label="场地范围" prop="groundRange">
        <a-input-number
          :precision="2"
          :min="0"
          v-model="form.groundRange"
          style="width: 100%"
          placeholder="占地面积(平方米)"
        />
      </a-form-model-item>
      <a-form-model-item label="年产值" prop="annualMon">
        <a-input-number
          :precision="2"
          :min="0"
          v-model="form.annualMon"
          style="width: 100%"
          placeholder="年产值(元)"
        />
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
        employeeCount: '',
        groundRange: '',
        annualMon: '',
        riskDicId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        addressIds: [
          {
            type: 'array',
            required: true,
            message: '请输入公司地址',
            trigger: 'change'
          }
        ],
        proDicId: [{ required: true, message: '请选择公司性质', trigger: 'change' }],
        juridicalName: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' },
          { pattern:/[\u4e00-\u9fa5A-Za-z]{1,}/, message: '支持汉字和英文', trigger: 'blur' }
        ],
        juridicalCardNo:[
          { required: true, message: '请输入法人身份证号码', trigger: 'blur' },
          { pattern:/^\d{15}$|^\d{17}[0-9Xx]$/, message: '格式错误', trigger: 'blur' }
        ],
        licenseUrl:[
          { required: true, message: '请上传营业执照', trigger: 'change' },
        ],
        registerMon:[
          { required: true, message: '请输入注册资金', trigger: 'change' },
        ],
        tel:[
          { required: true, message: '请输入公司电话', trigger: 'change' },
        ],
        buildYear:[
          { required: true, message: '请选择成立时间', trigger: 'change' },
        ],
        faithDicId:[
          { required: true, message: '请选择诚信等级', trigger: 'change' },
        ],
        employeeCount:[
          { required: true, message: '请输入职工人数', trigger: 'blur' },
        ],
        groundRange:[
          { required: true, message: '请输入场地范围', trigger: 'blur' },
        ],
        annualMon:[
          { required: true, message: '请输入年产值', trigger: 'blur' },
        ],
        riskDicId:[
          { required: true, message: '请选择商业风险', trigger: 'change' },
        ]
        
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
    validate() {
      const that = this
      return new Promise(resolve => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              code:0,
              result:{
                ...that.form
              }
            })
          } else {
            resolve({
              code:500,
              result:{}
            })
          }
        });
      })
    }
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
