<template>
  <a-modal :title="modalTitle" :width="750" :visible="visible" :footer="footer" @cancel="handleCancel" :maskClosable="false">
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">

        <a-form-item hidden>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['instanceId']" />
        </a-form-item>

        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 15%">编号</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  :disabled="true"
                  placeholder="系统自动生成"
                  v-decorator="[
                    'deductionNum',
                    {
                      initialValue: detail.deductionNum || undefined,
                      rules: [{ required: false }],
                    },
                  ]"
                />
                <span v-else>{{ detail.deductionNum }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 15%">销售经理</td>
            <td >
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  :disabled="isEdit"
                  :allowClear="true"
                  v-decorator="[
                    'saleUserId',
                    { initialValue: detail.saleUserId, rules: [{ required: true, message: '请选择销售经理' }] },
                  ]"
                  placeholder="请选择销售经理"
                >
                  <a-select-option v-for="item in saleUsers" :value="item.userId" :key="item.userId">
                    {{item.departmentName}} - {{item.salesmanName}}
                  </a-select-option>
                </a-select>
                <span v-else>{{detail.depName}} - {{ detail.saleUserName }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>金额</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'amount',
                    { initialValue: record.amount, rules: [{ required: true, message: '请输入金额' }] },
                  ]"
                />
                <span v-else>{{ detail.amount | moneyFormatNumber }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 15%">时间</td>
            <td style="width: 35%">
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  placeholder="时间"
                  v-decorator="[
                    'deductionTime',
                    {
                      initialValue: detail.deductionTime ? moment(detail.deductionTime) : moment(),
                      rules: [{ required: true, message: '选择时间' }],
                    },
                  ]"
                  style="width: 100%"
                />
                <span v-else>{{ detail.deductionTime }}</span>
              </a-form-item>
            </td>
          </tr>
          
        </table>
        <StatusView :statusFn="statusFn"/>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  qualificationBorrowPerformanceDeductionAddAndUpdate,
  qualificationBorrowPerformanceDeductionDetail,
  qualificationBorrowPerformanceDeductionApprove,
} from '@/api/receipt'

//销售人员接口
import { getListSaleContractUser } from '@/api/contractListManagement'
import moment from 'moment'
import Approval from './Approval'
//客户列表选择
import StatusView from '@/components/CustomerList/StatusView'


export default {
  name: 'AddForm',
  components: {
    Approval,
    StatusView
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false,
      contractId: undefined,
      saleUsers: [],
      detail: {},
      record: {},
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}业绩扣除单`
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
    footer(){
      let that = this
      const h = that.$createElement;
      let btn = []
      if(that.isView){
        return null
      }else if(that.isAdd || that.isEdit){
        btn.push(h('a-button',{key:'cancel',on:{click:that.handleCancel},props:{loading:that.spinning}},'取消'))
        btn.push(h('a-button',{key:'submit',on:{click:() => that.handleOk()},props:{type:'primary',loading:that.spinning}},'提交'))
      }else if(that.isApproval){
        btn.push(h('a-button',{key:'no-pass',on:{click:that.noPassAction},props:{loading:that.spinning}},'不通过'))
        btn.push(h('a-button',{key:'pass',on:{click:that.passAction},props:{type:'primary',loading:that.spinning}},'通过'))
      }
      return btn
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let task1 = getListSaleContractUser().then((res) => (that.saleUsers = res.data))
      return Promise.all([task1])
    },
    async handleOk(saveType) {
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
          let target = that.saleUsers.find(item => item.userId === values.saleUserId)
          if(target){
            values.depId = target.depId
          }
          values.deductionTime = values.deductionTime.format('YYYY-MM-DD')
          //values.
          //提交
          that.spinning = true
          qualificationBorrowPerformanceDeductionAddAndUpdate(values)
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
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.resetData()
      that.actionType = type
      that.record = record || {}
      that.detail = {}
      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        return
      }
      //填充数据
      const _detail = await qualificationBorrowPerformanceDeductionDetail({ id: that.record.id }).then((res) => res.data)
      that.needOptions = {userId:_detail.userId}
      that.detail = _detail
      //that.form.setFieldsValue(_detail)
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      qualificationBorrowPerformanceDeductionApprove(values)
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
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },

    resetData() {
      let that = this
      that.detail = {}
      that.visible = false
      that.actionType = 'add'
      that.opinion = '' //审批意见
      that.spinning = false
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    statusFn(){
      let map = {
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '已撤回'
      }
      let detail = this.detail
      if(!this.isView || !(detail && 'status' in detail)){
        return null
      }
      let cur = +detail.status
      return {
        map,
        cur,
        pass:2,
        nopass:3
      }
    }
  },
}
</script>

<style scoped>
.ant-upload-list-picture-card .ant-upload-list-item-info::before {
  left: 0;
}
</style>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 150px;
  text-align: left;
  padding-left: 20px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.customer-select-wrapper >>> .ant-form-item-control-wrapper {
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