<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
  >
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
            <td style="width: 15%">返款编号</td>
            <td style="width: 35%">
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  :disabled="true"
                  placeholder="系统自动生成"
                  v-decorator="[
                    'rebatesNum',
                    {
                      initialValue: detail.rebatesNum || undefined,
                      rules: [{ required: false, message: '请输入返款编号' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.rebatesNum }}</span>
              </a-form-item>
            </td>
            <td style="width: 15%">资质借用管理</td>
            <td style="width: 35%">
              infoId-资质借用基本信息表id
              <a-form-item>
                <a-button @click="qualificationsBorrowContractClickHandler">选择资质借用管理合同</a-button>
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['infoId']" />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width: 15%">协议</td>
            <td style="width: 35%">test</td>


            <td style="width: 15%">销售经理</td>
            <td style="width: 35%">
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
                  @change="saleUserChange"
                >
                  <a-select-option v-for="item in saleUsers" :value="item.userId" :key="item.userId">{{
                    item.salesmanName
                  }}</a-select-option>
                </a-select>
                <span v-else>{{ detail.saleUserName }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
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
            <td>付款金额</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'paymentAmount',
                    { initialValue: record.paymentAmount, rules: [{ required: true, message: '请输入付款金额' }] },
                  ]"
                />
                <span v-else>{{ detail.paymentAmount | moneyFormatNumber }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 15%">税率</td>
            <td style="width: 35%">
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  :allowClear="true"
                  v-decorator="[
                    'taxRate',
                    { initialValue: detail.taxRate, rules: [{ required: true, message: '请选择税率' }] },
                  ]"
                  placeholder="请选择税率"
                >
                  <a-select-option :value="6">6%</a-select-option>
                  <a-select-option :value="3">3%</a-select-option>
                  <a-select-option :value="13">13%</a-select-option>
                </a-select>
                <span v-else>{{ detail.taxRate + '%' }}</span>
              </a-form-item>
            </td>
            <td style="width: 15%">开户行名称</td>
            <td style="width: 35%">
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="开户行名称"
                  v-decorator="[
                    'openBankName',
                    {
                      initialValue: detail.openBankName,
                      rules: [{ required: true, message: '请输入开户行名称' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.openBankName }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 15%">账号</td>
            <td style="width: 35%">
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="账号"
                  v-decorator="[
                    'account',
                    {
                      initialValue: detail.account,
                      rules: [{ required: true, message: '请输入账号' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.account }}</span>
              </a-form-item>
            </td>
            <td style="width: 15%">付款事由</td>
            <td style="width: 35%">
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="付款事由"
                  v-decorator="[
                    'paymentReason',
                    {
                      initialValue: detail.paymentReason,
                      rules: [{ required: true, message: '请输入付款事由' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.paymentReason }}</span>
              </a-form-item>
            </td>
          </tr>

          <template v-if="isDisabled">
            <tr>
              <td colspan="4" style="padding: 0">
                <table class="custom-table custom-table-border">
                  <tr>
                    <th style="width: 15%">已付情况</th>
                    <th style="width: 35%">付款金额(元)</th>
                    <th style="width: 15%">付款比例(选填)</th>
                    <th style="width: 35%">备注</th>
                  </tr>
                  <tr v-for="(item, idx) in rebatesDetailsList" :key="item.key">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ item.paymentAmount | moneyFormatNumber }}</td>
                    <td>{{ item.paymentProportion + '%' }}</td>
                    <td>{{ item.remark }}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </template>
          <template v-if="isAdd || isEdit">
            <tr>
              <td colspan="4" style="padding: 0">
                <table class="custom-table custom-table-border">
                  <tr>
                    <th style="width: 15%">已付情况</th>
                    <th style="width: 35%">付款金额(元)</th>
                    <th style="width: 15%">付款比例(选填)</th>
                    <th style="width: 25%">备注</th>
                    <th style="width: 10%">操作</th>
                  </tr>
                  <tr v-for="(item, idx) in rebatesDetailsList" :key="item.key">
                    <td>{{ idx + 1 }}</td>
                    <td>
                      <a-form-item>
                        <a-input-number
                          v-if="!isDisabled"
                          style="width: 100%"
                          :min="0"
                          :step="1"
                          :precision="2"
                          v-decorator="[
                            `rebatesDetailsList.${idx}.paymentAmount`,
                            {
                              initialValue: item.paymentAmount,
                              rules: [{ required: true, message: '请输入付款金额' }],
                            },
                          ]"
                          @change="(e) => itemChange(item.key, 'paymentAmount', e)"
                        />
                        <span v-else>{{ item.paymentAmount | moneyFormatNumber }}</span>
                      </a-form-item>
                    </td>
                    <td>
                      <a-form-item>
                        <a-input-number
                          v-if="!isDisabled"
                          style="width: 100%"
                          :min="0"
                          :max="100"
                          :step="1"
                          :precision="0"
                          v-decorator="[
                            `rebatesDetailsList.${idx}.paymentProportion`,
                            {
                              initialValue: item.paymentProportion,
                              rules: [{ required: false, message: '请输入付款比例' }],
                            },
                          ]"
                          @change="(e) => itemChange(item.key, 'paymentProportion', e)"
                        />
                        <span v-else>{{ item.paymentProportion + '%' }}</span>
                      </a-form-item>
                    </td>
                    <td>
                      <a-form-item>
                        <a-input
                          v-if="!isDisabled"
                          placeholder="备注"
                          v-decorator="[
                            `rebatesDetailsList.${idx}.remark`,
                            {
                              initialValue: item.remark,
                              rules: [{ required: false, message: '请输入备注' }],
                            },
                          ]"
                          @change="(e) => itemChange(item.key, 'remark', e)"
                        />
                        <span v-else>{{ item.remark }}</span>
                      </a-form-item>
                    </td>
                    <td>
                      <a href="javascript:void();" @click="removeItem(item.key)">删除</a>
                    </td>
                  </tr>
                </table>
                <a-button v-if="!isView" style="width: 100%" type="dashed" icon="plus" @click="addItem"
                  >添加付款项</a-button
                >
              </td>
            </tr>
          </template>

          <tr>
            <td>本次付款金额(元)</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  :disabled="true"
                  placeholder="本次付款金额"
                  v-decorator="[
                    'thePaymentAmount',
                    {
                      initialValue: detail.thePaymentAmount || 0,
                      rules: [{ required: false }],
                    },
                  ]"
                />
                <span v-else>{{ detail.thePaymentAmount | moneyFormatNumber }}</span>
              </a-form-item>
            </td>
            <td>金额大写</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  :disabled="true"
                  placeholder="系统自动生成"
                  v-decorator="[
                    'amountCapital',
                    {
                      initialValue: detail.amountCapital || 0,
                      rules: [{ required: false }],
                    },
                  ]"
                />
                <span v-else>{{ detail.amountCapital }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>发票凭证</td>
            <td colspan="3">
              <a-form-item v-if="!isDisabled">
                <UploadFile ref="uploadFile" maxFileCount="3" />
                <a-input
                  hidden
                  v-decorator="[
                    'proofInvoiceUrl',
                    { initialValue: detail.proofInvoiceUrl, rules: [{ required: true, message: '请上传发票凭证' }] },
                  ]"
                />
              </a-form-item>
              <div v-else>
                <template v-if="detail.proofInvoiceUrl">
                  <img
                    v-for="url in detail.proofInvoiceUrl.split(',').map((url) => decodeURIComponent(url))"
                    :key="url"
                    :src="url"
                    @click="showImg(url)"
                    style="width: 128px; height: auto; overflow: hidden; margin: 10px 10px 0 0"
                    alt="图片"
                  />
                </template>
                <template v-else>未上传发票凭证</template>
              </div>
            </td>
          </tr>
        </table>
        <StatusView :statusFn="statusFn" />
        <!-- <p v-if="isView && detail.accessory">
          已上传文件：<a target="_blank" v-download="detail.accessory">{{detail.accessory}}</a>
        </p> -->
        <ImgView ref="imgView" />
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
      <SelectQualificationsBorrowContract ref="selectQualificationsBorrowContract" @select="qualificationsBorrowContractSelectHandler" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  qualificationBorrowRebatesAddAndUpdate,
  qualificationBorrowRebatesDetail,
  qualificationBorrowRebatesApprove,
} from '@/api/receipt'

