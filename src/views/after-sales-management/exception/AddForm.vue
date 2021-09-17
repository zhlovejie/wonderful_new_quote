<template>

  <a-spin :spinning="spinning">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="routine-addform-wrapper-baseInnerData"
    >
      <h3>基本数据</h3>
      <table class="custom-table custom-table-border">
        <tbody>
          <tr>
            <td style="width:150px;">
              <span >单据编号</span>
            </td>
            <td>
              <a-form-model-item>
                <a-input
                  v-if="!isDisabled"
                  v-model="form.serialNum"
                  placeholder="系统生成"
                  disabled="disabled"
                />
                <span v-else>{{form.serialNum}}</span>
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span class="icon-required">是否为客诉</span>
            </td>
            <td>
              <a-form-model-item prop="formCustomer">
                <a-radio-group v-if="!isDisabled" name="radioGroup" v-model="form.formCustomer" :default-value="1">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="2">否</a-radio>
                </a-radio-group>
                <span v-else>{{ {1:'是',2:'否'}[form.formCustomer] }}</span>
              </a-form-model-item>
            </td>
          </tr>

            <tr v-if="form.formCustomer === 1">
              <td style="width:150px;">
                <span class="icon-required">客户名称</span>
              </td>
              <td>
                <a-form-model-item prop="customerName">
                  <a-input
                    v-if="!isDisabled"
                    v-model="form.customerName"
                    placeholder="客户名称"
                    read-only="read-only"
                    @click="handlerCustomerClick"
                  />
                  <span v-else>{{form.customerName}}</span>
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span >销售经理</span>
              </td>
              <td>
                <a-form-model-item >
                  <a-input
                    v-if="!isDisabled"
                    v-model="form.salemanName"
                    placeholder="销售经理"
                    read-only="read-only"
                  />
                  <span v-else>
                    {{form.salemanName}}
                  </span>
                  <!-- {{form.salesmanId}} -->
                </a-form-model-item>
              </td>
            </tr>
            <tr v-if="form.formCustomer === 1">
              <td style="width:150px;">
                <span class="icon-required">客诉等级</span>
              </td>
              <td>
                <a-form-model-item prop="complaintLevel">
                  <a-select v-if="!isDisabled" v-model="form.complaintLevel">
                    <a-select-option :value="1">一般</a-select-option>
                    <a-select-option :value="2">重大</a-select-option>
                  </a-select>
                  <span v-else>{{ {1:'一般',2:'重大'}[form.complaintLevel] }}</span>
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span class="icon-required">异常类型</span>
              </td>
              <td>
                <a-form-model-item prop="exceptionTypeDicId">
                  <CommonDictionarySelect
                    v-if="!isDisabled"
                    placeholder="异常类型"
                    style="width: 100%;"
                    allowClear
                    :text="'售后异常类型'"
                    :dictionaryId.sync="form.exceptionTypeDicId"
                    @selected="handlerExceptionTypeChange"
                  />
                  <span v-else>{{form.exceptionTypeName}}</span>
                </a-form-model-item>
              </td>
            </tr>


            <tr v-if="form.formCustomer === 2">
              <td style="width:150px;">
                <span class="icon-required">异常类型</span>
              </td>
              <td colspan="3">
                <a-form-model-item prop="exceptionTypeDicId">
                  <CommonDictionarySelect
                    v-if="!isDisabled"
                    placeholder="异常类型"
                    style="width: 100%;"
                    allowClear
                    :text="'售后异常类型'"
                    :dictionaryId.sync="form.exceptionTypeDicId"
                    @selected="handlerExceptionTypeChange"
                  />
                  <span v-else>{{form.exceptionTypeName}}</span>
                </a-form-model-item>
              </td>
            </tr>

          <tr>
            <td style="width:150px;">
              <span class="icon-required">紧急程度</span>
            </td>
            <td>
              <a-form-model-item prop="urgencyDegree">
                <a-select v-if="!isDisabled" v-model="form.urgencyDegree">
                  <a-select-option :value="1">一般</a-select-option>
                  <a-select-option :value="2">紧急</a-select-option>
                </a-select>
                <span v-else>{{ {1:'一般',2:'紧急'}[form.urgencyDegree] }}</span>
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span class="icon-required">异常日期</span>
            </td>
            <td>
              <a-form-model-item prop="exceptionDate" >
                <a-date-picker v-if="!isDisabled" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" v-model="form.exceptionDate" />
                <span v-else>{{ form.exceptionDate }}</span>
              </a-form-model-item>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>异常信息</h3>
      <table class="custom-table custom-table-border">
        <tbody>
          <tr>
            <td style="width:150px;">
              <span class="icon-required">产品代码</span>
            </td>
            <td>
              <a-form-model-item prop="materialCode">
                <a-input
                  v-if="!isDisabled"
                  read-only="read-only"
                  @click="handlerProductClick"
                  placeholder="选择产品代码"
                  :value="form.materialCode"
                />
                <span v-else>{{form.materialCode}}</span>
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span >产品型号</span>
            </td>
            <td>
              <a-form-model-item >
                <a-input
                  v-if="!isDisabled"
                  read-only="read-only"
                  :value="form.materialType"
                />
                <span v-else>{{form.materialType}}</span>
              </a-form-model-item>
            </td>
          </tr>

            <tr>
            <td style="width:150px;">
              <span class="icon-required">总数量</span>
            </td>
            <td>
              <a-form-model-item prop="sum" >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="form.sum"
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="0"
                />
                <span v-else>{{form.sum}}</span>
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span class="icon-required">异常数量</span>
            </td>
            <td>
              <a-form-model-item prop="exceptionNum" >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="form.exceptionNum"
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="0"
                />
                <span v-else>{{form.exceptionNum}}</span>
              </a-form-model-item>
            </td>
          </tr>

          <tr>
            <td style="width:150px;">
              <span class="icon-required">生产日期</span>
            </td>
            <td colspan="3">
              <a-form-model-item prop="productionDate" >
                <a-date-picker v-if="!isDisabled" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" v-model="form.productionDate" />
                <span v-else>{{form.productionDate}}</span>
              </a-form-model-item>
            </td>
          </tr>

          <tr>
            <td style="width:150px;">
              <span class="icon-required">异常描述</span>
            </td>
            <td colspan="3">
              <a-form-model-item prop="exceptionDescribe" >
                <a-textarea v-if="!isDisabled" placeholder="异常描述" allow-clear autoSize  v-model="form.exceptionDescribe" />
                <span v-else> {{form.exceptionDescribe}}</span>
              </a-form-model-item>
            </td>
          </tr>

          <tr>
            <td style="width:150px;">
              <span >问题凭证</span>
            </td>
            <td colspan="3" style="text-align:left;">
              <p>
                <h3>图片</h3>
                <UploadFile
                  v-if="!isDisabled"
                  key="image"
                  ref="uploadImage"
                  :config="uploadImageConfig"
                  @change="(fileList) => fileChange(fileList,'image')"
                />
                <div v-else>
                  <a-button v-if="form.pictureUrl" @click="handlerImageView">预览图片</a-button>
                  <span v-else>未上传图片</span>
                </div>
              </p>

              <p style="border-top:1px solid #ddd;">
                <h3>视频</h3>
                <UploadFile
                  v-if="!isDisabled"
                  key="vedio"
                  ref="uploadVedio"
                  :config="uploadVedioConfig"
                  @change="(fileList) => fileChange(fileList,'vedio')"
                />
                <div v-else>
                  <a v-if="form.videoUrl" target="blank" :href="form.videoUrl">查看视频</a>
                  <span v-else>未上传视频</span>
                </div>
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
      <ProductModel ref="productModel" @change="productChange" />
      <ImgViewList ref="imgViewList" title="预览凭证"/>

      <p v-if="isAdd || isEdit" style="text-align:center;">
        <a-button key="cancel" @click="() => handleCancel()">取消</a-button>
        <a-button style="margin:0 10px;" key="save" type='primary' :loading="spinning" @click="() => handleSubmit(1)">保存</a-button>
        <a-button key="submit" type='primary' :loading="spinning" @click="() => handleSubmit(2)">提交审批</a-button>
      </p>
    </a-form-model>
  </a-spin>

