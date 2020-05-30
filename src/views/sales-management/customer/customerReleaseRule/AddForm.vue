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
            <td style="width:150px;">规则名称</td>
            <td>
              <a-form-item>
                <a-input v-decorator="['roleName',{rules: [{required: true,message: '输入规则名称'}]}]" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>设定统计周期(月)</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择时间"
                  v-decorator="['periodMonth', { rules: [{ required: true, message: '请选择时间' }] }]"
                >
                  <a-select-option v-for="v in 12" :key="v" :value="v">{{v}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>金额设置(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="['roleMoney', { rules: [{ required: true, message: '请输入金额' }]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>原销售提取限制(天)</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :max="99999"
                  :step="1"
                  v-decorator="['intervalTime', { rules: [{ required: true, message: '请输入原销售提取限制天数' }]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>开始时间(包含)</td>
            <td>
              <a-form-item>
                <a-month-picker 
                  style="width:100%;" 
                  placeholder="开始时间"
                  v-decorator="['startTime',{rules: [{required: true,message: '请输入开始时间'}]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>结束时间(包含)</td>
            <td>
              <a-form-item>
                <a-month-picker 
                  style="width:100%;" 
                  placeholder="结束时间"
                  v-decorator="['endTime',{rules: [{required: true,message: '请输入结束时间'}]}]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-alert message="注：低于金额设置(元) 客户释放到公共客户池 ，开启时间：启用时间，结束时间：暂停使用时间" banner />
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
      return this.isAdd ? '新增' : '修改'
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

          let diff = values.endTime.diff(values.startTime,'months')
          if(diff < 0){
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