<template>
  <a-spin :spinning="spinning">
    <div class="content-wrap">
      <div class="contact-steps-6-otherinfo-wrapper">
        <a-row>
          <a-col :span="24" class="basic-tit" justify="center" align="middle">其他信息</a-col>
        </a-row>
        <a-form :form="form" @submit="handleSubmit">
          <div class="from-group">
            <a-form-item
              label="需方产品特殊要求说明"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-textarea
                type="text"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="[
                  'requirementSpecification',
                  { rules: [{ required: false, message: '需方产品特殊要求说明' }] },
                ]"
              />
            </a-form-item>

            <a-form-item
              label="合同争议的解决方式"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-radio-group
                @change="contractDisputeSelected"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="['solveDispute', { initialValue: 2 }]"
              >
                <a-radio :value="1">提交仲裁委员会仲裁</a-radio>
                <a-radio :value="2">向甲方所在地人民法院提起诉讼</a-radio>
                <a-radio :value="3">向乙方所在地人民法院提起诉讼</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="签订形式" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-radio-group
                :disabled="this.$parent.routeParams.action === 'see'"
                style="width: 100%"
                @change="signFormSelected"
                v-decorator="['signType', { initialValue: 1 }]"
              >
                <a-radio :value="1">邮件</a-radio>
                <a-radio :value="2">书面</a-radio>
                <a-radio :value="3">微信</a-radio>
              </a-radio-group>
            </a-form-item>

            <div v-if="parseInt(signType) === 1">
              <a-form-item
                label="甲方邮箱"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input :disabled="this.$parent.routeParams.action === 'see'" type="text" v-decorator="['ourEmail']" />
              </a-form-item>
              <a-form-item
                label="乙方邮箱"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  :disabled="this.$parent.routeParams.action === 'see'"
                  type="text"
                  v-decorator="['customerEmail']"
                />
              </a-form-item>
            </div>
            <div v-if="parseInt(signType) === 3">
              <a-form-item
                label="甲方微信号"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input :disabled="this.$parent.routeParams.action === 'see'" type="text" v-decorator="['ourWxNum']" />
              </a-form-item>
              <a-form-item
                label="乙方微信号"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  :disabled="this.$parent.routeParams.action === 'see'"
                  type="text"
                  v-decorator="['customerWxNum']"
                />
              </a-form-item>
            </div>

            <a-form-item label="鲜章" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-radio-group
                style="width: 100%"
                @change="freshChaperSelected"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="['needSignet', { initialValue: 0 }]"
              >
                <a-radio :value="0">不要</a-radio>
                <a-radio :value="1">要</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item
              label="添加技术参数"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-radio-group
                :disabled="this.$parent.routeParams.action === 'see'"
                style="width: 100%"
                @change="tecArgsSelected"
                v-decorator="['needParameter', { initialValue: 0 }]"
              >
                <a-radio :value="0">否</a-radio>
                <a-radio :value="1">是</a-radio>
              </a-radio-group>
            </a-form-item>

            <div v-if="parseInt(needParameter) === 1">
              <a-form-item
                label="选择技术参数"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input read-only @click="openTecArgsModel" v-model="tecArgsName">
                  <a-tooltip slot="suffix" title="清空" v-if="tecArgsName.length > 0">
                    <a-icon type="close-circle" @click="handleClear" />
                  </a-tooltip>
                </a-input>
              </a-form-item>

              <a-form-item
                label="上传技术参数"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-upload
                  name="files"
                  :accept="aceptFileTypes.join(',')"
                  :action="uploadPath"
                  :fileList="defaultFileList"
                  @change="uploadFileChangeHandler"
                  :beforeUpload="beforeUpload"
                >
                  <a-button> <a-icon type="upload" />点击上传技术参数 </a-button>
                </a-upload>
              </a-form-item>
              <div style="color: red">选择技术参数/上传技术参数只能选择一个</div>
            </div>
          </div>

          <div class="from-group">
            <h3>甲方信息</h3>
            <a-form-item label="微信号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-input
                type="text"
                v-decorator="['ourWxNum', { rules: [{ required: false, message: '微信号' }] }]"
                disabled
              />
            </a-form-item>
            <a-form-item label="电子邮箱" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-input
                type="text"
                v-decorator="['ourEmail', { rules: [{ required: false, message: '甲方电子邮箱' }] }]"
                disabled
              />
            </a-form-item>
          </div>

          <a-form-item style="text-align: center" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <a-button style="margin-right: 8px" @click="prevStep">上一步</a-button>
            <a-button type="primary" @click="nextStep">下一步</a-button>
          </a-form-item>
        </a-form>
        <TecArgsList ref="tecArgsList" @selected="handlerSelected" />
      </div>
    </div>
  </a-spin>
