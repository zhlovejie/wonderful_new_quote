<template>
  <a-modal :title="modalTitle" :width="1000" :visible="visible" :footer="footer" @cancel="handleCancel" :maskClosable="false">
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">

        <h3>基本信息</h3>
        <a-form-item hidden>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['instanceId']" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 15%">销售经理</td>
            <td style="width: 35%">
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  :disabled="isEdit"
                  :allowClear="true"
                  v-decorator="[
                    'userId',
                    { initialValue: detail.userId, rules: [{ required: true, message: '请选择销售人员' }] },
                  ]"
                  placeholder="请选择销售经理"
                  @change="saleUserChange"
                >
                  <a-select-option v-for="item in saleUsers" :value="item.userId" :key="item.userId">{{
                    item.salesmanName
                  }}</a-select-option>
                </a-select>
                <span v-else>{{ detail.userName }}</span>
              </a-form-item>
            </td>
            <td style="width: 15%">客户名称</td>
            <td style="width: 35%">
              <CustomerSelect
                v-if="!isDisabled"
                ref="customerSelect"
                :needOptions="needOptions"
                :options="customerSelectOptions"
                @selected="handleCustomerSelected"
              />
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  hidden
                  v-decorator="[
                    'customerId',
                    { initialValue: detail.customerId, rules: [{ required: true, message: '请选择客户名称' }] },
                  ]"
                />
                <span v-else>{{ detail.customerName }}</span>
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['customerName', { initialValue: detail.customerName }]" />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>微信号</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  type="text"
                  v-decorator="[
                    'wxNum',
                    { initialValue: detail.wxNum, rules: [{ required: true, message: '填写微信号' }] },
                  ]"
                />
                <span v-else>{{ detail.wxNum }}</span>
              </a-form-item>
            </td>
            <td>邮箱</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  type="text"
                  v-decorator="[
                    'email',
                    {
                      initialValue: detail.email,
                      rules: [{ required: true, message: '填写电子邮箱' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.email }}</span>
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>合同信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 15%">合同编号</td>
            <td style="width: 35%">
              <span v-if="!isDisabled" style="color:#999;">系统自动生成</span>
              <span v-else>{{detail.contractNum}}</span>
            </td>
            <td style="width: 15%">签订日期</td>
            <td style="width: 35%">
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  placeholder="签订日期"
                  v-decorator="[
                    'signingDate',
                    {
                      initialValue: detail.signingDate ? moment(detail.signingDate) : moment(),
                      rules: [{ required: true, message: '选择签订日期' }],
                    },
                  ]"
                  style="width: 100%"
                />
                <span v-else>{{ detail.signingDate }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>合作期限(年)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  :min="1"
                  :max="99"
                  :step="1" 
                  style="width:100%" 
                  v-decorator="[
                    'cooperationYear', 
                    {
                      initialValue:detail.cooperationYear,
                      rules: [{ required: true, message: '请输入合作期限' }],
                    }
                  ]"
                />
                <span v-else>{{ detail.cooperationYear }}</span>
              </a-form-item>
            </td>
            <td colspan="2"></td>
          </tr>
        </table>
        <p v-if="isView && detail.accessory">
          已上传附件：<a target="_blank" v-download="detail.accessory">{{detail.accessory.slice(detail.accessory.lastIndexOf('/')+1) }}</a>
        </p>
        <StatusView :statusFn="statusFn"/>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  cooperationProtocolAddOrUpdate,
  cooperationProtocolDetail,
  //cooperationProtocolGenerateContractNum,
  cooperationProtocolApprove,
} from '@/api/qualificationsBorrowManagement'

//销售人员接口
import { getListSalesman } from '@/api/contractListManagement'
import moment from 'moment'
import Approval from './Approval'
//客户列表选择
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import StatusView from '@/components/CustomerList/StatusView'


