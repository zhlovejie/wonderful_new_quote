<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 120px">区域值名称</td>
            <td>
              <a-form-item>
                <a-input
                  v-decorator="['intervalValueName', { rules: [{ required: true, message: '请输入区域值名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">利润值</td>
            <td>
              <a-form-item>
                <a-input-Number
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="3"
                  @change="handleProvince"
                  v-decorator="['profitValue', { rules: [{ required: true, message: '请输入利润值' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>利润系数</td>
            <td>{{ profitCoefficient !== undefined ? profitCoefficient : '自动计算' }}</td>
          </tr>
          <tr>
            <td>提成比率</td>
            <td>{{ commissionRate !== undefined ? commissionRate : '自动计算' }}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  placeholder="备注"
                  :rows="2"
                  v-decorator="['remark', { rules: [{ required: false, message: '备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addAndUpdateIntervalConfig, intervalConfigDetail } from '@/api/productOfferManagement'

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      commissionRate: undefined,
      profitCoefficient: undefined,
    }
  },
  watch: {
    profitCoefficient: {
      handler(newValue, oldValue) {
        //newValue 改变后的数据
        this.commissionRate = newValue === 0 || newValue === undefined ? 0 : (Number(newValue) / 35).toFixed(2)
      },
    },
  },
  computed: {
    modalTitle() {
      let m = {
        add: '新增',
        edit: '修改',
      }
      return `${m[this.actionType]}区间值`
    },

    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
  },
  methods: {
    async handleOk() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          console.log('Received values of form: ', values)
          that.spinning = true
          values.commissionRate = that.commissionRate
          values.profitCoefficient = that.profitCoefficient
          addAndUpdateIntervalConfig(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              console.log(err)
              that.$message.error('操作失败')
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.commissionRate = undefined
      this.profitCoefficient = undefined
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      that.visible = true
      if (that.isEdit) {
        that.fillData()
      }
    },
    handleProvince(val) {
      this.profitCoefficient = val === 0 ? 0 : ((1 - Number(val)) * 100).toFixed(1)
    },
    fillData() {
      let that = this
      console.log(that.record.id)
      intervalConfigDetail({ id: this.record.id }).then((res) => {
        that.form.setFieldsValue({ ...res.data })
        that.commissionRate = res.data.commissionRate
        that.profitCoefficient = res.data.profitCoefficient
      })
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
<style>
.ant-upload-list-picture-card .ant-upload-list-item-info::before {
  left: 0;
}
</style>
<style scoped>
.add-form-wrapper >>> .ant-form-item {
  display: flex;
}
.add-form-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
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

.hide-del-icon >>> .anticon-delete {
  display: none;
}
</style>