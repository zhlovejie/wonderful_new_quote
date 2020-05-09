<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
    :confirmLoading="spinning" 
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">申诉人</td>
            <td>
              <a-form-item>
                
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>申诉部门</td>
            <td>
              <a-form-item>
                
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>
              <a-form-item>
                
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>原因</td>
            <td>
              <a-form-item>
                <a-textarea
                  :disabled="isView"
                  placeholder=""
                  :rows="2"
                  v-decorator="['reason', {rules: [{ required: true, message: '输入原因' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>附件</td>
            <td>
              <a-form-item>
                
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  customerReleaseRuleAddOrUpdate
} from '@/api/customerReleaseRule'
import moment from 'moment'
export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      actionType: 'add',
      spinning: false
    }
  },
  computed: {
    modalTitle() {
      let tit = this.isAdd ? '新增' : this.isEdit ? '修改' : '审批'
      return `${tit}申诉单`
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
    }
  },
  methods: {
    moment: moment,
    disabledDate(current) {
      return current && current < this.moment().endOf('day')
    },
    init() {
      let that = this
      return Promise.all([])
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          debugger
          let diff = values.endTime.diff(values.startTime,'months')
          if(diff <= 0){
            that.$message.info('结束时间必须大于开始时间')
            return 
          }

          values.startTime = that.moment(values.startTime).format('YYYY-MM')
          values.endTime = that.moment(values.endTime).format('YYYY-MM')
          //提交
          that.spinning = true
          customerReleaseRuleAddOrUpdate(values)
            .then(res => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch(err => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        return
      }
      //填充数据
      let values = Object.assign({},that.record)
      if(values.startTime){
        values.startTime = that.moment(values.startTime)
      }
      if(values.endTime){
        values.endTime = that.moment(values.endTime)
      }
      that.$nextTick(() => that.form.setFieldsValue(values))
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
.add-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}
</style>