</template>

<script>
import { mobilesId } from '@/api/contractListManagement'
import { getUploadPath, getDictionary, getUeditorUploadPath } from '@/api/common'
import TecArgsList from '@/components/CustomerList/TecArgsList.vue'
export default {
  name: 'Step6',
  components: {
    TecArgsList,
  },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      // form
      form: this.$form.createForm(this),
      contractAttribute: 1, // 使用第三方合同
      loading: false,
      timer: 0,
      id: 0,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      signType: 1,
      spinning: false,
      ourEmail: undefined, //甲方邮箱
      ourWxNum: undefined, //甲方微信
      needSignet: 0, //是否需要鲜章  0否 1是
      needParameter: 0, //是否需要技术参数 0否 1是
      uploadPath: getUploadPath(),
      defaultFileList: [],
      parameterUrl: '', //技术参数url
      tecArgsName: '', //技术参数名称
      tecArgsUploadUrl: '', //技术参数上传参数URL
      aceptFileTypes: [
        '.doc',
        '.docx',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    }
  },
  computed: {
    signFormTxt: function () {},
    isView() {
      //新增
      return this.$parent.routeParams.action === 'see'
    },
  },
  watch: {
    $route(to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    },
  },
  created() {},
  mounted() {
    this.spinning = false
    this.init()
  },
  methods: {
    init() {
      const that = this
      if (that.queryonedata && that.queryonedata.purchaseContractSaveBo) {
        let react = that.queryonedata.purchaseContractSaveBo
        mobilesId({ userId: react.userId }).then((res) => {
          console.log(res.data)
          that.ourEmail = res.data.email
          that.ourWxNum = res.data.wxNum
          that.form.setFieldsValue({
            ourEmail: res.data.email,
            ourWxNum: res.data.wxNum,
          })
        })
      }

      if (that.queryonedata && that.queryonedata.purchaseContractInfoSaveBo) {
        let react = that.queryonedata.purchaseContractInfoSaveBo
        that.signType = react.signType || 1
        that.needParameter = react.needParameter
        that.form.setFieldsValue({
          requirementSpecification: react.requirementSpecification,
          solveDispute: react.solveDispute,
          signType: react.signType,
          customerEmail: react.customerEmail,
          customerWxNum: react.customerWxNum,
          needSignet: react.needSignet,
          needParameter: react.needParameter,
          // parameterUrl: that.parameterUrl || that.tecArgsUploadUrl,
        })
        that.parameterUrl = ''
        that.tecArgsUploadUrl = react.parameterUrl
        if (react.parameterUrl && react.parameterUrl.length > 0) {
          let sfile = react.parameterUrl.split('/')
          let _fileName = sfile[sfile.length - 1]
          that.defaultFileList = [
            {
              uid: 1,
              name: _fileName,
              status: 'done',
              url: react.parameterUrl,
            },
          ]
          that.tecArgsName = _fileName
        }
      }
    },
    contractDisputeSelected(event) {
      console.log('合同争议的解决方式---下拉', event.target.value)
      this.solveDispute = event.target.value
    },
    signFormSelected(event) {
      console.log('签订形式---下拉', event.target.value)
      this.signType = event.target.value
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      if (that.$parent.routeParams.action === 'see') {
        return that.$emit('nextStep', { ...that.queryonedata })
      }
      const {
        form: { validateFields },
      } = this
      console.log('{ form: { validateFields } } = this', this)

      //勾选了添加技术参数，但是没选择 也没上传文件 提示
      if (this.needParameter === 1) {
        if (this.parameterUrl.length === 0 && this.tecArgsUploadUrl.length === 0) {
          that.$message.error('请选择技术参数或上传技术参数文件！')
          return
        }
        if (this.parameterUrl.length > 0 && this.tecArgsUploadUrl.length > 0) {
          that.$message.error('技术参数/上传技术参数只能选择一个!')
          return
        }
      }

      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            requirementSpecification: values.requirementSpecification,
            solveDispute: values.solveDispute,
            signType: values.signType,
            ourEmail: that.ourEmail,
            customerEmail: values.customerEmail,
            ourWxNum: that.ourWxNum,
            customerWxNum: values.customerWxNum,
            needSignet: values.needSignet,
            needParameter: values.needParameter,
            parameterUrl: that.parameterUrl || that.tecArgsUploadUrl,
          }
          let arr = {
            purchaseContractInfoSaveBo: params,
          }
          that.$emit('nextStep', { ...arr })
          console.log(params)
          // if (that.$parent.routeParams.action === 'add') {
          //   console.log('新增模式 添加参数 contractModifyFlag：0')
          //   params.contractModifyFlag = 0
          // } else if (that.$parent.routeParams.action === 'edit') {
          //   console.log('修改模式 添加参数 contractModifyFlag：1')
          //   params.contractModifyFlag = 1
          // } else if (that.$parent.routeParams.action === 'split') {
          //   console.log('拆分模式 添加参数 contractModifyFlag：3')
          //   params.contractModifyFlag = 3
          // }

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          // saveOtherInfo(params)
          //   .then((res) => {
          //     console.log('校验成功，保存填写的信息，请求后端接口结果', res)
          //     that.id = res.data.id
          //     that.loading = false
          //     // that.form.setFieldsValue({
          //     //   contractNum: res.data.contractNum
          //     // })
          //     if (status != 1) {

          //     } else {
          //       that.$message.success('保存成功')
          //     }
          //     //that.$emit('nextStep', { ...res.data })
          //   })
          //   .catch((error) => {
          //     console.error(error)
          //   })
        }
      })
    },
    // 上一步
    prevStep() {
      const id = this.id
      this.$emit('prevStep', id)
    },
    tecArgsSelected(e) {
      this.needParameter = e.target.value
    },
    freshChaperSelected(e) {
      this.needSignet = parseInt(e.target.value)
    },
    uploadFileChangeHandler({ file, fileList }) {
      // 上传中、完成、失败都会调用这个函数。
      console.log(file, fileList)
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          // 成功
          this.tecArgsUploadUrl = file.response.data[0].url
        }
      }

      if (file.status === 'removed') {
        // 删除清空
        this.tecArgsUploadUrl = ''
      }

      // 展示照片墙
      this.defaultFileList = fileList
        .map((item) => {
          let _uid = -Date.now()
          item.uid = item.uid || _uid
          if (item.originFileObj) {
            item.originFileObj.uid = item.originFileObj.uid || _uid
          }
          return item
        })
        .filter((item) => !!item.status)
    },
    openTecArgsModel() {
      this.$refs.tecArgsList.init()
    },
    handlerSelected(record) {
      if (this.tecArgsUploadUrl.length > 0) {
        this.$message.error('技术参数/上传技术参数只能选择一个!')
        return
      }
      this.tecArgsName = record.fileName
      this.parameterUrl = record.fileUrl
    },
    handleClear() {
      this.tecArgsName = ''
      this.parameterUrl = ''
    },
    beforeUpload(file) {
      if (this.parameterUrl.length > 0) {
        this.$message.error('技术参数/上传技术参数只能选择一个!')
        return false
      }
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.doc,.docx的word文档!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('word文档必须小于10M!')
      }
      return isDocType && isLt10M
    },
  },
}
</script>

<style scoped>
.from-group {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 20px;
}
.wdf-row {
  border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}
.btns-grop button:not(first-child) {
  margin-left: 12px;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
}

.contact-steps-6-otherinfo-wrapper >>> .ant-form-item-label {
  text-align: left;
}
</style>
