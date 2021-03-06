<template>
  <a-spin :spinning="spinning">
    <div style="margin-top: 10px">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['instanceId', { initialValue: detail.instanceId }]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['borrowId', { initialValue: detail.borrowId }]" />
        </a-form-item>

        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 15%">销售人员</td>
            <td style="width: 35%">{{ baseInfo.salesmanName }}</td>
            <td style="width: 15%">客户名称</td>
            <td style="width: 35%">{{ baseInfo.customerName }}</td>
          </tr>
          <tr>
            <td>微信号</td>
            <td>{{ baseInfo.wxNum }}</td>
            <td>邮箱</td>
            <td>{{ baseInfo.email }}</td>
          </tr>

          <tr>
            <td>协议</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  v-if="!isDisabled && !isEdit"
                  style="width: 300px"
                  :allowClear="true"
                  v-decorator="[
                    'borrowType',
                    { initialValue: '产品售后服务外包协议', rules: [{ required: true, message: '请选择协议' }] },
                  ]"
                  placeholder="请选择协议"
                >
                  <a-select-option v-for="item in agreement" :value="item.text" :key="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
                <span v-else>产品售后服务外包协议</span>
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3 style="margin-top: 10px">
          <span>合同信息</span>
          <a v-if="isView" href="javascript:void(0);" style="float: right" @click="viewContract">预览合同</a>
        </h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 15%">合同编号</td>
            <td style="width: 35%">
              <span>{{ detail.contractNum }}</span>
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
                <span v-else :style="{ color: moment().format('YYYY-MM-DD') !== detail.signingDate ? 'red' : '' }">{{
                  detail.signingDate
                }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>区域</td>
            <td style="padding: 0">
              <a-form-item>
                <a-select
                  style="width: 100px"
                  :disabled="isDisabled"
                  placeholder="省"
                  :precision="0"
                  v-decorator="['province', { initialValue: prov, rules: [{ required: true, message: '请选择省！' }] }]"
                >
                  <a-select-option
                    @click="getCity(1, province.id, province.area)"
                    v-for="province in this.provinces"
                    :key="province.index"
                    :value="province.id"
                    >{{ province.area }}</a-select-option
                  >
                </a-select>
                <a-select
                  style="width: 100px; margin: 0 10px"
                  :disabled="isDisabled"
                  placeholder="市"
                  :precision="0"
                  v-decorator="['city', { initialValue: prov1, rules: [{ required: true, message: '请选择区！' }] }]"
                >
                  <a-select-option
                    @click="getCity(2, city.id, city.area)"
                    v-for="city in this.citys"
                    :key="city.index"
                    :value="city.id"
                    >{{ city.area }}</a-select-option
                  >
                </a-select>
                <a-select
                  style="width: 100px"
                  :disabled="isDisabled"
                  placeholder="区"
                  :precision="0"
                  v-decorator="['arealse', { initialValue: prov2, rules: [{ required: true, message: '请选择区！' }] }]"
                >
                  <a-select-option
                    @click="getCity(3, null, area.area)"
                    v-for="area in this.arealse"
                    :key="area.index"
                    :value="area.id"
                    >{{ area.area }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </td>
            <td>维修费用(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  style="width: 300px"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'maintenanceCost',
                    { initialValue: detail['maintenanceCost'], rules: [{ required: true, message: '请输入维修费用' }] },
                  ]"
                />
                <span v-else>{{ detail['maintenanceCost'] | moneyFormatNumber }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>合同有效期</td>
            <td colspan="3">
              <a-form-item>
                <a-range-picker
                  v-if="!isDisabled"
                  v-decorator="[
                    'validityDate',
                    {
                      initialValue: [
                        detail.effectiveStart ? moment(detail.effectiveStart) : undefined,
                        detail.effectiveEnd ? moment(detail.effectiveEnd) : undefined,
                      ],
                      rules: [{ required: true, message: '请选择协议有效期' }],
                    },
                  ]"
                  style="width: 50%"
                  :allowClear="true"
                />
                <span v-else>{{ detail.effectiveStart }}~{{ detail.effectiveEnd }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>结算方式</td>
            <td colspan="3">
              <a-form-item>
                <span>自合同签订之日起</span>
                <a-input-number
                  v-if="!isDisabled"
                  :precision="0"
                  style="width: 100px; margin: 0 10px"
                  v-decorator="[
                    'startPayment',
                    { initialValue: detail['startPayment'], rules: [{ required: true, message: '请输入几日内' }] },
                  ]"
                />
                <span v-else>{{ detail.startPayment }}</span>
                <span> 日内,甲方向乙方指定账号内分 </span>
                <a-input-number
                  :precision="0"
                  v-if="!isDisabled"
                  @change="paymentCountChange"
                  style="width: 100px; margin: 0 10px"
                  v-decorator="[
                    'paymentCount',
                    { initialValue: detail['paymentCount'], rules: [{ required: true, message: '请输入分几次' }] },
                  ]"
                />
                <span v-else>{{ detail.paymentCount }}</span>
                <span>次</span>
                <br />
                <span>每次支付人民币</span>
                <a-input-number
                  :precision="2"
                  v-if="!isDisabled"
                  @change="paymentAmountChange"
                  style="width: 100px; margin: 0 10px"
                  v-decorator="[
                    'paymentAmount',
                    {
                      initialValue: detail['paymentAmount'],
                      rules: [{ required: true, message: '请输入每次支付多少元' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.paymentAmount }}</span>
                <span> 元,合计年服务费人民币 </span>
                <!-- <a-input-number
                  :precision="2"
                  v-if="!isDisabled"
                  style="width: 100px;margin:0 10px;"
                  v-decorator="[
                    'yearCost',
                    { initialValue: detail['yearCost'], rules: [{ required: true, message: '请输入年服务费' }] },
                  ]"
                /> -->
                <span>{{ yearCost }}</span>
                <span>元</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <div style="margin: 20px 0">
        <!-- <a-button key="back" @click="handleCancel">取消</a-button> -->
        <div style="text-align: center">
          <a-button
            v-if="!isDisabled"
            style="margin-left: 10px"
            key="submit2"
            type="primary"
            @click="() => handleSubmit(2)"
            >保存</a-button
          >
          <a-button
            v-if="!isDisabled"
            style="margin-left: 10px"
            key="submit3"
            type="primary"
            @click="() => handleSubmit(3)"
            >提交审批</a-button
          >
        </div>
      </div>
      <a-modal title="预览合同" :width="1200" :visible="visible" :footer="null" @cancel="handleCancel">
        <PreviewAfterSales :contractId="detail.id" />
      </a-modal>
    </div>
  </a-spin>
</template>
<script>
import { afterProtocolNum, afterDetailBorrowId, afteraddOrUpdate } from '@/api/agencyContract'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import { getListByText } from '@/api/workBox'
import { getAreaByParent } from '@/api/common'
import ProvinceTreeCascade from '@/components/CustomerList/ProvinceTreeCascade'
import { getListSalesman } from '@/api/contractListManagement'
import moment from 'moment'
import PreviewAfterSales from '../contractView/previewAfterSales'
let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'addForm',
  components: { ProvinceTreeCascade, CustomerSelect, PreviewAfterSales },
  props: {
    actionType: String,
    record: Object,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'qualifications-borrow-management-step5' }),
      visible: false,
      spinning: false,
      yearCost: 0,
      detail: {},
      details: {
        paymentCount: 0,
        paymentAmount: 0,
      },
      provinces: [], // 省下拉框数据
      citys: [], // 城市下拉框数据
      arealse: [], // 区下拉框数据
      provincesl: undefined,
      citysl: undefined,
      areassl: undefined,
      prov: undefined,
      prov1: undefined,
      prov2: undefined,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      saleUsers: [],
      agreement: [],
      productCategoryList: [],
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
      contractNum: undefined,
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
      return this.actionType === 'add' || this.actionType === 'do'
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
    baseInfo() {
      const that = this
      return {
        salesmanName: that.record.salesmanName,
        userId: that.record.userId,
        customerName: that.record.customerName,
        customerId: that.record.customerId,
        wxNum: that.record.wxNum,
        email: that.record.email,
      }
    },
  },
  watch: {
    actionType() {
      this.query(this.actionType === 'view' ? 'view' : 'add', this.record)
    },
  },
  created() {
    this.$nextTick(() => {
      this.query(this.actionType === 'view' ? 'view' : 'add', this.record)
    })
  },
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      getAreaByParent({ pId: 100000 })
        .then((res) => {
          // 所有省
          this.provinces = res.data
        })
        .catch(function (err) {
          console.log(err)
        })
      getListSalesman().then((res) => {
        that.saleUsers = res.data
      })
      //{ text: '产品类型' }
      getListByText({ text: '资质借用协议' }).then((res) => {
        that.agreement = res.data.records
      })

      if (that.isAdd) {
        let task3 = afterProtocolNum().then((res) => {
          that.detail.contractNum = res.data
        })
        queue.push(task3)
      }

      //修改时 客户名称不可修改
      that.customerSelectOptions = { ...that.customerSelectOptions, inputDisable: that.isEdit }

      return Promise.all(queue)
    },
    yearCosts() {
      this.yearCost = Number(this.details.paymentCount) * Number(this.details.paymentAmount)
    },
    getCity(type, pId, name) {
      if (type != 3) {
        getAreaByParent({ pId: pId })
          .then((res) => {
            if (type === 1) {
              this.provincesl = name
              this.citys = res.data
            } else if (type === 2) {
              this.citysl = name
              this.arealse = res.data
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        this.areassl = name
      }
    },
    //获取分几次付款
    paymentCountChange(arrSelected) {
      this.details.paymentCount = arrSelected
      this.yearCosts()
    },
    //获取1次付款多少钱
    paymentAmountChange(arrSelected) {
      this.details.paymentAmount = arrSelected
      this.yearCosts()
    },
    handleCustomerSelected(item) {
      this.form.setFieldsValue({
        customerId: item && item.id ? item.id : undefined,
        customerName: item.name,
      })
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
        let email = undefined,
          wxNum = undefined
        if (target.email) {
          email = target.email
        } else if (target.userInfo && target.userInfo.email) {
          email = target.userInfo.email
        }
        email = email || undefined

        if (target.wxNum) {
          wxNum = target.wxNum
        } else if (target.userInfo && target.userInfo.wxNum) {
          wxNum = target.userInfo.wxNum
        }
        wxNum = wxNum || undefined
        this.form.setFieldsValue({ email, wxNum })
      }
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
      that.detail = {}
      this.yearCosts()
      await that.init()
      //debugger
      if (that.isAdd) {
        that.form.setFieldsValue({ borrowId: record.id })
        return
      }

      that.spinning = true
      try {
        await afterDetailBorrowId({ id: record.id }).then((res) => {
          that.spinning = false
          that.detail = res.data
          let react = that.detail.areaName.slice(',')
          let arrs = that.detail.area.split(',')
          that.prov = Number(arrs[0])
          that.prov1 = Number(arrs[1])
          that.prov2 = Number(arrs[2])
          // that.form.setFieldsValue({ ...that.detail })
          let arr = (res.data.area || '').split(',')
          that.getCity(1, arr[0], react[0])
          that.getCity(2, arr[1], react[1])
          that.getCity(3, null, react[2])
        })
      } catch (err) {
        that.spinning = false
        that.$message.error(err.message)
      }
    },
    handleSubmit(type) {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.saveType = +type === 3 ? 2 : 1

          if (+type === 1 && that.record.id) {
            that.visible = false
            that.$router.push({
              name: 'afterSalesView',
              params: { id: that.record.id, action: this.actionType, from: 'afterSalesList' },
            })
            return
          }

          values.contractNum = that.detail.contractNum
          if (that.yearCost !== values.maintenanceCost) {
            return that.$message.error('合计费用要等于维修费用')
          }
          values.yearCost = this.yearCost
          values.areaName = this.provincesl + ',' + this.citysl + ',' + this.areassl
          values.signingDate = values.signingDate.format('YYYY-MM-DD')
          values.effectiveStart = values.validityDate[0].format('YYYY-MM-DD')
          values.effectiveEnd = values.validityDate[1].format('YYYY-MM-DD')
          values.area = values.province + ',' + values.city + ',' + values.arealse
          delete values.validityDate
          delete values.province
          delete values.city
          delete values.arealse

          values = { ...values, ...that.baseInfo }

          //productCategoryList
          console.log('Received values of form: ', values)
          //return
          that.spinning = true
          afteraddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('end', 5)
                // if (+type === 1) {
                //   that.$router.push({
                //     name: 'afterSalesView',
                //     params: { id: that.record.id, action: this.actionType, from: 'afterSalesList' },
                //   })
                // }
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
      this.visible = false
    },
    viewContract() {
      this.visible = true
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