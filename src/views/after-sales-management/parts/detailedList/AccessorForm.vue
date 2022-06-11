<template>
  <a-modal
    :title="modalTitle"
    :width="1300"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <!-- <a-button v-if="details.formKey === '3'" key="submit1" type="primary" @click="handleOk()">完结</a-button>
        <a-popconfirm v-else-if="details.formKey === '1'" title="确认是否愿意担保吗?" @confirm="() => handleOk()">
          <a-button key="submit" type="primary">确定</a-button>
        </a-popconfirm> -->
        <a-button key="submit1" type="primary" @click="handleOk()">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 250px">配件销售合同编号</td>
            <td>{{ (record.accessoriesContractNum && record.accessoriesContractNum) || '系统生成' }}</td>
            <td style="width: 250px">配件清单编号</td>
            <td>{{ record.accessoriesNum }}</td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>
              <a-form-model-item
                prop="address"
                :rules="{
                  required: false,
                  message: '客户名称'
                }"
              >
                <a-input
                  read-only
                  placeholder="客户名称"
                  :allowClear="true"
                  @click="selectCustomer"
                  v-model="form.customerName"
                />
                <!-- <a-input v-if="!isDisabled" v-model="form.customerName" /> -->
              </a-form-model-item>
            </td>
            <td>售后人员</td>
            <td>{{ record.createdName }}</td>
          </tr>

          <tr>
            <td>是否含税</td>
            <td :colspan="+form.isTax === 1 ? 1 : 3">
              <a-form-model-item
                prop="isTax"
                :rules="{
                  required: true,
                  message: '请选择是否含税'
                }"
              >
                <a-radio-group v-if="!isDisabled" v-model="form.isTax">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>

            <template v-if="+form.isTax === 1">
              <td>是否开票</td>
              <td>
                <a-form-model-item
                  prop="needInvoice"
                  :rules="{
                    required: true,
                    message: '请选择开票类型'
                  }"
                >
                  <a-radio-group v-if="!isDisabled" v-model="form.needInvoice">
                    <a-radio :value="0">否</a-radio>
                    <a-radio :value="1">是</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </td>
            </template>
          </tr>

          <tr>
            <td>是否含运费</td>
            <td :colspan="+form.freightType === 1 ? 1 : 3">
              <a-form-model-item
                prop="freightType"
                :rules="{
                  required: true,
                  message: '请选择是否含运费'
                }"
              >
                <a-radio-group v-if="!isDisabled" v-model="form.freightType" @change="handleFreightAmountChange">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
                <span v-else>
                  {{ { 1: '是', 0: '否' }[form.freightType] }}
                </span>
              </a-form-model-item>
            </td>
            <template v-if="+form.freightType === 1">
              <td>运费金额</td>
              <td>
                <a-form-model-item
                  prop="freightAmount"
                  :rules="{
                    required: true,
                    message: '请输入运费金额'
                  }"
                >
                  <a-input-number
                    style="width:100%;"
                    placeholder="运费金额"
                    v-model="form.freightAmount"
                    :step="1"
                    :precision="2"
                    v-if="!isDisabled"
                    @change="handleFreightAmountChange"
                  />
                  <span v-else>
                    {{ form.freightAmount | moneyFormatNumber }}
                  </span>
                </a-form-model-item>
              </td>
            </template>
          </tr>

          <tr>
            <td>是否需要鲜章</td>
            <td colspan="3">
              <a-form-model-item
                prop="needSignet"
                :rules="{
                  required: true,
                  message: '请选择是否需要鲜章'
                }"
              >
                <a-radio-group v-if="!isDisabled" v-model="form.needSignet">
                  <a-radio :value="0">否</a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td v-if="+form.isTax === 1 && +form.needInvoice === 1">开票类型</td>
            <td v-if="+form.isTax === 1 && +form.needInvoice === 1">
              <a-form-model-item
                prop="invoiceType"
                :rules="{
                  required: true,
                  message: '请选择开票类型'
                }"
              >
                <a-radio-group v-if="!isDisabled" v-model="form.invoiceType">
                  <a-radio :value="2">增票</a-radio>
                  <a-radio :value="1">普票</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
            <td>签订日期</td>
            <td :colspan="form.needSignet === 0 ? 3 : 0">
              <a-form-model-item
                prop="signDate"
                :rules="{
                  required: true,
                  message: '请选择签订日期'
                }"
              >
                <a-date-picker v-if="!isDisabled" v-model="form.signDate" />
                <span v-else :style="{ color: moment().format('YYYY-MM-DD') !== form.signDate ? 'red' : '' }">{{
                  form.signDate
                }}</span>
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div style="margin-top: 20px">
          <h3>合同信息</h3>
          <a-table
            :columns="travelColumns"
            :dataSource="form.productInfoList"
            :pagination="false"
            bordered
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>
            <div slot="footer" slot-scope="text, record, index">
              <div style="text-align: right; font-size: 16px; color: red">
                <span>数量合计：{{ totalPrice }}</span>
                <span style="margin: 0 10px">单价合计：{{ totalPhase | moneyFormatNumber }}</span>
                <span>金额合计：{{ form.totalAmount | moneyFormatNumber }}</span>
                <span style="margin:0 10px;"
                  >({{ +form.isTax === 1 ? '含税' : '不含税' }} &nbsp;&nbsp;{{
                    +form.freightType === 1 ? '含运费' : '不含运费'
                  }})</span
                >
              </div>
            </div>
          </a-table>
        </div>
        <h3>开票信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 250px">地址</td>
            <td>
              <a-form-model-item
                prop="address"
                :rules="{
                  required: false,
                  message: '请输入地址'
                }"
              >
                <a-input v-if="!isDisabled" v-model="form.address" />
              </a-form-model-item>
            </td>
            <td style="width: 250px">电话</td>
            <td>
              <a-form-model-item
                prop="telephone"
                :rules="[
                  {
                    required: false,
                    message: '请输入电话'
                  },
                  { min: 0, max: 400, message: '电话长度0-400位', trigger: 'blur' }
                ]"
              >
                <a-input v-if="!isDisabled" v-model="form.telephone" />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>开户行名称</td>
            <td>
              <a-form-model-item
                prop="bankName"
                :rules="{
                  required: false,
                  message: '请输入开户行名称'
                }"
              >
                <a-input v-if="!isDisabled" v-model="form.bankName" />
              </a-form-model-item>
            </td>
            <td>账号</td>
            <td>
              <a-form-model-item
                prop="accountNum"
                :rules="{
                  required: false,
                  message: '请输入账号'
                }"
              >
                <a-input v-if="!isDisabled" v-model="form.accountNum" />
              </a-form-model-item>
            </td>
          </tr>
        </table>
      </a-form-model>
      <CustomerList ref="customerList" @selected="customerSelected" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  accessoriesManagementDetail,
  accessoriesAddOrUpdate,
  accessoriesgetCustomerById
} from '@/api/after-sales-management' //机构名称
//客户列表选择
import CustomerList from '@/components/CustomerList/CustomerList'
import moment from 'moment'
export default {
  name: 'BecomingForm',
  components: {
    CustomerList
  },
  data() {
    return {
      details: {},
      form: {
        productInfoList: [],
        signDate: moment(),
        invoiceType: 2,
        needInvoice: 1,
        needSignet: 0,
        freightType: 1,
        isTax: 1
      },
      isWarranty: undefined,
      record: {},
      recordDetails: {},
      visible: false,
      spinning: false,
      type: 'add',
      userInfo: this.$store.getters.userInfo
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '新增' : this.isVeiw ? '详情' : '修改'
      return `${txt}配件销售合同`
    },
    isAdd() {
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'veiw'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isVeiw
    },
    totalPrice() {
      return this.form.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.quantity)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase() {
      return this.form.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.unitPrice || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    travelColumns() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 60,
          align: 'center'
        },
        {
          title: '物料代码',
          dataIndex: 'materialCode',
          width: 150,
          align: 'center'
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          width: 130,
          align: 'center'
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          width: 340,
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'company',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          align: 'center'
        },
        {
          title: '单价（元）',
          dataIndex: 'unitPrice',
          align: 'center'
        },
        {
          title: '金额（元）',
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' },
          align: 'center'
        }
      ]
      return baseColumns
    }
  },

  created() {},
  methods: {
    moment,
    selectCustomer() {
      this.$refs.customerList.init()
    },
    customerSelected(record) {
      let that = this
      console.log(record)
      if (record) {
        this.form = { ...this.form, ...{ customerName: record.name, customerId: record.id } }
      }
    },
    async query(type, record) {
      this.visible = true
      this.form = {
        productInfoList: [],
        signDate: moment(),
        invoiceType: 2,
        needInvoice: 1,
        needSignet: 0,
        freightType: 1,
        isTax: 1
      }
      this.type = type
      this.record = record
      this.form.handlerUser = record.saleUserId
      if (type === 'add') {
        await accessoriesManagementDetail({ id: record.id }).then(res => {
          this.spinning = false
          this.details = res.data
          res.data.productInfoList = res.data.productInfoList.filter(i => i.isWarranty === 1)
          // this.form.customerName = record.customerName
          // this.form.customerId = record.customerId
          this.form = { ...this.form, ...res.data, isTax: 1 }
          this.form = { ...this.form, ...{ customerName: record.customerName, customerId: record.customerId } }
        })
        await accessoriesgetCustomerById({ id: record.customerId }).then(res => {
          this.form = { ...this.form, ...res.data, isTax: 1 }
        })

        this.handleFreightAmountChange()
      }
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let ret = {}
          const params = that.$_.cloneDeep(that.form || {})
          ret.accessoriesId = this.record.id
          ret.customerName = params.customerName
          ret.customerId = params.customerId
          ret.saleUserId = this.record.saleUserId
          ret.afterUserId = this.record.createdId
          ret.afterUserName = this.record.createdName

          ret.productInfoList = params.productInfoList
          ret.invoiceType = params.invoiceType
          ret.needInvoice = params.needInvoice
          ret.needSignet = params.needSignet
          ret.signDate = moment(params.signDate).format('YYYY-MM-DD')
          ret.address = params.address
          ret.telephone = params.telephone
          ret.bankName = params.bankName
          ret.accountNum = params.accountNum
          ret.freightType = params.freightType
          ret.isTax = params.isTax
          ret.needInvoice = params.needInvoice
          ret.freightAmount = params.freightAmount || 0
          ret.totalAmount = params.totalAmount || 0

          accessoriesAddOrUpdate(ret)
            .then(res => {
              if (res.code === 200) {
                that.spinning = false
                that.visible = false
                that.$message.info(res.msg)
                // that.$emit('filet')
                this.$router.push({ name: 'after-sales-management_Accessories' })
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error(err.message)
            })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleFreightAmountChange(val) {
      this.$nextTick(() => {
        let { productInfoList, freightType, freightAmount } = this.form
        let totalAmount = 0
        productInfoList.map(p => {
          totalAmount += (Number(p.unitPrice) || 0) * (Number(p.quantity) || 0)
        })
        if (+freightType === 1) {
          totalAmount += Number(freightAmount) || 0
        }
        this.form = {
          ...this.form,
          totalAmount
        }
      })
    }
  }
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}
.ant-form-item {
  margin-bottom: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
