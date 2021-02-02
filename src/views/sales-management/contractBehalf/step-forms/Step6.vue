<template>
  <a-spin :spinning="spinning">
    <div class="content-wrap">
      <div class="top-right clearfix">
        <template v-if="!isView">
          <a-button v-if="contractAttribute === 0" class="fl-r" type="primary" @click="lastSubmit(1)" icon="backward"
            >预览</a-button
          >
          <a-button v-if="contractAttribute === 0" class="fl-r" type="primary" @click="lastSubmit(0)" icon="check"
            >保存</a-button
          >
        </template>
      </div>
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
                v-decorator="['contractDispute', { initialValue: 1 }]"
              >
                <a-radio :value="0">提交仲裁委员会仲裁</a-radio>
                <a-radio :value="1">向甲方所在地人民法院提起诉讼</a-radio>
                <a-radio :value="2">向乙方所在地人民法院提起诉讼</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="签订形式" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-radio-group
                :disabled="this.$parent.routeParams.action === 'see'"
                style="width: 100%"
                @change="signFormSelected"
                v-decorator="['signForm', { initialValue: 0 }]"
              >
                <a-radio :value="0">邮件</a-radio>
                <a-radio :value="1">书面</a-radio>
                <a-radio :value="2">微信</a-radio>
              </a-radio-group>
            </a-form-item>

            <div v-if="parseInt(signForm) === 0">
              <a-form-item
                label="甲方邮箱"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input :disabled="this.$parent.routeParams.action === 'see'" type="text" v-decorator="['emailA']" />
              </a-form-item>
              <a-form-item
                label="乙方邮箱"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input :disabled="this.$parent.routeParams.action === 'see'" type="text" v-decorator="['emailB']" />
              </a-form-item>
            </div>
            <div v-if="parseInt(signForm) === 2">
              <a-form-item
                label="甲方微信号"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input :disabled="this.$parent.routeParams.action === 'see'" type="text" v-decorator="['emailA']" />
              </a-form-item>
              <a-form-item
                label="乙方微信号"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input :disabled="this.$parent.routeParams.action === 'see'" type="text" v-decorator="['emailB']" />
              </a-form-item>
            </div>

            <a-form-item label="鲜章" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-radio-group
                style="width: 100%"
                @change="freshChaperSelected"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="['isNeedFreshChaper', { initialValue: 0 }]"
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
                v-decorator="['isNeedTecArgs', { initialValue: 0 }]"
              >
                <a-radio :value="0">否</a-radio>
                <a-radio :value="1">是</a-radio>
              </a-radio-group>
            </a-form-item>

            <div v-if="parseInt(isNeedTecArgs) === 1">
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
                v-decorator="['wxA', { rules: [{ required: false, message: '微信号' }] }]"
                disabled
              />
            </a-form-item>
            <a-form-item label="电子邮箱" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-input
                type="text"
                v-decorator="['emailA', { rules: [{ required: false, message: '甲方电子邮箱' }] }]"
                disabled
              />
            </a-form-item>
          </div>

          <a-form-item style="text-align: center" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <a-button style="margin-right: 8px" @click="prevStep">上一步</a-button>
            <a-button v-if="contractAttribute == 1" type="primary" @click="nextStep">下一步</a-button>
          </a-form-item>
        </a-form>
        <TecArgsList ref="tecArgsList" @selected="handlerSelected" />
      </div>
    </div>
  </a-spin>
</template>

