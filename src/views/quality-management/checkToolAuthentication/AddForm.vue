<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :width="1000"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="routine-addform-wrapper-baseInnerData"
      >
        <table class="custom-table custom-table-border">
          <tbody>
            <tr>
              <td style="width:150px;">
                <span>检验工具</span>
              </td>
              <td>
                <a-form-model-item prop="parameterTermName">
                  <a-select
                    v-if="isAdd"
                    style="width:200px;"
                    :value="form.parameterTermId"
                    @change="handlerToolsSelect"
                  >
                    <a-select-option
                      v-for="item in parameterTermList"
                      :key="item.id"
                    >
                      {{item.termName}}
                    </a-select-option>
                  </a-select>
                  <span v-else>{{form.parameterTermName}}</span>

                </a-form-model-item>
              </td>

              <td style="width:150px;">
                <span>工具编号</span>
              </td>
              <td>
                <a-form-model-item>
                  <a-input
                    v-if="!isDisabled"
                    v-model="form.code"
                    placeholder="系统生成"
                    disabled="disabled"
                  />
                  <span v-else>{{form.code}}</span>
                </a-form-model-item>
              </td>

            </tr>
            <tr>
              <td style="width:150px;">
                <span>认证周期(月)</span>
              </td>
              <td>
                <a-form-model-item prop="authenticationCycle">
                  <a-input-number
                    v-if="!isDisabled"
                    :disabled="isAuth"
                    v-model="form.authenticationCycle"
                    style="width:100%;"
                    :min="0"
                    :step="1"
                    :precision="0"
                  />
                  <span v-else>{{form.authenticationCycle}}</span>
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span class="icon-required">认证处</span>
              </td>
              <td>
                <a-form-model-item prop="authenticationOffice">
                  <a-select
                    v-if="!isDisabled"
                    v-model="form.authenticationOffice"
                  >
                    <a-select-option :value="0">质监局</a-select-option>
                    <a-select-option :value="1">万德福</a-select-option>
                  </a-select>
                  <span v-else>{{ {0:'质监局',1:'万德福'}[form.authenticationOffice] }}</span>
                </a-form-model-item>
              </td>
            </tr>

            <tr>

              <td style="width:150px;">
                <span class="icon-required">认证结果</span>
              </td>
              <td>
                <a-form-model-item prop="authenticationResult">
                  <a-radio-group
                    v-if="!isDisabled"
                    name="radioGroup"
                    v-model="form.authenticationResult"
                    :default-value="0"
                  >
                    <a-radio :value="0">合格</a-radio>
                    <a-radio :value="1">不合格</a-radio>
                  </a-radio-group>
                  <span v-else>{{ {0:'合格',1:'不合格'}[form.authenticationResult] }}</span>
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span class="icon-required">工具状态</span>
              </td>
              <td>
                <a-form-model-item prop="type">
                  <a-select
                    v-if="!isDisabled"
                    v-model="form.type"
                  >
                    <a-select-option :value="0">正常</a-select-option>
                    <a-select-option :value="1">损坏</a-select-option>
                  </a-select>
                  <span v-else>{{ {0:'正常',1:'损坏'}[form.type] }}</span>
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width:150px;">
                <span class="icon-required">二维码</span>
              </td>
              <td>
                <a-form-model-item>
                  <vue-qr
                    :text="qrText"
                    :size="qrSize"
                  ></vue-qr>
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span class="icon-required">备注</span>
              </td>
              <td colspan="3">
                <a-form-model-item prop="remarks">
                  <a-textarea
                    v-if="!isDisabled"
                    placeholder="备注"
                    allow-clear
                    autoSize
                    v-model="form.remarks"
                  />
                  <span v-else> {{form.remarks}}</span>
                </a-form-model-item>
              </td>

            </tr>
            <tr>
              <td style="width:150px;">
                <span>认证证书</span>
              </td>
              <td
                colspan="3"
                style="text-align:left;"
              >
                <UploadFile
                  v-if="!isDisabled"
                  key="image"
                  ref="uploadImage"
                  :config="uploadImageConfig"
                  @change="(fileList) => fileChange(fileList,'image')"
                />
                <div v-else>
                  <a-button
                    v-if="form.authenticationCertificate"
                    @click="handlerImageView"
                  >预览图片</a-button>
                  <span v-else>未上传图片</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width:150px;">
                <span>附件</span>
              </td>
              <td
                colspan="3"
                style="text-align:left;"
              >
                <UploadFile
                  v-if="!isDisabled"
                  key="file"
                  ref="uploadFiles"
                  :config="uploadVedioConfig"
                  @change="(fileList) => fileChange(fileList,'file')"
                />
                <div v-else>
                  <a-button
                    v-if="form.annexUrl"
                    @click="handleAnnexUrl"
                  >查看附件</a-button>

                  <span v-else>未上传附件</span>
                </div>
              </td>

            </tr>
          </tbody>
        </table>

        <ImgViewList
          ref="imgViewList"
          title="预览凭证"
        />

        <FileViewList
          ref="fileViewList"
          title="查看附件"
        />

        <p
          v-if="isAdd || isEdit || isAuth"
          style="text-align:center;"
        >
          <a-button
            key="cancel"
            @click="() => handleCancel()"
          >取消</a-button>
          <a-button
            v-if="isAdd || isEdit"
            style="margin:0 10px;"
            key="save"
            type='primary'
            :loading="spinning"
            @click="() => handleSubmit(1)"
          >保存</a-button>
          <a-button
            v-if="isAuth"
            style="margin:0 10px;"
            key="save"
            type='primary'
            :loading="spinning"
            @click="() => handleSubmit(2)"
          >认证</a-button>
        </p>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import ImgViewList from '@/components/CustomerList/ImgViewList'
