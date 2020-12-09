<template>
  <a-spin :spinning="spinning">
    <div>
      <div class="top-right clearfix">
        <a-button v-if="type == 2" class="fl-r" type="primary" @click="addClick" :loading="loading" icon="check"
          >通过</a-button
        >
        <a-button v-if="type == 2" class="fl-r" type="primary" @click="receiptClick" :loading="loading" icon="close"
          >不通过</a-button
        >
        <a-button v-if="isEdit" class="fl-r" type="primary" @click="editClick" :loading="loading" icon="check"
          >重新提交</a-button
        >
        <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
        <a-button class=" fl-r btn btn-primary" icon="download" @click="getPdf('pdfDom')">导出调试任务单</a-button>
      </div>

      <a-card class="card sales-task-wrapper" :bordered="false" id="pdfDom">
        <h2 :style="{ textAlign: 'center' }">产品调试任务单</h2>
        <a-form :form="form" class="form">
          <a-form-item hidden>
            <a-input v-decorator="['customerId']" />
            <a-input v-decorator="['invoiceId']" />
            <a-input v-decorator="['id']" />
            <a-input v-decorator="['contractId']" />
            <a-input v-decorator="['presentId']" />
            <a-input v-decorator="['afterType']" />
          </a-form-item>
          <div class="ant-table">
            <table class="table">
              <tr>
                <td>任务单编号</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only placeholder="请输入收款编号" v-decorator="['aftersaleCode']" />
                  </a-form-item>
                </td>
                <td>合同/赠送单(编号)</td>
                <td>
                  <a-form-item>
                    <a-input
                      class="wdf-xyk"
                      read-only
                      :disabled="true"
                      @click="openModel"
                      placeholder="请选择合同编号/赠送单编号"
                      v-decorator="['contractNum']"
                    />
                  </a-form-item>
                </td>
              </tr>

              <tr>
                <td>客户名称</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['customerName']" />
                  </a-form-item>
                </td>
                <td>公司地址</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['customerAddress']" />
                  </a-form-item>
                </td>
              </tr>

              <tr>
                <td>销售联系人</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['trueName']" />
                  </a-form-item>
                </td>
                <td>联系电话</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['saleUserMobile']" />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>选择发货单</td>
                <td colspan="3" class="txt-left">
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['invoiceCode']" />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>需求说明</td>
                <td colspan="3" class="txt-left">
                  <a-form-item>
                    <a-textarea placeholder="请输入调试单需求" :rows="2" v-decorator="['demandRemark']" />
                  </a-form-item>
                </td>
              </tr>

              <!-- <tr>
          <td>选择发货单</td>
          <td>
            <a-form-item>
              <a-input class="wdf-xyk" read-only v-decorator="[ 'invoiceCode']"/>
            </a-form-item>
          </td>
          <td>项目地址</td>
          <td>
            <a-form-item>
              <a-input class="wdf-xyk" read-only v-decorator="[ 'address']"/>
            </a-form-item>
          </td>
              </tr>-->

              <!-- <tr>
          <td>发货时间</td>
          <td>
            <a-form-item>
              <a-input class="wdf-xyk" read-only v-decorator="[ 'deliveryTime' ]"/>
            </a-form-item>
          </td>
          <td>联系人</td>
          <td>
            <a-form-item>
              <a-input class="wdf-xyk" read-only v-decorator="[ 'consignee']"/>
            </a-form-item>
          </td>
              </tr>-->

              <!-- <tr>
          <td>联系电话</td>
          <td>
            <a-form-item>
              <a-input class="wdf-xyk" read-only v-decorator="[ 'contactInformation']"/>
            </a-form-item>
          </td>
          <td>项目需求</td>
          <td>
            <a-form-item>
              <template v-if="isEdit">
                <a-textarea :style="{resize:'none'}" key="demandRemark_1" class="wdf-xyk" v-decorator="['demandRemark']"/>
              </template>
              <template v-else>
                <a-textarea :style="{resize:'none'}" key="demandRemark_2" read-only class="wdf-xyk" v-decorator="['demandRemark']"/>
              </template>
            </a-form-item>
          </td>
              </tr>-->
            </table>
          </div>

          <div class="invoice-code-list-wrapper">
            <div class="invoice-code-item ant-table" v-for="(item, index) in invoicsDataSource" :key="index">
              <h5>发货单 - {{ item.invoiceNum }}</h5>
              <table class="table">
                <tr>
                  <td>项目地址</td>
                  <td colspan="3" class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.address.replace(/;/g, ' ')" />
                  </td>
                </tr>
                <tr>
                  <td>发货时间</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.deliveryTime.slice(0, 10)" />
                  </td>
                  <td>联系人</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.consignee" />
                  </td>
                </tr>
                <tr>
                  <td>联系电话</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.contactInformation" />
                  </td>
                  <td>发货备注</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.remarks" />
                  </td>
                </tr>
              </table>
              <a-table :columns="columns" :dataSource="item.products" :pagination="false" bordered>
                <div slot="productType" slot-scope="text">
                  <span v-if="text == 0">常规产品</span>
                  <span v-if="text == 1">非常规产品</span>
                </div>
                <div slot="invoiceCount" slot-scope="text, record">
                  <span>{{ text }}{{ companyFormat(record.company) }}</span>
                </div>
              </a-table>
            </div>
          </div>

          <!-- <a-table

          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="memberLoading"
          bordered
        >
          <div slot="productType" slot-scope="text">
            <span v-if="text==0">常规产品</span>
            <span v-if="text==1">非常规产品</span>
          </div>
          </a-table>-->

          <div class="ant-table">
            <table class="table">
              <tr>
                <td>售后类型</td>
                <td>
                  <a-form-item>
                    <template v-if="isEdit">
                      <a-radio-group class="wdf-xyk" key="aftersaleType_1" v-decorator="['aftersaleType', {}]">
                        <a-radio :value="1">现场调试</a-radio>
                        <a-radio :value="2">远程调试</a-radio>
                      </a-radio-group>
                    </template>
                    <template v-else>
                      <a-radio-group
                        class="wdf-xyk"
                        key="aftersaleType_2"
                        disabled="disabled"
                        v-decorator="['aftersaleType', {}]"
                      >
                        <a-radio :value="1">现场调试</a-radio>
                        <a-radio :value="2">远程调试</a-radio>
                      </a-radio-group>
                    </template>
                  </a-form-item>
                </td>
                <td>时间要求</td>
                <td>
                  <a-form-item>
                    <template v-if="isEdit">
                      <a-date-picker class="wdf-xyk" key="sceneTime_1" v-decorator="['sceneTime']" />
                    </template>
                    <template v-else>
                      <a-input class="wdf-xyk" key="sceneTime_2" read-only v-decorator="['sceneTime']" />
                    </template>
                  </a-form-item>
                </td>
              </tr>

              <tr v-if="isContractOrder">
                <td>是否使用我方平台</td>
                <td colspan="3">{{ usingPlatform === 0 ? '是' : '否' }}</td>
              </tr>

              <tr v-if="usingPlatform === 0 && isContractOrder">
                <td>平台账号</td>
                <td>
                  <template v-if="isEdit">
                    <a-form-item>
                      <a-input class="wdf-xyk" key="platformAccount_1" v-decorator="['platformAccount']" />
                    </a-form-item>
                  </template>
                  <template v-else>
                    <a-form-item>
                      <a-input class="wdf-xyk" key="platformAccount_2" read-only v-decorator="['platformAccount']" />
                    </a-form-item>
                  </template>
                </td>
                <td>密码</td>
                <td>
                  <template v-if="isEdit">
                    <a-form-item>
                      <a-input class="wdf-xyk" key="platformPassword_1" v-decorator="['platformPassword']" />
                    </a-form-item>
                  </template>
                  <template v-else>
                    <a-form-item>
                      <a-input class="wdf-xyk" key="platformPassword_2" read-only v-decorator="['platformPassword']" />
                    </a-form-item>
                  </template>
                </td>
              </tr>

              <tr class="print-hide">
                <td>创建人</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['createdName']" />
                  </a-form-item>
                </td>
                <td>创建时间</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['createdTime']" />
                  </a-form-item>
                </td>
              </tr>

              <tr v-if="approveBoolean">
                <td>审批人</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['approveName']" />
                  </a-form-item>
                </td>
                <td>审批时间</td>
                <td>
                  <a-form-item>
                    <a-input class="wdf-xyk" read-only v-decorator="['approveTime']" />
                  </a-form-item>
                </td>
              </tr>

              <tr v-if="approveBoolean">
                <td>派遣人员</td>
                <td colspan="3">
                  <a-form-item>
                    <a-select
                      class="wdf-xyk"
                      v-decorator="['dispatchUserId', { rules: [{ required: true, message: '请选择派遣人员' }] }]"
                      defaultValue="0"
                    >
                      <a-select-option :key="val.id" v-for="val in dispatchUsers" :value="val.id">{{
                        val.trueName
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </td>
              </tr>
            </table>
          </div>

          <!-- <a-row type="flex" v-if="dispatchBoolean" :class="{'last-border': dispatchBoolean}">
          <a-col class="col-border col-header" :span="3" justify="center" align="middle">派遣人员</a-col>
          <a-col class="col-border" :span="21" justify="center" align="middle">
            <a-form-item>
              <a-select
                disabled="disabled"
                class="wdf-xyk"
                v-decorator="[ 'dispatchUserId', {rules: [{ required: true, message: '请选择派遣人员'}]} ]"
                defaultValue="0">
                <a-select-option :key="val.id" v-for="val in dispatchUsers" :value="val.id">{{ val.trueName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          </a-row>-->

          <div class="ant-table hide debugging-task-sheet-wrapper">
            <table class="table ant-form-item" style="width: 100%">
              <tbody>
                <tr>
                  <td width="15%">调试人</td>
                  <td style="height: 50px"></td>
                  <td width="15%">调试结果(OK/NG)</td>
                  <td style="height: 50px"></td>
                </tr>
                <tr>
                  <td width="15%">调试确认人签字</td>
                  <td style="height: 50px"></td>
                  <td width="15%">验收人联系电话</td>
                  <td style="height: 50px"></td>
                </tr>
                <tr>
                  <td width="15%">验收日期</td>
                  <td style="height: 50px"></td>
                  <td width="15%">验收结果(OK/NG)</td>
                  <td style="height: 50px"></td>
                </tr>
                <tr>
                  <td width="15%">客户意见反馈</td>
                  <td colspan="3">
                    <div style="width: 100%; height: 150px; position: relative">
                      <span style="position: absolute; right: 80px; bottom: 5px">签字:</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="15%">客户满意度</td>
                  <td colspan="3" style="height: 50px">
                    <a-radio-group class="a-radio-group">
                      <a-radio :value="1">非常满意</a-radio>
                      <a-radio :value="2">一般</a-radio>
                      <a-radio :value="3">不满意</a-radio>
                    </a-radio-group>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>注：本表一式3份，销售一份留存，售后一份留存，客户一份留存。</p>
          </div>
        </a-form>

        <!-- <receipt-sale-contract ref="receiptContract" @custom-change="contractChange"></receipt-sale-contract> -->
        <ChoiceOrderFactory ref="receiptContract" @change="contractChange" />
        <a-modal
          title="不通过"
          @ok="handleOk"
          @cancel="handleCancelTwo"
          :confirmLoading="confirmLoadingTwo"
          :maskClosable="false"
          v-model="visibleTwo"
        >
          <a-spin :spinning="confirmLoadingTwo">
            <a-form :form="form2" class="form">
              <a-col>
                <a-form-item label="驳回原因">
                  <a-input
                    placeholder="驳回原因"
                    v-model="rejected"
                    v-decorator="['rejected', { rules: [{ message: '请输入驳回原因', whitespace: true }] }]"
                  />
                  <a-alert v-if="hidden" type="error" message="请输入驳回原因" banner />
                </a-form-item>
              </a-col>
            </a-form>
          </a-spin>
        </a-modal>
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import {
  afterAudit,
  detailById,
  listUserByAfterSale,
  afterUpdate,
  invoiceDetailById,
  listInvoiceByContractId,
  listInvoiceByPresentId,
} from '@/api/after'
import { getContractOne } from '@/api/receipt'
import { presentOrderDetail } from '@/api/receipt'
import moment from 'moment'
//import ReceiptSaleContract from '../receipt/ReceiptSaleContract'
import ChoiceOrderFactory from '@/views/sale/invoice/modules/ChoiceOrderFactory'

//import html2Canvas from 'html2canvas'
//import JsPDF from 'jspdf'
import util from '@/components/_util/util'
import { companyFormat } from '@/utils/util'

export default {
  name: 'AfterVueOfAudit',
  components: {
    //ReceiptSaleContract,
    ChoiceOrderFactory,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      visibleBoolean: false,
      queryBoolean: false,
      usingPlatform: 0,
      invoiceList: [],
      type: 0,
      visibleTwo: false,
      beforeValueBoolean: false,
      hidden: true,
      disabled: true,
      approveBoolean: false,
      dispatchBoolean: false,
      isRejected: 0,
      rejected: '',
      dispatchUsers: [],
      confirmLoadingTwo: false,
      disabledBoolean: true,
      columns: [
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' },
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
        },
        {
          title: '规格型号',
          dataIndex: 'productStandard',
        },
        {
          title: '发货数量',
          dataIndex: 'invoiceCount',
          scopedSlots: { customRender: 'invoiceCount' },
        },
      ],
      dataSource: [],
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象
      sourceAddress: '', //缓存原项目地址 为 xxx;xxx;xxx 格式化为 xxxxxxxxx 来显示用
      invoicsDataSource: [], //多个发货单
      spinning: false,
      afterType: 0, //区分合同订单(0)和赠送订单(1)
      isContractOrder: true,
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'AfterVueOfAudit') {
        this.init()
      }
    },
  },
  mounted() {
    this.init()
  },
  computed: {
    isEdit() {
      //是否驳回重新提交
      let params = this.$route.params
      return params.action && params.action === 'edit'
    },
  },
  methods: {
    init() {
      const paramter = { id: this.$route.params.id }
      this.type = this.$route.params.type
      this.afterType = this.$route.params.afterType
      this.isContractOrder = this.afterType === 0
      // 所有售后人员
      listUserByAfterSale().then((res) => (this.dispatchUsers = res.data))

      detailById(paramter).then((res) => {
        if (this.type === 1 && res.data.dispatchUserId != undefined) {
          this.dispatchBoolean = true
        }
        if (this.type == 2) {
          //第一次审批人id
          if (res.data.approveId == 106) {
            this.disabled = false
            this.dispatchBoolean = false
            this.approveBoolean = false
          } else {
            this.approveBoolean = true
          }
        }

        //test

        //this.approveBoolean = true
        //this.dispatchBoolean = true
        //this.usingPlatform = 0
        const data = {
          aftersaleCode: res.data.aftersaleCode,
          demandRemark: res.data.demandRemark,
          sceneTime: this.isEdit ? moment(res.data.sceneTime) : res.data.sceneTime,
          aftersaleType: res.data.aftersaleType,
          createdName: res.data.createdName,
          createdTime: res.data.createdTime,
          platformAccount: res.data.platformAccount,
          platformPassword: res.data.platformPassword,
          id: paramter.id,
          approveName: res.data.approveName,
          approveTime: res.data.approveTime,
          dispatchUserId: res.data.dispatchUserId,
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...data })
        })

        invoiceDetailById({ id: res.data.invoiceId }).then((res2) => {
          this.invoicsDataSource = res2.data

          this.form.setFieldsValue({
            invoiceCode: this.invoicsDataSource.map((item) => item.invoiceNum).join(','),
          })
          // debugger
          // this.$set(data, 'invoiceCode', res2.data.invoiceNum)
          // this.$nextTick(() => {
          //   this.form.setFieldsValue({ ...data })
          // })
        })

        if (this.afterType === 0) {
          this.fillContract({ contractId: res.data.contractId })
        } else {
          this.fillPresentOrder({ id: res.data.presentId })
        }

        //return
        //this.onOptionClick({ 'id': res.data.invoiceId })
      })
    },
    openModel() {
      const data = { type: 1 }
      this.$refs.receiptContract.query(data)
    },
    contractChange(result) {
      let that = this
      switch (result.selectedKey) {
        case 'invoiceSaleContract':
          that.isContractOrder = true
          that.fillContract(result.record)
          break
        case 'invoicePresentOrder':
          that.isContractOrder = false
          that.fillPresentOrder(result.record)
          break
        default:
          break
      }
    },
    fillContract(data) {
      const paramter = { id: data.contractId }

      this.invoiceList = []
      this.invoiceSelectedItems = []
      this.invoicsDataSource = []
      listInvoiceByContractId(paramter)
        .then((res) => {
          this.invoiceList = res.data
        })
        .catch((err) => {
          console.log(err)
        })
      getContractOne(paramter).then((res) => {
        this.usingPlatform = res.data.usingPlatform
        const record = {
          contractNum: res.data.contractNum,
          customerName: res.data.customerName,
          customerId: res.data.saleCustomer.id,
          trueName: res.data.saleUser.trueName,
          saleUserMobile: res.data.saleUser.mobile,
          contractId: res.data.id,
          totalAmount: res.data.totalAmount,
          refundMoney: res.data.returnedMoney,
          saleContract: res.data.contractId,
          // platformAccount: res.data.platformAccount,
          // platformPassword: res.data.platformPassword,
          paperDetail: 1,
          customerAddress: res.data.saleCustomer.address,
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
          this.form.setFieldsValue({ afterType: 0 })
        })
      })
    },
    //填充赠送订单
    fillPresentOrder(data) {
      let that = this
      listInvoiceByPresentId({ id: data.id }).then((res) => {
        that.invoiceList = res.data
      })
      presentOrderDetail({ presentId: data.id }).then((res) => {
        console.log(res)
        let _data = res.data
        that.form.setFieldsValue({ contractNum: _data.presentNum })
        that.form.setFieldsValue({ customerName: _data.customerName })
        that.form.setFieldsValue({ customerAddress: _data.customerAddress })
        that.form.setFieldsValue({ trueName: _data.saleUserName })
        that.form.setFieldsValue({ saleUserMobile: _data.saleUserMobile })

        that.form.setFieldsValue({ presentNum: _data.presentNum })
        that.form.setFieldsValue({ presentId: _data.id })
        that.form.setFieldsValue({ afterType: 1 })
      })
    },
    // 返回
    goBackPricing() {
      // 点击返回，返回列表页
      this.$router.push({ name: 'afterList' })
      this.$destroy('AfterVueOfAudit')
    },
    writeAccountNum(record) {
      const data = { accountNum: record.bankNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    addClick() {
      console.log('addClick===')
      let that = this
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (this.isRejected == 1) {
            this.$set(values, 'isRejected', 1)
            this.$set(values, 'rejectedText', this.rejected)
          } else {
            this.$set(values, 'isRejected', 0)
          }

          if (that.isRejected == 1) {
            that.confirmLoadingTwo = true
          } else {
            that.spinning = true
          }

          afterAudit(values)
            .then((res) => {
              if (that.isRejected == 1) {
                that.confirmLoadingTwo = true
              } else {
                that.spinning = true
              }
              if (res.code == 200) {
                this.goBackPricing()
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              if (that.isRejected == 1) {
                that.confirmLoadingTwo = true
              } else {
                that.spinning = true
              }
            })
        }
      })
    },
    editClick() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$set(values, 'sceneTime', values.sceneTime.format('YYYY-MM-DD'))
          this.$set(values, 'deliveryTime', '')
          this.$set(values, 'address', that.sourceAddress)

          that.spinning = true
          afterUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                this.goBackPricing()
              } else {
                that.$message.info(res.msg || '未知错误')
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    openModel() {
      this.$refs.receiptContract.query()
    },
    receiptClick() {
      this.hidden = false
      this.visibleTwo = true
      this.beforeValueBoolean = true
    },
    handleOk() {
      this.form2.validateFields((err, values) => {
        if (this.beforeValueBoolean) {
          if (values.rejected === undefined || values.rejected === null || values.rejected === '') {
            this.hidden = true
            this.$message.error('请输入驳回信息')
            return
          }
        }
        this.isRejected = 1
        this.addClick()
      })
    },
    handleCancelTwo() {
      this.form2.resetFields()
    },
    getPdf(id) {
      // 特殊处理打印 input 是有宽度的，内容过多打印不全 用span处理
      let eles = document.querySelectorAll('input,textarea')
      eles &&
        eles.forEach((ele) => {
          if (ele.nodeType !== 1) return
          if (ele.nodeName.toUpperCase() === 'INPUT') {
            if (ele.type === 'radio' || ele.type === 'checkbox') {
              ele.checked && ele.setAttribute('checked', true)
            } else {
              if (ele.value.trim().length > 0) {
                let sp = null
                sp = ele.parentNode.querySelector('span.hide')
                if (sp) {
                  sp.innerText = ele.value
                } else {
                  sp = document.createElement('span')
                  sp.innerText = ele.value
                  sp.classList.add('hide')
                  ele.parentNode.appendChild(sp)
                }
              }
            }
          }
          if (ele.nodeName.toUpperCase() === 'TEXTAREA') {
            if (ele.value.trim().length > 0) {
              let sp = null
              sp = ele.parentNode.querySelector('span.hide')
              if (sp) {
                sp.innerText = ele.value
              } else {
                sp = document.createElement('span')
                sp.innerText = ele.value
                sp.classList.add('hide')
                ele.parentNode.appendChild(sp)
              }
            }
          }
        })

      util.handleWindowPrint(`#${id}`, '产品调试任务单')

      // html2Canvas(document.querySelector(`#${id}`), {
      //   // allowTaint: true
      //   useCORS: true// 看情况选用上面还是下面的，
      // }).then(function (canvas) {
      //   const contentWidth = canvas.width
      //   const contentHeight = canvas.height
      //   const pageHeight = contentWidth / 592.28 * 841.89
      //   let leftHeight = contentHeight
      //   let position = 0
      //   const imgWidth = 595.28
      //   const imgHeight = 592.28 / contentWidth * contentHeight
      //   const pageData = canvas.toDataURL('image/jpeg', 1.0)
      //   const PDF = new JsPDF('', 'pt', 'a4')
      //   if (leftHeight < pageHeight) {
      //     PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      //   } else {
      //     while (leftHeight > 0) {
      //       PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
      //       leftHeight -= pageHeight
      //       position -= 841.89
      //       if (leftHeight > 0) {
      //         PDF.addPage()
      //       }
      //     }
      //   }
      //   PDF.save('产品调试任务单.pdf')
      // }
      // )
    },
    companyFormat: companyFormat,
  },
}
</script>
<style>
.hide {
  display: none;
}

.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  background-color: #fafafa;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 5px;
  text-align: center;
}

.table .txt-left {
  text-align: left;
}
.table .txt-left input {
  border: none;
}

.invoice-code-list-wrapper {
  margin-top: 10px;
}
.invoice-code-list-wrapper .invoice-code-item {
  margin-bottom: 10px;
}
.invoice-code-list-wrapper h5 {
  background-color: #f0f0f0;
  margin: 0;
  padding: 10px 0 10px 20px;
}
</style>

<style  scoped>
.top-right {
  margin-bottom: 12px;
  margin-right: 6px;
}

.clearfix:after {
  display: block;
  content: '';
  width: 100%;
  height: 0;
  clear: both;
}

.clearfix {
  zoom: 1;
}

.fl-r {
  float: right;
  margin-left: 8px;
}

.wdf-row {
  border: 1px solid #ddd;
}

.col-border {
  border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
}

.col-border ~ .col-border {
  border-left: none;
}

.wdf-form {
  margin-top: 12px;
  padding: 12px;
}

.ant-row.ant-form-item {
  margin-bottom: 0;
}

.wdf-xyk {
  width: 50%;
}

.last-border {
  border-bottom: 1px solid #ddd;
}
</style>