<script>
import { saveOtherInfo, buildCreateWork, deleteQueryOne, getQueryOne } from '@/api/contractListManagement'
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
      contractAttribute: this.queryonedata.contractAttribute, // 0使用我方合同 1反之
      isTax: this.queryonedata.isTax, // 0含税 1不含税
      loading: false,
      timer: 0,
      id: 0,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      signForm: 0,
      spinning: false,
      isNeedFreshChaper: 0, //是否需要鲜章  0否 1是
      isNeedTecArgs: 0, //是否需要技术参数 0否 1是
      uploadPath: getUploadPath(),
      defaultFileList: [],
      tecArgsUrl: '', //技术参数url
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
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      getQueryOne(params)
        .then((res) => {
          this.queryOneData = res.data
          console.log('这是点击下一步的时候同样请求queryone接口this.queryOneData', this.queryOneData)
          that.contractId = res.data.id
          that.id = res.data.id
          that.form.setFieldsValue({
            contractId: res.data.id,
          })
          let otherInfo = res.data.otherInfo
          if (otherInfo) {
            //回显使用
            try {
              that.requirementSpecification = otherInfo.requirementSpecification || ''
              that.contractDispute = otherInfo.contractDispute || 0
              that.signForm = otherInfo.signForm || 0
              that.emailA = otherInfo.emailA || ''
              that.emailB = otherInfo.emailB || ''
              that.wxA = otherInfo.wxA || ''
              that.isNeedFreshChaper = otherInfo.isNeedFreshChaper
              that.isNeedTecArgs = otherInfo.isNeedTecArgs
              //that.tecArgsUrl = otherInfo.tecArgsUrl
              that.tecArgsUrl = ''
              that.tecArgsUploadUrl = otherInfo.tecArgsUrl

              that.form.setFieldsValue({
                requirementSpecification: otherInfo.requirementSpecification || '',
                contractDispute: otherInfo.contractDispute || 1,
                signForm: otherInfo.signForm || 0,
                emailA: otherInfo.emailA || '',
                emailB: otherInfo.emailB || '',
                wxA: otherInfo.wxA || '',
                isNeedFreshChaper: otherInfo.isNeedFreshChaper,
                isNeedTecArgs: otherInfo.isNeedTecArgs,
              })

              try {
                if (otherInfo.tecArgsUrl && otherInfo.tecArgsUrl.length > 0) {
                  let sfile = otherInfo.tecArgsUrl.split('/')
                  let _fileName = sfile[sfile.length - 1]
                  that.defaultFileList = [
                    {
                      uid: 1,
                      name: _fileName,
                      status: 'done',
                      url: otherInfo.tecArgsUrl,
                    },
                  ]
                  that.tecArgsName = _fileName
                }
              } catch (err) {}
            } catch (err) {}
          } else {
            //新增 使用销售员 对公的 微信号 和 邮箱
            try {
              that.form.setFieldsValue({
                emailA: res.data.saleUser.userInfo.email || '',
                wxA: res.data.saleUser.userInfo.wxNum || '',
              })
              that.emailA = res.data.saleUser.userInfo.email || ''
              that.wxA = res.data.saleUser.userInfo.wxNum || ''
            } catch (err) {}
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    contractDisputeSelected(event) {
      console.log('合同争议的解决方式---下拉', event.target.value)
      this.contractDispute = event.target.value
    },
    signFormSelected(event) {
      console.log('签订形式---下拉', event.target.value)
      this.signForm = event.target.value
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
      if (this.isNeedTecArgs === 1) {
        if (this.tecArgsUrl.length === 0 && this.tecArgsUploadUrl.length === 0) {
          that.$message.error('请选择技术参数或上传技术参数文件！')
          return
        }
        if (this.tecArgsUrl.length > 0 && this.tecArgsUploadUrl.length > 0) {
          that.$message.error('技术参数/上传技术参数只能选择一个!')
          return
        }
      }

      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            additionalTreaty: values.additionalTreaty,
            requirementSpecification: values.requirementSpecification,
            contractDispute: values.contractDispute,
            signForm: values.signForm,
            // emailA:that.queryonedata.saleUser.email,
            emailA: values.emailA,
            emailB: values.emailB,
            // wxA:that.queryonedata.saleUser.wxNum,
            wxA: values.wxA,
            isNeedFreshChaper: values.isNeedFreshChaper,
            isNeedTecArgs: values.isNeedTecArgs,
            tecArgsUrl: that.tecArgsUrl || that.tecArgsUploadUrl,
          }

          if (that.$parent.routeParams.action === 'add') {
            console.log('新增模式 添加参数 contractModifyFlag：0')
            params.contractModifyFlag = 0
          } else if (that.$parent.routeParams.action === 'edit') {
            console.log('修改模式 添加参数 contractModifyFlag：1')
            params.contractModifyFlag = 1
          } else if (that.$parent.routeParams.action === 'split') {
            console.log('拆分模式 添加参数 contractModifyFlag：3')
            params.contractModifyFlag = 3
          }

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveOtherInfo(params)
            .then((res) => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              that.loading = false
              // that.form.setFieldsValue({
              //   contractNum: res.data.contractNum
              // })
              if (status != 1) {
                that.$emit('nextStep', { ...res.data })
              } else {
                that.$message.success('保存成功')
              }
              //that.$emit('nextStep', { ...res.data })
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    // 上一步
    prevStep() {
      const id = this.id
      this.$emit('prevStep', id)
    },
    // 点击提交
    lastSubmit(__actionMode = 0) {
      //debugger
      const that = this

      const {
        form: { validateFields },
      } = this
      console.log('{ form: { validateFields } } = this', this)

      //勾选了添加技术参数，但是没选择 也没上传文件 提示
      if (this.isNeedTecArgs === 1) {
        if (this.tecArgsUrl.length === 0 && this.tecArgsUploadUrl.length === 0) {
          that.$message.error('请选择技术参数或上传技术参数文件！')
          return
        }
        if (this.tecArgsUrl.length > 0 && this.tecArgsUploadUrl.length > 0) {
          that.$message.error('技术参数/上传技术参数只能选择一个!')
          return
        }
      }

      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            additionalTreaty: values.additionalTreaty,
            requirementSpecification: values.requirementSpecification,
            contractDispute: values.contractDispute,
            signForm: values.signForm,
            // emailA:that.queryonedata.saleUser.email,
            emailA: values.emailA,
            emailB: values.emailB,
            // wxA:that.queryonedata.saleUser.wxNum,
            wxA: values.wxA,
            isNeedFreshChaper: values.isNeedFreshChaper,
            isNeedTecArgs: values.isNeedTecArgs,
            tecArgsUrl: that.tecArgsUrl || that.tecArgsUploadUrl,
          }

          if (that.$parent.routeParams.action === 'add') {
            console.log('新增模式 添加参数 contractModifyFlag：0')
            params.contractModifyFlag = 0
          } else if (that.$parent.routeParams.action === 'edit') {
            console.log('修改模式 添加参数 contractModifyFlag：1')
            params.contractModifyFlag = 1
          } else if (that.$parent.routeParams.action === 'split') {
            console.log('拆分模式 添加参数 contractModifyFlag：3')
            params.contractModifyFlag = 3
          }
          console.log(params)

          that.spinning = true
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveOtherInfo(params)
            .then((res) => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              that.loading = false

              //完结提交标志
              that.$parent.__isFinished = true

              // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
              buildCreateWork({ id: that.queryonedata.id })
                .then((res) => {
                  console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
                  that.spinning = false
                  if (__actionMode === 0) {
                    //提交 跳转
                    that.$router.push({ name: that.$parent.routeParams.from, params: { ...this.$parent.routeParams } })
                  } else {
                    //预览跳转
                    let id = that.queryonedata.id
                    if (that.queryonedata.contractAttribute === 1) {
                      // 选择三方合同
                      that.$router.push({
                        name: 'previewTripartiteContract',
                        params: { queryOneData: that.queryonedata, action: 'edit' },
                      })
                    } else {
                      if (that.queryonedata.isTax === 1) {
                        // 含税--选择销售合同
                        that.$router.push({
                          name: 'previewSalesContract',
                          params: { queryOneData: that.queryonedata, action: 'edit' },
                        })
                      } else {
                        that.$router.push({
                          name: 'previewProductOrderForm',
                          params: { queryOneData: that.queryonedata, action: 'edit' },
                        })
                      }
                    }
                  }
                })
                .catch((error) => {
                  console.error(error)
                  that.spinning = false
                })

              //that.$router.push({ name: 'distributionContractList' }) // 提交之后跳转到销售合同列表页
              // that.$nextTick(() =>{
              //   that.$router.push({ name: that.$parent.routeParams.from })
              // })
            })
            .catch((error) => {
              console.error(error)
              that.spinning = false
            })
        } else {
          that.spinning = false
        }
      })
    },
    // 预览
    prevView() {
      const that = this
      const {
        form: { validateFields },
      } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            additionalTreaty: values.additionalTreaty,
            requirementSpecification: values.requirementSpecification,
            contractDispute: values.contractDispute,
            signForm: values.signForm,
            emailA: values.emailA,
            emailB: values.emailB,
            wxA: values.wxA,
          }

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveOtherInfo(params)
            .then((res) => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              that.loading = false
              const id = that.queryonedata.id
              // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
              const paramsc = {
                id: that.queryonedata.id,
              }
              buildCreateWork(paramsc)
                .then((res) => {
                  console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
                })
                .catch((error) => {
                  console.error(error)
                })
              if (that.contractAttribute === 1) {
                // 选择三方合同
                that.$router.push({ name: 'previewTripartiteContract', params: { id: id } })
              } else {
                if (that.isTax === 0) {
                  // 含税--选择销售合同
                  that.$router.push({ name: 'previewSalesContract', params: { queryOneData: this.queryonedata } })
                } else {
                  that.$router.push({ name: 'previewProductOrderForm', params: { id: id } })
                }
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    tecArgsSelected(e) {
      this.isNeedTecArgs = e.target.value
    },
    freshChaperSelected(e) {
      this.isNeedFreshChaper = parseInt(e.target.value)
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
      this.tecArgsUrl = record.fileUrl
    },
    handleClear() {
      this.tecArgsName = ''
      this.tecArgsUrl = ''
    },
    beforeUpload(file) {
      if (this.tecArgsUrl.length > 0) {
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