export default {
  name: 'AddForm',
  components: {
    Approval,
    CustomerSelect,
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
      customerSelectOptions: {
        inputLabel: '',
        wrapperStyle: { flex: '1' },
        formLayout: 'inline',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: true,
        inputAllowClear: true,
        inputDisable: false,
      },
      needOptions: {
        userId: undefined,
      },
      detail: {},
      record: {},
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}战略合作协议`
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
        btn.push(h('a-button',{key:'cancel',on:{click:that.handleCancel},},'取消'))
        btn.push(h('a-button',{key:'save',on:{click:() => that.handleOk(1)},props:{type:'primary',loading:that.spinning}},'保存'))
        btn.push(h('a-button',{key:'submit',on:{click:() => that.handleOk(2)},props:{type:'primary',loading:that.spinning}},'提交'))
      }else if(that.isApproval){
        btn.push(h('a-button',{key:'no-pass',on:{click:that.noPassAction},},'不通过'))
        btn.push(h('a-button',{key:'pass',on:{click:that.passAction},props:{type:'primary',loading:that.spinning}},'通过'))
      }
      return btn
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let task1 = getListSalesman().then((res) => (that.saleUsers = res.data))
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
          let { effectiveStart, effectiveEnd, contractNum } = that.detail
          values.contractNum = contractNum
          values.saveType = saveType
          values.effectiveStart = effectiveStart
          values.effectiveEnd = effectiveEnd
          delete values.effective
          //values.
          //提交
          that.spinning = true
          cooperationProtocolAddOrUpdate(values)
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

      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {
          ...that.detail,
          effectiveStart: moment().format('YYYY-MM-DD'),
          effectiveEnd: moment().format('YYYY-MM-DD'),
        }
        // cooperationProtocolGenerateContractNum().then((res) => {
        //   that.detail = { ...that.detail, contractNum: res.data }
        // })
        that.$refs.customerSelect && that.$refs.customerSelect.handleClear()
        return
      }
      //填充数据
      const _detail = await cooperationProtocolDetail({ id: that.record.id }).then((res) => res.data)
      that.needOptions = {userId:_detail.userId}
      that.detail = _detail
      that.$refs.customerSelect &&
          that.$refs.customerSelect.fill({
            id: _detail.customerId || undefined,
            name: _detail.customerName,
          })
      //that.form.setFieldsValue(_detail)
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      cooperationProtocolApprove(values)
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
    selectCustomer() {
      //debugger
      let saleUserId = this.form.getFieldValue('saleUserId')
      if (saleUserId) {
        this.$refs.customerList.init({ userId: saleUserId })
      } else {
        this.$message.info('请选择销售经理后，再选择客户')
        return
      }
    },
    customerSelected(record) {
      let that = this
      if (record) {
        that.form.setFieldsValue({
          customerName: record.name,
          customerId: record.id,
        })
      }
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
    saleUserChange(saleUserId) {
      //选择销售人员 填充对应的 微信和邮箱
      //特殊处理
      this.needOptions = { userId: saleUserId }
      this.$refs.customerSelect.handleClear()
      this.form.setFieldsValue({ customerId: undefined, customerName: undefined })
      //debugger
      //特殊处理
      let target = this.saleUsers.find((user) => +user.userId === parseInt(saleUserId))
      //console.log(target)
      if (target) {
        let salesmanEmail = undefined,
          salesmanWechat = undefined
        if (target.email) {
          salesmanEmail = target.email
        } else if (target.userInfo && target.userInfo.email) {
          salesmanEmail = target.userInfo.email
        }
        salesmanEmail = salesmanEmail || undefined

        if (target.wxNum) {
          salesmanWechat = target.wxNum
        } else if (target.userInfo && target.userInfo.wxNum) {
          salesmanWechat = target.userInfo.wxNum
        }
        salesmanWechat = salesmanWechat || undefined
        this.form.setFieldsValue({ email: salesmanEmail, wxNum: salesmanWechat })
      }
    },
    handleCustomerSelected(item) {
      this.form.setFieldsValue({
        customerId: item && item.id ? item.id : undefined,
        customerName: item.name,
      })
    },
    rangePickerChange(arr, strs) {
      console.log(arguments)
      this.detail = {
        ...this.detail,
        effectiveStart: arr[0] instanceof moment ? arr[0].format('YYYY-MM-DD') : undefined,
        effectiveEnd: arr[1] instanceof moment ? arr[1].format('YYYY-MM-DD') : undefined,
      }
      this.form.setFieldsValue({ effective: arr })
    },
    statusFn(){
      let map = {
        1: '待提交',
        2: '待审批',
        3: '通过',
        4: '不通过',
        5: '已撤回'
      }
      let detail = this.detail
      if(!this.isView || !(detail && 'status' in detail)){
        return null
      }
      let cur = +detail.status
      return {
        map,
        cur,
        pass:3,
        nopass:4
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