import FileViewList from '@/components/CustomerList/FileViewList'

import UploadFile from './UploadFile'
import moment from 'moment'
import VueQr from 'vue-qr'
import {
  checkToolAuthenticationDetail,
  checkToolAuthenticationAddOrUpdate,
  checkToolAuthentication,
  checkParameterTermList
} from '@/api/qualityManagement'

export default {
  name: 'checkToolAuthenticationAddForm',
  components: {
    UploadFile,
    ImgViewList,
    FileViewList,
    VueQr
  },
  data() {
    const that = this

    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        authenticationOffice: 0,
        authenticationResult: 0,
        type: 0
      },
      rules: {
        parameterTermId: [{ required: true, message: '请选择检验工具', trigger: 'change' }],
        authenticationCycle: [{ required: true, message: '请输入认证周期', trigger: 'change' }]
      },
      spinning: false,
      visible: false,
      type: 'add',
      uploadImageConfig: {
        maxFileCount: 3,
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: true,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          text: '上传证书',
          attr: {
            icon: 'upload',
            type: 'link'
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
          text: '上传附件',
          attr: {
            icon: 'upload',
            type: 'normal'
          }
        }
      },

      qrText: '',
      qrSize: 200,

      parameterTermList: []
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : this.isEdit ? '编辑' : this.isAuth ? '认证' : '查看'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    isAuth() {
      return this.type === 'auth'
    }
  },
  created() {
    const that = this
  },
  methods: {
    async query(type, record) {
      const that = this
      that.form = {
        authenticationOffice: 0,
        authenticationResult: 0,
        type: 0
      }
      that.type = type
      that.qrText = ''
      that.visible = true
      await that.fetchParameterTermList()
      if (that.isAdd) {
      } else {
        that.spinning = true
        let detail = {}
        try {
          await checkToolAuthenticationDetail({ id: record.id }).then(res => {
            that.spinning = false
            detail = res.data
            that.qrText = detail.code
          })
        } catch (err) {
          that.spinning = false
          that.$message.error(err.message)
        }
        that.form = detail
        that.$nextTick(() => {
          if (detail.authenticationCertificate) {
            const picFiles = detail.authenticationCertificate.split(',').map(url => {
              return { url }
            })
            that.$refs.uploadImage && that.$refs.uploadImage.setFiles(picFiles)
          }
          if (detail.annexUrl) {
            const videoFiles = [{ url: detail.annexUrl }]
            that.$refs.uploadFiles && that.$refs.uploadFiles.setFiles(videoFiles)
          }
        })
      }
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      const that = this
      that.form = {}
      that.visible = false
      that.$emit('finish')
    },

    fileChange(fileList, type) {
      console.log(arguments)
      if (type === 'image') {
        this.form = {
          ...this.form,
          authenticationCertificate: fileList.map(f => f.url).join(',')
        }
      } else if (type === 'file') {
        this.form = {
          ...this.form,
          annexUrl: fileList.map(f => f.url).join(',')
        }
      }
    },
    handleSubmit(type) {
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          that.spinning = true
          const params = { ...that.form }
          console.log(params)
          const api = type === 1 ? checkToolAuthenticationAddOrUpdate : checkToolAuthentication
          api(params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error(err)
              that.$emit('finish')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handlerImageView() {
      const pictureUrl = this.form.authenticationCertificate
      const imgList = pictureUrl.split(',').map(url => decodeURIComponent(url))
      this.$refs.imgViewList.show(imgList)
    },
    handleAnnexUrl() {
      debugger
      const pictureUrl = this.form.annexUrl
      const imgList = pictureUrl.split(',').map(url => decodeURIComponent(url))
      this.$refs.fileViewList.show(imgList)
    },

    async fetchParameterTermList() {
      const that = this
      const id = await checkParameterTermList({ termName: '检验工具' })
        .then(res => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data[0].id : null
        })
        .catch(err => {
          return null
        })

      const list = await checkParameterTermList({ parentId: id })
        .then(res => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data : []
        })
        .catch(err => {
          return []
        })
      that.parameterTermList = list
    },

    handlerToolsSelect(val) {
      const target = this.parameterTermList.find(item => item.id === val)
      if (target) {
        this.form = {
          ...this.form,
          parameterTermId: target.id,
          parameterTermName: target.termName
        }
      } else {
        this.form = {
          ...this.form,
          parameterTermId: undefined,
          parameterTermName: undefined
        }
      }
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
