<template>
  <a-modal :title="modalTitle" :width="500" :visible="visible" @cancel="handleCancel" :maskClosable="false">
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>客户名称</td>
            <td colspan="2">
              <a-form-item>
                <a-select placeholder="延迟方式" v-decorator="['delayType', { initialValue: 0 }]" @change="typeChange">
                  <a-select-option :value="0">单个客户</a-select-option>
                  <a-select-option :value="1">全部客户</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="view">
            <td>客户名称</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  class="a-input"
                  title="选择客户名称"
                  read-only
                  placeholder="选择客户名称"
                  @click="handleCustomerClick"
                  v-decorator="['customerName', { rules: [{ required: true, message: '选择客户名称' }] }]"
                />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['customerId']" />
              </a-form-item>
            </td>
          </tr>
          <tr v-if="view">
            <td>对应销售</td>
            <td colspan="2">
              <a-form-item>
                <a-input v-decorator="['saleUserName']" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['saleUserId']" />
              </a-form-item>
            </td>
          </tr>
          <tr v-if="view">
            <td>联系倒计时</td>
            <td colspan="2">
              <a-form-item>
                <a-input v-decorator="['linkCountDown']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>延时天数</td>
            <td colspan="2">
              <a-form-item>
                <a-input v-decorator="['delayDayNum']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="2">
              <a-form-item>
                <a-textarea v-decorator="['remark']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>添加凭证</td>
            <td colspan="2">
              <a-form-item>
                <a-upload
                  :action="uploadUrl"
                  accept=".png, .jpg"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 3">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">凭证</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
    <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
  </a-modal>
</template>

<script>
import { saveDelayRecord, getSaleInfo } from '@/api/customer/saleCustomerDelayRecord'
import { getUploadPath2 } from '@/api/common'
import moment from 'moment'
import CustomerList from '@/components/CustomerList/CustomerList'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'AddCustomerDelayRecord',
  components: {
    CustomerList,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'AddCustomerDelayRecord' }),
      uploadUrl: getUploadPath2(),
      visible: false,
      spinning: false,
      customerId: 0, // 客户id
      customerName: '',
      saleUserId: null,
      saleUserName: '',
      linkCountDown: '',
      view: true,
      delayType: 0,
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  },
  computed: {
    modalTitle() {
      return '新增客户延时'
    },
  },
  methods: {
    moment: moment,
    handleCancel() {
      this.previewVisible = false
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

    async handleOk() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          //提交
          values.evidenceUrl = this.fileList
            .map((item) => {
              return item.response.data
            })
            .toString()
          that.spinning = true
          saveDelayRecord(values)
            .then((res) => {
              that.spinning = false
              console.log(res)
              if (res.code === 200) {
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              } else {
                that.$message.info(res.msg)
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    async query(type, record) {
      let that = this
         that.fileList = []
      that.form.resetFields()
      that.visible = true
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    typeChange(key) {
      if (key === 1) {
        this.$nextTick(() => (this.view = false))
        this.form.setFieldsValue({
          delayType: key,
          saleUserId: null,
          customerId: 0,
          saleUserName: '',
          customerName: '',
          linkCountDown: '',
        })
      } else {
        this.$nextTick(() => (this.view = true))
        this.form.setFieldsValue({
          view: true,
          delayType: key,
        })
      }
    },
    handleCustomerClick() {
      this.$refs.customerList.init({ userId: this.saleUserId })
    },
    handlerCustomerSelected(record) {
      this.form.setFieldsValue({
        customerName: record.name,
      })
      if (record.id !== 0) {
        this.form.setFieldsValue({
          customerId: record.id,
        })
        this.customerId = record.id
      }
      const params = { customerId: this.customerId }
      getSaleInfo(params).then((res) => {
        if (res.code === 200) {
          this.form.setFieldsValue({
            saleUserId: res.data.saleUserId,
            saleUserName: res.data.saleUserName,
            linkCountDown: res.data.linkCountDown,
          })
        } else {
          this.$message.info(res.msg)
        }
      })
    },
  },
}
</script>

<style scoped>
.adjust-apply-list-wrapper .search-wrapper * {
  margin: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}
</style>
