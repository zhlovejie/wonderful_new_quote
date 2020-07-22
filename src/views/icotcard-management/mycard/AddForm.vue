<template>
<!-- <a-input
                  :disabled="isDisabled"
                  class="a-input"
                  style="width:100%;"
                  title="选择客户名称"
                  read-only
                  placeholder="选择客户名称"
                  @click="handleCustomerClick"
                  v-decorator="['customerName',{initialValue:detail.customerName,rules: [{ required: true, message: '选择客户名称'}]}]"
                /> -->
  <a-modal
    title="新增"
    :width="700"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template>
        <a-button key="back">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="spinning"
        >保存</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">卡号</td>
            <td>
              <a-form-item>
                <a-input 
                  v-model="form.menuType"
                  placeholder="卡号"
                />

                <!-- <a-select
                  :disabled="isDisabled"
                  placeholder="选择出差类型"
                  v-decorator="['travelType',{initialValue:detail.travelType,rules: [{required: true,message: '选择出差类型'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                >
                  <a-select-option :value="1">出差</a-select-option>
                  <a-select-option :value="2">公事外出</a-select-option>
                </a-select> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
             <td style="width:120px;">运营商</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="运营商"
                  :allowClear="true"
                  style="width:100%;"
                >
                  <a-select-option :value="1">中国移动</a-select-option>
                  <a-select-option :value="2">中国联通</a-select-option>
                  <a-select-option :value="3">中国电信</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">发卡日期</td>
            <td>
              <a-form-item>
                 <a-date-picker @change="changeStartDate" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">服务期限（年）</td>
            <td>
              <a-form-item>
                <a-select 
                  placeholder="服务期限（年）"
                  :allowClear="true"
                  style="width:100%"
                >
                  <a-select-option :value="1">1</a-select-option>
                  <a-select-option :value="2">2</a-select-option>
                  <a-select-option :value="3">3</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">服务器止</td>
            <td>
              <a-form-item>
                123
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">流量套餐</td>
            <td>
              <a-form-item>
                <a-input 
                  v-model="form.menuType"
                  placeholder="输入"
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
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { getAreaByParent } from '@/api/common'
import { getOneSalesman } from '@/api/customer/salesman'
import {
  attenceTravelApplyDetail,
  attenceTravelApplyAddAndUpdate,
  attenceTravelApplyApprove
} from '@/api/attendanceManagement'

import moment from 'moment'

export default {
  name: 'icotcard-management-mycard-add',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      detail: {},
      record: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  methods: {
    moment,
    handlerCustomerSelected(record) {
      this.form.setFieldsValue({
        customerName: record.name,
        customerId: record.id
      })
    },
    showAddForm(){
      this.visible=true
    },
    changeStartDate(){

    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          console.log(that.routesList)
          //return
          values.status = that.record.status || 0 //状态待审批
          values.beginAreaId = that.beginAreaId //外层出发城市
          values.routes = that.$_.cloneDeep(that.routesList).map(item => {
            delete item._key
            return item
          })
          that.spinning = true
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
      attenceTravelApplyApprove(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
    },
  }
}
</script>
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
  padding: 5px 10px;
}
</style>