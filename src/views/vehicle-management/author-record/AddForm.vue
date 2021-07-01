<template>
  <a-modal :title="modalTitle" :width="800" :visible="visible" @cancel="handleCancel" :maskClosable="false">
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
          <a-input v-decorator="['instanceId', { initialValue: detail.instanceId }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>姓名</td>
            <td colspan="3">
              <template v-if="this.actionType === 'add'">
                {{ userInfo.trueName }} —— {{ userInfo.departmentName }}
              </template>
              <template v-else> {{ detail.userName }} —— {{ detail.departmentName }} </template>
            </td>
          </tr>

          <tr>
            <td style="width: 120px">手机号</td>
            <td style="width: 300px">
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="手机号"
                  v-decorator="[
                    'mobile',
                    { initialValue: detail.mobile, rules: [{ required: true, message: '请输入手机号' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                />
                <span v-else>{{ detail.mobile }}</span>
              </a-form-item>
            </td>
            <td style="width: 120px">持证类别</td>
            <td style="width: 300px">
              <a-form-item>
                <span v-if="isDisabled">{{ detail.licenseTypeDicText }}</span>
                <a-select
                  v-else
                  placeholder="持证类别"
                  v-decorator="[
                    'licenseTypeDicId',
                    { initialValue: detail.licenseTypeDicId, rules: [{ required: true, message: '选择持证类别' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                >
                  <a-select-option v-for="item in cardCategoryList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>驾龄(年)</td>
            <td>
              <a-form-item>
                <span v-if="isDisabled">{{ detail.driverAge }}</span>
                <a-input-number
                  v-else
                  placeholder="驾龄"
                  style="width: 100%"
                  :min="0"
                  :max="99"
                  :step="1"
                  v-decorator="[
                    'driverAge',
                    { initialValue: detail.driverAge, rules: [{ required: true, message: '输入驾龄' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td style="width: 120px">驾驶资格</td>
            <td style="width: 300px">
              <a-form-item>
                <span v-if="isDisabled">{{ detail.qualificationDicText }}</span>
                <a-select
                  v-else
                  placeholder="驾驶资格"
                  v-decorator="[
                    'qualificationDicId',
                    { initialValue: detail.qualificationDicId, rules: [{ required: true, message: '选择驾驶资格' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                >
                  <a-select-option v-for="item in driveQualificationsList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>驾驶证上传</td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  key=""
                  :disabled="isDisabled"
                  :action="uploadPath"
                  accept=".png, .jpg"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 3">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel1">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>原因</td>
            <td colspan="3" style="text-align: left">
              <a-form-item>
                <div v-if="isDisabled" v-html="formatHTML(detail.remark)" />
                <a-textarea
                  v-else
                  placeholder
                  :rows="2"
                  v-decorator="[
                    'remark',
                    { initialValue: detail.remark, rules: [{ required: true, message: '请输入原因' }] },
                  ]"
                  style="width: 100%"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getDictionary } from '@/api/common'
import { driverAuthorityDetail, driverAuthorityApproval, driverAuthorityAddOrUpdate } from '@/api/vehicleManagement'
import Approval from './Approval'
import { getUploadPath2 } from '@/api/common'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import moment from 'moment'
const uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'AddForm',
  components: {
    Approval,
    DepUserSelect,
  },
  data() {
    return {
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      uploadPath: getUploadPath2(), // 上传图片的url
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      actionType: 'add',
      record: {},
      spinning: false,
      detail: {},
      cardCategoryList: [],
      driveQualificationsList: [],
      userInfo: this.$store.getters.userInfo,
    }
  },
  computed: {
    modalTitle() {
      let tit = this.isAdd ? '新增' : this.isView ? '查看' : '审批'
      return `${tit}驾驶权限`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let queue = []
      let task2 = getDictionary({ text: '驾照类别' }).then((res) => (that.cardCategoryList = res.data))
      queue.push(task2)
      let task1 = getDictionary({ text: '驾驶资格' }).then((res) => (that.driveQualificationsList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    handleCancel1() {
      this.previewVisible = false
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }

      that.form.validateFields((err, values) => {
        if (!err) {
          if (this.actionType === 'add') {
            values.departmentId = this.userInfo.departmentId
            values.userId = this.userInfo.id
          }
          if (that.fileList.length === 0) {
            return that.$message.error('请上传设备图片')
          }
          let _values = {
            ...values,
            ...that.detail,
          }
          let arrUrl = []
          this.fileList.map((itme) => {
            if (itme.response) {
              arrUrl.push(itme.response.data)
            } else {
              arrUrl.push(itme.url)
            }
          })
          _values.licenseUrl = arrUrl.toString()
          console.log(_values)
          //提交
          that.spinning = true
          driverAuthorityAddOrUpdate(_values)
            .then((res) => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.fileList = []
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.detail = {}
      that.fileList = []
      that.form.resetFields()
      await that.init()
      that.visible = true

      if (!that.isAdd) {
        driverAuthorityDetail({ id: that.record.id }).then((res) => {
          that.detail = { ...res.data }
          debugger
          let arr = (res.data.licenseUrl || '').split(',')
          that.fileList = arr.map((item) => {
            return {
              uid: uuid(),
              url: item,
              status: 'done',
              name: '1',
            }
          })
        })
      }
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      driverAuthorityApproval(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    depUserChange(depId, userId, dep, user) {
      this.form.setFieldsValue({
        departmentId: depId,
        userId: userId,
        //mobile: user ? (user.mobile || '') : ''
      })
      if (user && user.mobile) {
        this.form.setFieldsValue({
          mobile: user.mobile,
        })
      }
    },
    formatHTML(htmlStr) {
      if (typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g, '<br/>')
      htmlStr = htmlStr.replace(/\s+/g, '&nbsp;')
      return htmlStr
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>