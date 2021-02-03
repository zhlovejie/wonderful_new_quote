<template>
  <div>
    <h3>合同信息</h3>
    <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
      <a-form-item hidden>
        <a-input v-decorator="['id', { initialValue: detail.id }]" />
      </a-form-item>
      <a-form-item hidden>
        <a-input v-decorator="['instanceId', { initialValue: detail.instanceId }]" />
      </a-form-item>

      <table class="custom-table custom-table-border">
        <tr>
          <td style="width: 15%">合同编号</td>
          <td style="width: 35%">
            <span v-if="!isDisabled" style="color: #999">系统自动生成</span>
            <span v-else>{{ detail.contractNum }}</span>
          </td>
          <td style="width: 15%">签订日期</td>
          <td style="width: 35%">
            <a-form-item>
              <a-date-picker
                v-if="!isDisabled"
                placeholder="签订日期"
                v-decorator="[
                  'signedDate',
                  {
                    initialValue: detail.signedDate ? moment(detail.signedDate) : moment(),
                    rules: [{ required: true, message: '选择签订日期' }],
                  },
                ]"
                style="width: 100%"
              />
              <span v-else :style="{ color: moment().format('YYYY-MM-DD') !== detail.signedDate ? 'red' : '' }">{{
                detail.signedDate
              }}</span>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>开票类型</td>
          <td>
            <a-form-item>
              <a-radio-group
                v-if="!isDisabled"
                v-decorator="[
                  'invoiceType',
                  { initialValue: detail.invoiceType || 1, rules: [{ required: true, message: '请选择开票类型' }] },
                ]"
              >
                <a-radio :value="1">增票</a-radio>
                <a-radio :value="2">普票</a-radio>
              </a-radio-group>
              <span v-else>{{ { 1: '增票', 2: '普票' }[detail.invoiceType] }}</span>
            </a-form-item>
          </td>
          <td>产品</td>
          <td>
            <a-form-item>
              <a-select
                v-if="!isDisabled"
                mode="multiple"
                placeholder="产品"
                :allowClear="true"
                v-decorator="[
                  `products`,
                  { initialValue: detail.productsVal, rules: [{ required: true, message: '请选择产品' }] },
                ]"
              >
                <a-select-option v-for="item in productCategoryList" :key="item.id" :value="item.id">{{
                  item.text
                }}</a-select-option>
              </a-select>
              <span v-else>{{ detail.productsTxt }}</span>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>协议有效期</td>
          <td>
            <a-form-item>
              <a-range-picker
                v-if="!isDisabled"
                v-decorator="[
                  'validityDate',
                  {
                    initialValue: [
                      detail.validityDateStart ? moment(detail.validityDateStart) : undefined,
                      detail.validityDateEnd ? moment(detail.validityDateEnd) : undefined,
                    ],
                    rules: [{ required: true, message: '请选择协议有效期' }],
                  },
                ]"
                style="width: 100%"
                :allowClear="true"
              />
              <span v-else>{{ detail.validityDateStart }}~{{ detail.validityDateEnd }}</span>
            </a-form-item>
          </td>
          <td>销售区域</td>
          <td>
            <a-form-item>
              <ProvinceTreeCascade
                v-if="!isDisabled"
                @change="provinceTreeCascadeChange"
                :areaList="detail.salesAreaVal || []"
              />

              <a-input
                v-if="!isDisabled"
                hidden
                v-decorator="[
                  'salesArea',
                  {
                    initialValue: detail.salesArea,
                    rules: [{ required: true, message: '选择销售区域' }],
                  },
                ]"
              />
              <span v-else>{{ detail.salesAreaTxt }}</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>保证金</td>
          <td>
            <a-form-item>
              <a-radio-group
                v-if="!isDisabled"
                v-decorator="[
                  'haveDeposit',
                  { initialValue: +detail.haveDeposit || 1, rules: [{ required: true, message: '选择保证金' }] },
                ]"
                @change="depositChange"
              >
                <a-radio :value="1">有</a-radio>
                <a-radio :value="2">无</a-radio>
              </a-radio-group>
              <span v-else>{{ { 1: '有', 2: '无' }[detail.haveDeposit] }}</span>
            </a-form-item>
          </td>
          <td>返点</td>
          <td>
            <a-form-item>
              <a-radio-group
                v-if="!isDisabled"
                v-decorator="[
                  'haveRepay',
                  { initialValue: +detail.haveRepay || 2, rules: [{ required: true, message: '选择返点' }] },
                ]"
              >
                <a-radio :value="1">有</a-radio>
                <a-radio :value="2">无</a-radio>
              </a-radio-group>
              <span v-else>{{ { 1: '有', 2: '无' }[detail.haveRepay] }}</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>完成任务额(万元)</td>
          <td>
            <a-form-item>
              <a-input-number
                v-if="!isDisabled"
                style="width: 100%"
                :min="0"
                :step="1"
                :precision="2"
                v-decorator="[
                  'quotas',
                  { initialValue: detail['quotas'], rules: [{ required: true, message: '请输入任务额' }] },
                ]"
              />
              <span v-else>{{ detail['quotas'] | moneyFormatNumber }}</span>
            </a-form-item>
          </td>
          <template v-if="haveDeposit">
            <td>保证金(万元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'deposit',
                    { initialValue: detail['deposit'], rules: [{ required: true, message: '请输入保证金' }] },
                  ]"
                />
                <span v-else>{{ detail['deposit'] | moneyFormatNumber }}</span>
              </a-form-item>
            </td>
          </template>
          <template v-else>
            <td colspan="2"></td>
          </template>
        </tr>

        <tr>
          <td>乙方信息<br />（开票信息）</td>
          <td colspan="3">
            <a-row>
              <a-col :span="24" justify="center" align="middle">
                <a-row class="inner-row">
                  <a-col :span="12">
                    <a-form-item label="微信号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerWechat',
                          { initialValue: detail.customerWechat, rules: [{ required: true, message: '填写微信号' }] },
                        ]"
                      />
                      <span v-else>{{ detail.customerWechat }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="电子邮箱" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerEmail',
                          {
                            initialValue: detail.customerEmail,
                            rules: [{ required: true, message: '填写电子邮箱' }],
                          },
                        ]"
                      />
                      <span v-else>{{ detail.customerEmail }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="inner-row">
                  <a-col :span="12">
                    <a-form-item label="地址" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerAddress',
                          {
                            initialValue: detail.customerAddress,
                            rules: [{ required: true, message: '填写详细地址' }],
                          },
                        ]"
                      />
                      <span v-else>{{ detail.customerAddress }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="手机号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerPhone',
                          { initialValue: detail.customerPhone, rules: [{ required: true, message: '填写手机号' }] },
                        ]"
                      />
                      <span v-else>{{ detail.customerPhone }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row class="inner-row">
                  <a-col :span="12">
                    <a-form-item label="单位全称" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerCorporation',
                          {
                            initialValue: detail.customerCorporation,
                            rules: [{ required: true, message: '填写单位全称' }],
                          },
                        ]"
                      />
                      <span v-else>{{ detail.customerCorporation }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="邮政编码" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerPostalCode',
                          {
                            initialValue: detail.customerPostalCode,
                            rules: [{ required: false, message: '填写邮政编码' }],
                          },
                        ]"
                      />
                      <span v-else>{{ detail.customerPostalCode }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="inner-row">
                  <a-col :span="12">
                    <a-form-item label="开户行名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerBank',
                          {
                            initialValue: detail.customerBank,
                            rules: [{ required: false, message: '填写开户行名称' }],
                          },
                        ]"
                      />
                      <span v-else>{{ detail.customerBank }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="银行账号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerBankAccount',
                          {
                            initialValue: detail.customerBankAccount,
                            rules: [{ required: false, message: '填写银行账号' }],
                          },
                        ]"
                      />
                      <span v-else>{{ detail.customerBankAccount }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="inner-row">
                  <a-col :span="12">
                    <a-form-item label="税号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerTaxId',
                          { initialValue: detail.customerTaxId, rules: [{ required: false, message: '填写税号' }] },
                        ]"
                      />
                      <span v-else>{{ detail.customerTaxId }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="银行账号名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                      <a-input
                        v-if="!isDisabled"
                        type="text"
                        v-decorator="[
                          'customerBankUser',
                          {
                            initialValue: detail.customerBankUser,
                            rules: [{ required: false, message: '填写银行账号名称' }],
                          },
                        ]"
                      />
                      <span v-else>{{ detail.customerBankUser }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </td>
        </tr>
      </table>
    </a-form>
    <div style="margin: 20px 0">
      <template>
        <!-- <a-button key="back" @click="handleCancel">取消</a-button> -->
        <div style="text-align: center">
          <a-button v-if="isDisabled" key="submit1" type="primary" @click="() => handleOk(1)">预览</a-button>
          <a-button v-if="!isDisabled" style="margin-left: 10px" key="submit2" type="primary" @click="() => handleOk(2)"
            >保存</a-button
          >
          <a-button v-if="!isDisabled" style="margin-left: 10px" key="submit3" type="primary" @click="() => handleOk(3)"
            >提交审批</a-button
          >
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { agencyContractAddOrUpdate, agencyContractDetail } from '@/api/agencyContract'
import ProvinceTreeCascade from '@/components/CustomerList/ProvinceTreeCascade'
import { getListSalesman } from '@/api/contractListManagement'
import { getListByText } from '@/api/workBox'

import moment from 'moment'

export default {
  name: 'addForm',
  components: {
    ProvinceTreeCascade,
  },
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
      saleUsers: [],
      productCategoryList: [],
      birthplaceOptions: [], //籍贯 级联 省市
      contractNum: undefined,
      haveDeposit: true,
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
      let task1 = getListByText({ text: '产品类型' }).then((res) => {
        that.productCategoryList = res.data.records
      })
      queue.push(task1)
      let task2 = getListSalesman().then((res) => {
        that.saleUsers = res.data
      })
      queue.push(task2)
      // if (that.isAdd) {
      //   let task3 = agencyContractGenerateContractNum().then((res) => {
      //     let detail = { ...that.detail, contractNum: res.data }
      //     that.detail = detail
      //   })
      //   queue.push(task3)
      // }

      //let task4 = that.loadAreaAction(100000).then(res => that.birthplaceOptions = res)
      //queue.push(task4)
      //修改时 客户名称不可修改
      //that.customerSelectOptions = { ...that.customerSelectOptions, inputDisable: that.isEdit }

      return Promise.all(queue)
    },

    depositChange(e) {
      const v = e.target.value
      this.haveDeposit = +v === 1
    },

    provinceTreeCascadeChange(result) {
      //debugger
      let { val, txt } = result
      if (val && txt) {
        let str = `${val};${txt}`
        this.form.setFieldsValue({ salesArea: str })
        this.detail = { ...this.detail, salesAreaVal: val.split(',') }
      } else {
        this.form.setFieldsValue({ salesArea: undefined })
        this.detail = { ...this.detail, salesAreaVal: [] }
      }
    },
    getSaleManName(id) {
      let target = this.saleUsers.find((item) => +item.userId === +id)
      return target ? target.salesmanName : ''
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
        return
      }

      await agencyContractDetail({ id: record.id }).then((res) => {
        //console.log(res)
        //debugger
        if (res.data.salesArea) {
          let _arr = res.data.salesArea.split(';')
          res.data.salesAreaVal = _arr.length >= 1 ? _arr[0].split(',') : []
          res.data.salesAreaTxt = _arr.length === 2 ? _arr[1] : ''
        }
        if (res.data.products) {
          let _arr = res.data.products.split(';')
          res.data.productsVal = _arr.length >= 1 ? _arr[0].split(',').map((v) => +v) : []
          res.data.productsTxt = _arr.length === 2 ? _arr[1] : undefined
        }
        if (res.data.salesmanId) {
          res.data.salemanName = that.getSaleManName(res.data.salesmanId)
        }
        that.detail = res.data

        //是否显示保证金
        that.haveDeposit = +that.detail.haveDeposit === 1

        that.$refs.customerSelect &&
          that.$refs.customerSelect.fill({
            id: that.detail.customerId,
            name: that.detail.customerName,
          })

        //that.form.setFieldsValue({...that.detail})
      })
    },
    handleOk(type) {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.state = +type === 3 ? 2 : 1
          values.contractNum = that.detail.contractNum

          values.signedDate = values.signedDate.format('YYYY-MM-DD')
          values.validityDateStart = values.validityDate[0].format('YYYY-MM-DD')
          values.validityDateEnd = values.validityDate[1].format('YYYY-MM-DD')

          delete values.validityDate

          if (Array.isArray(values.products)) {
            let ids = values.products.join(',')
            let strs = values.products
              .map((v) => {
                let target = that.productCategoryList.find((item) => +item.id === +v)
                return target.text
              })
              .join(',')

            values.products = `${ids};${strs}`
          }
          that.$emit('click', { ...values })
        } else {
          that.$emit('click', null)
        }
      })
    },
    handleOkSubmit(values) {
      let that = this
      return agencyContractAddOrUpdate(values)
        .then((res) => {
          that.spinning = false
          if (res.code === 200) {
            that.visible = false
            that.$message.success('操作成功')
          } else {
            that.$message.warning(res.msg)
          }
          return { ...res }
        })
        .catch((err) => {
          return { code: 500, msg: err.message }
        })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
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