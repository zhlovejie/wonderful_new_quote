<template>
  <a-spin :spinning="spinning">
    <a-form :form="form" class="becoming-form-wrapper">
      <table class="custom-table custom-table-border">
        <h3>基本数据</h3>
        <tr>
          <td class="requiredMark">设备编号</td>
          <td>
            <span v-if="equipment">{{ equipment }}</span>
            <span v-else>系统自动生成</span>
          </td>
          <td class="requiredMark">设备名称</td>
          <td>
            <a-form-item>
              <a-input
                style="width: 100%"
                v-if="!isDisabled"
                placeholder="设备名称"
                v-decorator="['devName', { rules: [{ required: true, message: '请输入设备名称' }] }]"
              />
              <span v-else>{{ record.devName }}</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td class="requiredMark">设备型号</td>
          <td>
            <a-form-item>
              <a-input
                style="width: 100%"
                v-if="!isDisabled"
                placeholder="设备型号"
                v-decorator="['devType', { rules: [{ required: true, message: '请输入设备型号' }] }]"
              />
              <span v-else>{{ record.devType }}</span>
            </a-form-item>
          </td>
          <td class="requiredMark">设备责任人</td>
          <td v-if="!isDisabled">
            <a-form-item style="width: 50%; float: left">
              <a-select
                v-decorator="['devChargeDepartmentId', { rules: [{ required: true, message: '请选择部门' }] }]"
                placeholder="选择部门"
                @change="depChangeHandler"
                allowClear
              >
                <a-select-option v-for="item in department" :key="item.id" :value="item.id">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item style="width: 50%; float: left">
              <a-select
                v-decorator="['devChargeId', { rules: [{ required: true, message: '请选择人员' }] }]"
                placeholder="选择人员"
                allowClear
              >
                <a-select-option v-for="item in userList" :key="item.id" :value="item.id">{{
                  item.trueName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td v-else>
            <span>{{ record.devChargeName }}</span>
          </td>
        </tr>
        <tr>
          <td class="requiredMark">安装位置</td>
          <td v-if="!isDisabled">
            <a-form-item style="width: 50%; float: left">
              <a-select
                v-decorator="['installDicId', { rules: [{ required: true, message: '请选择仓库' }] }]"
                placeholder="选择仓库"
                allowClear
              >
                <a-select-option v-for="item in Warehouse" :key="item.id" :value="item.id">{{
                  item.text
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item style="width: 50%; float: left">
              <a-select
                v-decorator="['installPositionDicId', { rules: [{ required: true, message: '请选择选择仓位' }] }]"
                placeholder="选择仓位"
                allowClear:disabled="isDisabled"
              >
                <a-select-option v-for="item in Position" :key="item.id" :value="item.id">{{
                  item.text
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </td>
          <td v-else>
            <span>{{ record.installPosition }}</span>
          </td>
          <td>仓位说明</td>
          <td>
            <a-form-item>
              <a-textarea
                style="width: 100%"
                v-if="!isDisabled"
                :rows="2"
                v-decorator="['installPositionDesc', { rules: [{ required: false, message: '请输入仓位说明' }] }]"
                :disabled="isDisabled"
                placeholder="仓位说明"
              />
              <span v-else>{{ record.installPositionDesc }}</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>二维码</td>
          <td colspan="3">
            <a-form-item>
              <img v-if="qrcodeUrl" :src="qrcodeUrl" alt="" srcset="" />
              <span v-else>系统自动生成</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td class="requiredMark">设备图片</td>
          <td colspan="3">
            <a-form-item style="margin-left: 350px; margin-top: 10px">
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
      </table>
    </a-form>
    <div style="position: absolute; left: -99999px" class="wuliao-qr-code-wrapper">
      <vue-qr :text="qrText" :size="qrSize" :callback="qrChangeHandler"></vue-qr>
    </div>
  </a-spin>
</template>

<script>
import { queryCode } from '@/api/workBox'
const uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
import moment from 'moment'
import VueQr from 'vue-qr'
import { getUploadPath2 } from '@/api/common'
import { getDevisionManagementList, getUserByDep } from '@/api/systemSetting'
import { customUpload } from '@/api/common'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'product-process-management_mould-management-addForm',
  components: { VueQr },
  data() {
    return {
      equipment: undefined,
      uploadPath: getUploadPath2(), // 上传图片的url
      fileList: [], //凭证
      previewVisible: false,
      previewImage: '',
      actionType: 'view',
      spinning: false,
      detail: {},
      Warehouse: [],
      Position: [],
      department: [],
      record: {},
      userList: [],
      values: {},
      qrText: '',
      qrSize: 150,
      qrcodeUrl: '',
      wuliaoQrUrl: undefined,
      form: this.$form.createForm(this, { name: 'mould-management-addForm' }),
      DepartmentPostValue: null,
      uploadConfig: {
        maxFileCount: 1,
        fileType: 'img',
        enablePreview: true,
      },
    }
  },
  computed: {
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
      return this.isView
    },
  },
  methods: {
    moment,
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
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          if (that.fileList.length === 0) {
            return that.$message.error('请上传设备图片')
          }
          let react = that.Warehouse.find((item) => +item.id === +values.installDicId)
          let reacts = that.Position.find((item) => +item.id === +values.installPositionDicId)
          values.installPosition = react.text + '-' + reacts.text
          let arrUrl = []
          this.fileList.map((itme) => {
            if (itme.response) {
              arrUrl.push(itme.response.data)
            } else {
              arrUrl.push(itme.url)
            }
          })
          values.devPics = arrUrl.toString()
          that.$emit('file', values)
        }
      })
    },

    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.$nextTick(() => (this.visible = false))
    },
    handleCancel1() {
      this.previewVisible = false
    },
    initDepList() {
      //部门  id,departmentName
      return getDevisionManagementList({ parentId: 4, current: 1, size: 200 }).then(
        (res) => (this.department = res.data.records)
      )
    },
    initUserList(depId) {
      //人员 id,trueName
      if (!depId) {
        this.userList = []
        return
      }
      return getUserByDep({ departmentId: depId }).then((res) => (this.userList = res.data))
    },
    depChangeHandler(depId) {
      this.userList = []
      if (!this.isView) {
        this.initUserList(depId)
      }
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.record = record
      that.actionType = type
      if (!that.isAdd) {
        await that.initUserList(record.devChargeDepartmentId)
        that.qrText = record.devNum
        await that.wuliaoQrUrlReady()
        let materialQrCode = that.wuliaoQrUrl
        console.log(that.wuliaoQrUrl)
        if (!materialQrCode) {
          that.$message.info('物料二维码生成失败，请联系管理员。')
          return
        } else {
          this.qrcodeUrl = materialQrCode
        }
      }

      if (!that.isView) {
        await that.initDepList()
        queryCode({ code: 'Warehouse_01' })
          .then((res) => {
            that.Warehouse = res.data
          })
          .catch((err) => (that.loading = false))
        queryCode({ code: 'Position_01' })
          .then((res) => {
            that.Position = res.data
          })
          .catch((err) => (that.loading = false))
      }

      if (!that.isAdd && !that.isView) {
        that.equipment = record.devNum
        let arr = (record.devPics || '').split(',')
        ;(this.fileList = arr.map((item) => {
          return {
            uid: uuid(),
            url: item,
            status: 'done',
            name: '1',
          }
        })),
          this.form.setFieldsValue({
            devName: record.devName,
            devType: record.devType,
            devNum: record.devNum,
            devChargeDepartmentId: record.devChargeDepartmentId,
            devChargeId: record.devChargeId,
            installPositionDicId: record.installPositionDicId,
            installDicId: record.installDicId,
            // changePrice: record.changePrice,
            installPositionDesc: record.installPositionDesc,
          })
      }
    },
    async qrChangeHandler(dataUrl, id) {
      const that = this
      console.log(`qrChangeHandler called`, arguments)
      that.tip = '生成物料二维码...'
      that.spinning = true
      if (dataUrl) {
        let file = await new Promise((resolve) => {
          setTimeout(function () {
            let img = document.querySelector('.wuliao-qr-code-wrapper > img')
            if (!img) {
              resolve(null)
              return
            }
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            canvas.width = that.qrSize
            canvas.height = that.qrSize
            context.clearRect(0, 0, that.qrSize, that.qrSize)
            context.drawImage(img, 0, 0, that.qrSize, that.qrSize)
            let fileType = 'image/png'
            canvas.toBlob(
              (blob) => {
                resolve(new File([blob], 'wuliao_qr.png', { type: fileType }))
              },
              fileType,
              0.92
            )
          }, 150)
        })
        if (file !== null) {
          const formData = new FormData()
          formData.append('file', file)
          let url = await customUpload(formData).then((res) => res.data)
          that.spinning = false
          that.wuliaoQrUrl = url
          return url
        } else {
          that.wuliaoQrUrl = null
          that.spinning = false
          return null
        }
      } else {
        that.spinning = false
        that.wuliaoQrUrl = null
        return null
      }
    },
    wuliaoQrUrlReady() {
      const that = this
      let timer = null
      let t1 = Date.now()
      let max = 1000 * 3
      return new Promise((resolve) => {
        timer = setInterval(function () {
          if (typeof that.wuliaoQrUrl === 'string' && that.wuliaoQrUrl.length > 0) {
            clearInterval(timer)
            resolve(that.wuliaoQrUrl)
          }
          let t2 = Date.now()
          if (t2 - t1 >= max) {
            clearInterval(timer)
            resolve(null)
          }
        }, 250)
      })
    },
  },
}
</script>

<style scoped>
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.product-process-management_mould-management-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.product-process-management_mould-management-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
