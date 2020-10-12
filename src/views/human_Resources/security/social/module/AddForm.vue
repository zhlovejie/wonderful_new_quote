<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>台账年月</td>
            <td colspan="3">
              <a-form-item>
                <a-month-picker
                  style="width: 300px"
                  v-decorator="['accountDate', { rules: [{ required: true, message: '请选择日期！' }] }]"
                />
                <!-- initialValue:moment(), -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>公司缴费金额（元）</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width: 300px"
                  placeholder="输入公司缴费金额"
                  v-decorator="['companyPay', { rules: [{ required: true, message: '请输入公司缴费金额!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>个人缴费金额（元）</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width: 300px"
                  placeholder="输入个人缴费金额"
                  v-decorator="['personalPay', { rules: [{ required: true, message: '请输入个人缴费金额!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>设备文件</td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  style="width: 300px"
                  name="file"
                  :fileList="fileList"
                  :beforeUpload="beforeUpload"
                  @change="handleChange"
                  accept=".xls, .xlsx"
                >
                  <a-button> <a-icon type="upload" />导入 </a-button>
                </a-upload>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>

      <!-- <Approval ref="approval" @opinionChange="opinionChange" /> -->
    </a-spin>
  </a-modal>
</template>
<script>
import { securitySocial_Add, securitySocial_Details } from '@/api/humanResources'
import { getUploadPath2 } from '@/api/common'
import moment from 'moment'

export default {
  name: 'BecomingForm',
  components: {
    // Approval: Approval,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'add',
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      uploadUrl: getUploadPath2(),
      //   上传文件
      fileList: [],
    }
  },
  computed: {
    modalTitle() {
      // if (this.isEditSalary) {
      //   return '社保'
      // }
      let txt = this.isView ? '新增' : '修改'
      return `${txt}社保`
    },
    isView() {
      //查看
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },

    isDisabled() {
      return this.isView || this.isEdit
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_Insurance') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    moment: moment,
    query(type, record) {
      console.log(type, record)
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }

      securitySocial_Details(id).then((res) => {
        that.recordDetails = res.data
        let ress = moment(res.data.accountDate, 'YYYY-MM').valueOf()
        let accountDate = moment(ress).format('YYYY-MM')
        this.form.setFieldsValue({
          accountDate: moment(ress),
          companyPay: res.data.companyPay,
          personalPay: res.data.personalPay,
        })
      })
    },

    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.fileList = this.fileList.slice(-1)
      return false
    },
    handleChange(info) {
      this.fileList = []
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.spinning = true
        that.form.validateFields((err, values) => {
          if (!err) {
            values.accountDate = values.accountDate.format('YYYYMM')
            let formData = new FormData()
            if (that.type !== 'add') {
              formData.append('id', this.record.id)
            }
            formData.append('accountDate', values.accountDate)
            formData.append('companyPay', values.companyPay)
            formData.append('personalPay', values.personalPay)
            formData.append('file', this.fileList[0])

            // console.log(formData.getAll('file'))
            securitySocial_Add(formData)
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
      } else if (that.isEditSalary) {
        // that.updateUserBackCardSalary()
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
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