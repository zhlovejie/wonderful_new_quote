<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :class="{'ant-modal_no_footer':isView}"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button
          key="submit"
          type="primary"
          icon="check"
          :loading="spinning"
          @click="passAction"
        >通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['instanceId',{initialValue:detail.instanceId}]" />
        </a-form-item>

        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">编号</td>
            <td style="width:280px;">
              <span v-if="!isDisabled" style="color:#999;">系统自动生成</span>
              <span v-else>{{detail.isNum}}</span>
            </td>
            <td style="width:150px;">部门</td>
            <td style="width:210px;">{{detail.departmentName || userInfo.departmentName}}</td>
          </tr>
          <tr>
            <td>岗位</td>
            <td>{{detail.stationName || userInfo.stationName}}</td>
            <td>姓名</td>
            <td>{{detail.createdName || userInfo.trueName}}</td>
          </tr>

          <tr>
            <td>代班时间</td>
            <td>
              <a-form-item>
                <a-range-picker 
                  v-if="!isDisabled"
                  style="width:100%;" 
                  :allowClear="true" 
                  @change="sDateChange"
                  v-decorator="[`sDate`,{initialValue:detail.sDate,rules: [{required: true,message: '请选择代班时间'}]}]"
                />
                <span v-else>{{detail.sDateTxt}}</span>
              </a-form-item>
            </td>
            <td>时长</td>
            <td colspan="3">
              <a-form-item>
                {{days+'天'}}
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>代班原因</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="申请原因"
                  :rows="2"
                  v-decorator="[
                    'reason',
                    { initialValue: detail.reason, rules: [{ required: true, message: '请输入申请原因' }] },
                  ]"
                />
                <span v-else>{{ detail.reason }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="[
                    'remark',
                    { initialValue: detail.remark, rules: [{ required: false, message: '请输入备注' }] },
                  ]"
                />
                <span v-else>{{ detail.remark }}</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>

    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>
<script>

import {
  SelinaApplyAddOrUpdate,
  SelinaApplyApproval,
} from '@/api/salaryManagement'
import Approval from './Approval'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'addForm',
  components: { Approval },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      days:0
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${obj[this.actionType]}`
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
  watch: {},
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async query(type, record) {
      //debugger
      let that = this
      await that.form.resetFields()
      that.actionType = type
      that.record = Object.assign({}, record)
      that.detail = {}
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      let sDate = [undefined,undefined]
      let sDateTxt = ''
      let {beginDate,endDate} = that.record
      if(beginDate && endDate){
        sDate = [moment(beginDate),moment(endDate)]
        sDateTxt = `${beginDate} ~ ${endDate}`
      }
      that.detail = { ...that.record ,sDate,sDateTxt}
      that.sDateChange(sDate)
    },
    sDateChange(arr){
      let that = this
      if(Array.isArray(arr) && arr.length === 2 && arr[0] instanceof moment && arr[1] instanceof moment){
        //debugger
        let isInOneMonths = arr[1].diff(arr[0],'months') === 0
        if(!isInOneMonths){
          that.$message.info('代班开始时间和结束时间必须在同一个月内')
          that.days = 0
          that.$nextTick(() => that.form.setFieldsValue({sDate:undefined}))
          return
        }
        that.days = arr[1].diff(arr[0],'days')
      }else{
        that.days = 0
      }
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.beginDate = values.sDate[0].format('YYYY-MM-DD')
          values.endDate = values.sDate[1].format('YYYY-MM-DD')
          values.days = that.days
          values.createdId = that.userInfo.id
          if (that.isEdit) {
            values.id = that.record.id
          }
          console.log('Received values of form: ', values)
          
          that.spinning = true
          SelinaApplyAddOrUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      SelinaApplyApproval(values)
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
  },
}
</script>
<style>
.ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.custom-table >>> .custom-table {
  margin-bottom: 0;
  margin: -1px;
}
</style>