</template>
<script>
import { getDictionary } from '@/api/common'
import CustomerList from '@/components/CustomerList/CustomerList'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ImgViewList from '@/components/CustomerList/ImgViewList'
import UploadFile from './UploadFile'
import { getcusSelectsListqueryOne } from '@/api/contractListManagement'
import ProductModel from './ProductModel'
import moment from 'moment'

import {
  exceptionReportApproval,
  exceptionReportDetail,
  exceptionReportSaveAndUpdateDispose,
  exceptionReportSaveAndUpdateExceptionReport,
} from '@/api/after-sales-management-custom'

export default {
  name: 'exceptionAddForm',
  components:{
    CustomerList,
    CommonDictionarySelect,
    UploadFile,
    ProductModel,
    ImgViewList
  },
  props:{
    type:{
      type:String,
      default:'add'
    },
    detail:{
      type:Object,
      default: () => {}
    }
  },
  data() {
    let that = this
    let checkExceptionNum = (rule, value, callback) => {
      let sum = that.form.sum
      if(!value){
        callback(new Error('请输入异常数量'));
      }else{
        if(value > sum){
          callback(new Error('异常数量不能大于总数量'));
        }else{
          callback()
        }
      }
    }
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        urgencyDegree:1,
        complaintLevel:1,
        formCustomer:1
      },
      rules: {
        customerName:[
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
        exceptionTypeDicId:[
          { required: true, message: '请选择异常类型', trigger: 'change' }
        ],
        urgencyDegree:[
           { required: true, message: '请选择紧急程度', trigger: 'change' }
        ],
        complaintLevel:[
          { required: true, message: '请选择客诉等级', trigger: 'change' }
        ],
        exceptionDescribe:[
          { required: true, message: '请输入异常描述', trigger: 'change' }
        ],
        productionDate:[
          { required: true, message: '请选择生产日期', trigger: 'change' }
        ],
         exceptionDate:[
          { required: true, message: '请选择异常日期', trigger: 'change' }
        ],
        materialCode:[
          { required: true, message: '请选择产品代码', trigger: 'change' }
        ],
        sum:[
          { required: true, message: '请输入总数量', trigger: 'change' }
        ],
        exceptionNum:[
          { validator:checkExceptionNum, trigger: 'change' }
        ]
      },
      spinning:false,
      visible:false,
      uploadImageConfig: {
        maxFileCount: 3,
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: true,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          attr: {
            icon: 'upload',
            'type':'link'
          }
        }
      },
      uploadVedioConfig: {
        maxFileCount: 1,
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          text: '上传视频',
          attr: {
            icon: 'upload',
            type: 'normal'
          }
        }
      },
    }
  },
  created(){
    this.query()
  },
  watch:{
    detail:{
      handler(){
        this.query()
      },
      immediate:true
    }
  },
  computed: {
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isView(){
      return this.type === 'view'
    },
    isHandle(){
      return this.type === 'handle'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval || this.isHandle
    }
  },
  created() {
    const that = this
  },
  methods: {
    query(){
      const that = this
      if(that.isAdd){
        that.form = {
          urgencyDegree:1,
          complaintLevel:1,
          formCustomer:1
        }
      }else{
        let detail = {...that.detail}
        if(that.isEdit){
          if(detail.exceptionDate){
            detail.exceptionDate = moment(detail.exceptionDate)
          }
          if(detail.productionDate){
            detail.productionDate = moment(detail.productionDate)
          }
        }
        that.form = detail
        that.$nextTick(() => {
          if(detail.pictureUrl){
            let picFiles = detail.pictureUrl.split(',').map(url => {
              return {url }
            })
            that.$refs.uploadImage && that.$refs.uploadImage.setFiles(picFiles)
          }
          if(detail.videoUrl){
            let videoFiles = [{url:detail.videoUrl}]
            that.$refs.uploadVedio && that.$refs.uploadVedio.setFiles(videoFiles)
          }
        })
      }
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel(){
      const that = this
      that.form = {}
      that.visible = false
      that.$emit('finish')
    },
    handlerCustomerClick(){
      this.$refs.customerList && this.$refs.customerList.init()
    },
    async handlerCustomerSelected(record){
      const that = this
      let customerId = record.id
      let customerName = record.name
      let salesmanId = record.userId
      let sales = await getcusSelectsListqueryOne({ id:record.userId }).then(res => {
        return res.data
      }).catch(err => {
        that.$message.error(err)
        return null
      })
      that.form = {
        ...that.form,
        customerId,
        customerName,
        salesmanId,
        salemanName:sales ? sales.trueName : undefined
      }
      // let result = {id:record.id,name:record.name,address:record.address}

    },

    fileChange(fileList,type){
      console.log(arguments)
      if(type === 'image'){
        this.form = {
          ...this.form,
          pictureUrl:fileList.map(f => f.url).join(',')
        }
      }else if(type === 'vedio'){
        this.form = {
          ...this.form,
          videoUrl:fileList.map(f => f.url).join(',')
        }
      }
    },
    handlerProductClick(){
      this.$refs.productModel.query()
    },
    productChange({selectItem,recordParam}){
      this.form = {
        ...this.form,
        materialCode:selectItem.productModel,
        materialType:selectItem.productStandard
      }
    },
    handlerExceptionTypeChange(record){
      this.form = {
        ...this.form,
        exceptionTypeDicId:record.id,
        exceptionTypeName:record.text
      }
    },
    handleSubmit(operationType){
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          that.spinning = true
          let params = {...that.form,operationType}
          params.productionDate = params.productionDate.format('YYYY-MM-DD HH:mm:ss')
          params.exceptionDate = params.exceptionDate.format('YYYY-MM-DD HH:mm:ss')
          exceptionReportSaveAndUpdateExceptionReport(params).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if(res.code === 200){
              that.$emit('finish')
              that.handleCancel()
            }
          }).catch(err => {
            that.spinning = false
            that.$message.error(err)
            that.$emit('finish')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handlerImageView(){
      let pictureUrl = this.form.pictureUrl
      let imgList = pictureUrl.split(',').map(url => decodeURIComponent(url))
      this.$refs.imgViewList.show(imgList)
    }
  }
}
</script>

<style scoped>
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