//销售人员接口
import { getListSaleContractUser } from '@/api/contractListManagement'
import { turnTheCapital } from '@/api/contractListManagement'
import moment from 'moment'
import Approval from './Approval'
//客户列表选择
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import StatusView from '@/components/CustomerList/StatusView'
import UploadFile from '@/components/CustomerList/UploadFile'
import ImgView from '@/components/CustomerList/ImgView'

import SelectQualificationsBorrowContract from './SelectQualificationsBorrowContract'
/*
let imgList = res.data.fileUrl.split(',').map(url => decodeURIComponent(url))
            that.$refs.imgViewList.show(imgList)
*/

let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

export default {
  name: 'AddForm',
  components: {
    Approval,
    CustomerSelect,
    StatusView,
    UploadFile,
    ImgView,
    SelectQualificationsBorrowContract
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
      rebatesDetailsList: [],
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}返款申请`
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
    footer() {
      let that = this
      const h = that.$createElement
      let btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
              props: { type: 'primary', loading: that.spinning },
            },
            '提交'
          )
        )
      } else if (that.isApproval) {
        btn.push(h('a-button', { key: 'no-pass', on: { click: that.noPassAction } ,props:{loading: that.spinning}}, '不通过'))
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let task1 = getListSaleContractUser().then((res) => (that.saleUsers = res.data))
      return Promise.all([task1])
    },
    async updateMoney() {
      let that = this
      let thePaymentAmount =
        this.rebatesDetailsList.reduce((a, b) => {
          //debugger
          let m = (parseFloat(a.paymentAmount) || 0) + (parseFloat(b.paymentAmount) || 0)
          return m
        }) || 0
      let amountCapital =
        thePaymentAmount > 0 ? await turnTheCapital({ money: thePaymentAmount }).then((res) => res.data) : '零'
      that.form.setFieldsValue({
        thePaymentAmount,
        amountCapital,
      })
    },
    addItem() {
      let rebatesDetailsList = [...this.rebatesDetailsList]
      rebatesDetailsList.push({
        key: uuid(),
        paymentAmount: undefined,
        paymentProportion: undefined,
        remark: undefined,
      })
      this.rebatesDetailsList = rebatesDetailsList
    },
    removeItem(key) {
      this.rebatesDetailsList = this.rebatesDetailsList.filter((item) => item.key !== key)
    },
    itemChange(key, field, e) {
      //debugger
      let rebatesDetailsList = [...this.rebatesDetailsList]
      let target = rebatesDetailsList.find((item) => item.key === key)
      target[field] = e instanceof Event ? e.target.value : e
      this.rebatesDetailsList = rebatesDetailsList
      if (field === 'paymentAmount') {
        this.updateMoney()
      }
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }

      let files = that.$refs.uploadFile.getFiles()
      if (Array.isArray(files) && files.length > 0) {
        await that.form.setFieldsValue({
          proofInvoiceUrl: files.map((f) => encodeURIComponent(f.url)).join(','),
        })
      } else {
        that.$message.info('请上传发票凭证')
        return
      }

      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          values.infoId = 1

          values.rebatesDetailsList = that.rebatesDetailsList.map((item, idx) => {
            item.prepaidSituation = idx + 1
            return item
          })
          that.spinning = true
          qualificationBorrowRebatesAddAndUpdate(values)
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
        that.$refs.customerSelect && that.$refs.customerSelect.handleClear()
        return
      }
      //填充数据
      const _detail = await qualificationBorrowRebatesDetail({ id: that.record.id }).then((res) => res.data)
      that.needOptions = { userId: _detail.userId }
      that.detail = _detail
      that.rebatesDetailsList = (that.detail.rebatesDetailsList || []).map(item =>{
        item.key = uuid()
        return item
      })
      that.$refs.customerSelect &&
        that.$refs.customerSelect.fill({
          id: _detail.customerId || undefined,
          name: _detail.customerName,
        })
      if (that.isEdit && that.detail.proofInvoiceUrl) {
        let imgList = that.detail.proofInvoiceUrl.split(',').map((url) => {
          return {
            url: decodeURIComponent(url),
          }
        })
        that.$refs.uploadFile && that.$refs.uploadFile.setFiles(imgList)
      }

      //that.form.setFieldsValue(_detail)
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      qualificationBorrowRebatesApprove(values)
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
    statusFn() {
      let map = {
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '已撤回',
      }
      let detail = this.detail
      if (!this.isView || !(detail && 'status' in detail)) {
        return null
      }
      let cur = +detail.status
      return {
        map,
        cur,
        pass: 2,
        nopass: 3,
      }
    },
    showImg(url) {
      this.$refs.imgView.show(url)
    },
    qualificationsBorrowContractSelectHandler(data){
      console.log(data.borrowId)
      infoId
    },
    qualificationsBorrowContractClickHandler(){
      this.$refs.selectQualificationsBorrowContract.query({
        //返款单调用传 1，会过滤 完结的且未被返款单绑定的 资质借用管理合同列表
        isRebates:1,
        //type, //类型 1项目投标 2 项目经营
        //contractProperty, 合同属性 1 经销商合同 2代理商合同 3 战略合作协议
        //salemanId, //销售经理编号
        //customerName, //客户名称
      })
    }
  }
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
  width: calc(100% + 2px);
}
</style>