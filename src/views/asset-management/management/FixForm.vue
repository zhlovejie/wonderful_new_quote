<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">申请部门</td>
            <td style="width:180px;">
              <a-form-item>
                {{detail.cliamDepartmentName}}
              </a-form-item>
            </td>
            <td style="width:150px;">申请人</td>
            <td style="width:180px;">{{detail.cliamUserName}}</td>
            <td style="width:150px;">申请日期</td>
            <td style="width:180px;">{{detail.__currentDate}}</td>
          </tr>
          <tr>
            <td style="width:150px;">设备/模具编号</td>
            <td style="width:180px;">{{detail.code}}</td>
            <td style="width:150px;">设备/模具名称</td>
            <td style="width:180px;">{{detail.name}}</td>
            <td style="width:150px;">需求时间</td>
            <td style="width:180px;">
              <a-form-item>
                <a-date-picker
                  v-decorator="['needTime',{initialValue:detail.needTime ? moment(record.needTime) : undefined,rules: [{required: true,message: '请选择需求时间'}]}]"
                  style="width:100%;"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">设备类型</td>
            <td colspan="2" style="width:360px;">
              <a-form-item>
                <a-radio-group v-decorator="['type', {initialValue: detail.type || '1', rules: [{required: true}]}]" style="width: 100%">
                  <a-radio :value="1">固定资产</a-radio>
                  <a-radio :value="2">车间设备</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
            <td style="width:150px;">紧急程度</td>
            <td colspan="2" style="width:360px;">
              <a-form-item>
                <a-radio-group v-decorator="['emaeceLevel', {initialValue: detail.emaeceLevel || '1', rules: [{required: true}]}]" style="width: 100%">
                  <a-radio :value="2">紧急(优先处理)</a-radio>
                  <a-radio :value="1">一般</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">故障描述</td>
            <td colspan="5">
              <a-form-item>
                <a-textarea
                  style="width:100%;"
                  placeholder="故障描述"
                  :rows="3"
                  v-decorator="['qustDesc', { initialValue:detail.qustDesc,rules: [{ required: true, message: '请输入故障描述' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">维修方案</td>
            <td colspan="5">
              <a-form-item>
                <a-textarea
                  disabled
                  style="width:100%;"
                  :rows="3"
                  v-decorator="['solutionPlan', { initialValue:detail.solutionPlan,rules: [{ required: false, message: '请输入维修方案' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-alert :message="msg" banner />
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取所有岗位
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { oaAssertsInfoRecoveAddOrUpdate } from '@/api/assetManagement'
import moment from 'moment'
export default {
  name: 'asset-management-management-FixForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'asset-management-management-FixForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      assetTypeList:[],
      record: {},
      detail:{},
      isManagerCheck: false,
      msg:'注：维修时间超过2小时的必须部门主管签字确认，已保证正常生产和发货；设备/模具/工装需外协维修的，维修方案确定后须报部门负责人审批后执行。'
    }
  },
  computed: {
    modalTitle() {
      return '报修'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
  },
  methods: {
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record,{__currentDate:moment().format("YYYY-MM-DD")})
      that.detail = Object.assign({},that.record || {})
      await that.initData()
      if (that.isEdit) {
        that.$nextTick(() => {
          that.form.setFieldsValue(Object.assign({}, that.record))
        })
      }
    },
    initData() {
      let that = this
      let queue = []
      let task1 = getDictionaryList({ parentId: 532 }).then((res) => (that.assetTypeList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          //if (that.isEdit) {
            values.assertsId = that.record.id
          //}
          if(values.needTime && values.needTime instanceof moment){
            values.needTime = values.needTime.format('YYYY-MM-DD')
          }
          that.spinning = true
          oaAssertsInfoRecoveAddOrUpdate(values)
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
  },
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  /* text-align: left; */
}
</style>
