<template>
  <div>
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
    </div>
    <a-card class="card" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item hidden>
              <a-input v-decorator="['contractId']" />
            </a-form-item>
            <a-form-item label="收款编号">
              <a-input
                read-only="read-only"
                placeholder="请输入收款编号"
                v-decorator="[
                  'receiptCode',
                  { rules: [{ required: true, message: '请输入收款编号', whitespace: true }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="合同编号">
              <a-input read-only="read-only" placeholder="请选择合同编号" v-decorator="['contractNum']" />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="客户名称">
              <a-input
                read-only="read-only"
                placeholder="请选择客户名称"
                v-decorator="[
                  'customerName',
                  { rules: [{ required: true, message: '请选择客户名称', whitespace: true }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="负责人">
              <a-input disabled placeholder="请输入负责人" v-decorator="['saleUserName']" />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="收款账号">
              <a-input
                read-only="read-only"
                disabled
                placeholder="请输入帐号"
                v-decorator="[
                  'payNumber',
                  { rules: [{ required: true, message: '请选择客户名称', whitespace: true }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="收款日期">
              <a-input read-only="read-only" v-decorator="['receiptTime']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :span="6">
            <a-form-item label="本次收款金额">
              <a-input
                :precision="2"
                :min="0"
                v-decorator="['paidMoney', { rules: [{ required: false, message: '请输入本次收款金额' }] }]"
                read-only="read-only"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="销售出库时间">
              <a-select
                disabled
                v-decorator="[
                  'outBoundTime',
                  { initialValue: 2, rules: [{ required: true, message: '请选择选择销售出库时间' }] },
                ]"
              >
                <a-select-option :value="1">2021年1月1日前发货</a-select-option>
                <a-select-option :value="2">2021年1月1日后发货</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="是否存在抵扣">
              <a-select
                disabled
                v-decorator="[
                  'isDeduction',
                  { initialValue: 0, rules: [{ required: true, message: '请选择是否存在抵扣' }] },
                ]"
              >
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!-- <a-col :span="7" :offset="1">
            <a-form-item label="备注">
              <a-input read-only="read-only" placeholder="请输入备注信息" v-model = "remark" />
            </a-form-item>
          </a-col> -->
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="结算方式">
              <a-input read-only="read-only" v-decorator="['payTypeName']" />
            </a-form-item>
          </a-col>
          <a-col :span="1"> </a-col>
          <a-col :span="7">
            <a-form-item label="备注">
              <a-input read-only="read-only" placeholder="请输入备注信息" v-model="remark" />
            </a-form-item>
          </a-col>
          <a-col :span="1"> </a-col>
          <a-col :span="7">
            <a-form-item label="收款凭证">
              <a-upload
                disabled
                :action="uploadUrl"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="fileList.length < 3">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传凭证</div>
                </div>
              </a-upload>
              <a-modal title="查看" :visible="previewVisible" :footer="null" @cancel="previewCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-form-item>
          </a-col>
          <!-- <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24" v-if="showadd">
            <a-form-item label="抵扣单据">
              <a-input
                read-only="read-only"
                :precision="2"
                :min="0"
                v-decorator="[
                  'saleAdvancesId',
                  { rules: [{ required: true, message: '请输入抵扣单据', whitespace: true }] },
                ]"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col
            :xl="{ span: 7, offset: 1 }"
            :lg="{ span: 8 }"
            :md="{ span: 12 }"
            :sm="24"
            v-if="showDeduction && showadd"
          >
            <a-form-item label="抵扣金额">
              <a-input
                read-only="read-only"
                :precision="2"
                :min="0"
                v-decorator="['deductionMoney', { rules: [{ required: true, message: '请输入抵扣金额' }] }]"
                style="width: 100%"
              />
            </a-form-item>
          </a-col> -->
        </a-row>
      </a-form>

      <a-table
        :columns="column"
        :dataSource="dataSource"
        :scroll="{ x: 2000 }"
        :pagination="false"
        :loading="memberLoading"
        bordered
      >
        <div slot="order" slot-scope="text, record, index">
          <span v-if="record.id === -1000">合计</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div slot="currency" slot-scope="text, record, index">
          <span>人民币</span>
        </div>

        <div slot="freightCharge" slot-scope="text, record, index">
          {{ record.freightCharge || 0 }}
        </div>
      </a-table>
      <!-- <a-row>
        <a-col :span="24" class="basic-vice-tit" justify="center">
          备注
          <a-form-item>
            <a-input disabled  placeholder="请输入备注信息" v-model = "remark" />
          </a-form-item>
        </a-col>
      </a-row> -->
      <!-- <a-row>
        <a-col :span="24" class="basic-vice-tit" justify="center">总订货清单</a-col>
      </a-row>
      <a-table
        :columns="columns"
        :dataSource="dataSourceContract"
        :pagination="false"
        rowKey="id"
        :loading="memberLoading"
        bordered
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="productType" slot-scope="text, record, index">
          <span v-if="text == 0">常规产品</span>
          <span v-if="text == 1">非常规产品</span>
        </div>
        <div slot="company" slot-scope="text, record, index">
          <span v-if="text == 0">套</span>
          <span v-if="text == 1">台</span>
          <span v-if="text == 2">个</span>
        </div>
      </a-table>
      <a-row>
        <a-col :span="24" class="basic-vice-tit" justify="center">已发货清单</a-col>
      </a-row>
      <a-table
        :columns="columns"
        :dataSource="dataSourceDelivered"
        :pagination="false"
        rowKey="id"
        :loading="memberLoading"
        bordered
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="productType" slot-scope="text, record, index">
          <span v-if="text == 0">常规产品</span>
          <span v-if="text == 1">非常规产品</span>
        </div>
        <div slot="company" slot-scope="text, record, index">
          <span v-if="text == 0">套</span>
          <span v-if="text == 1">台</span>
          <span v-if="text == 2">个</span>
        </div>
      </a-table>
      <a-row>
        <a-col :span="24" class="basic-vice-tit" justify="center">未发货清单</a-col>
      </a-row>
      <a-table
        :columns="columns"
        :dataSource="dataSourceUnshipped"
        :pagination="false"
        rowKey="id"
        :loading="memberLoading"
        bordered
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="productType" slot-scope="text, record, index">
          <span v-if="text == 0">常规产品</span>
          <span v-if="text == 1">非常规产品</span>
        </div>
        <div slot="company" slot-scope="text, record, index">
          <span v-if="text == 0">套</span>
          <span v-if="text == 1">台</span>
          <span v-if="text == 2">个</span>
        </div>
      </a-table> -->
      <div class="wdf-xyk">
        <div class="xyk-div">
          <span>创建人:</span>
          <span>{{ createdName }}</span>
        </div>
        <div class="xyk-div">
          <span>创建日期:</span>
          <span>{{ createTime }}</span>
        </div>

        <div v-if="isApprove" class="xyk-div">
          <span>审批人:</span>
          <span>{{ approveName }}</span>
        </div>
        <div v-if="isApprove" class="xyk-div">
          <span>审批日期:</span>
          <span>{{ approveTime }}</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import EditableCell from '@/components/Table/EditableCell'
import { receiptDetail, getContractOne, getAccountBankList, save } from '@/api/receipt'
import ReceiptSaleContract from './ReceiptSaleContract'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { getDeliverProductList, getContractById, getUnshipped } from '@/api/delayedPayment'
import { getUploadPath2, getAreaByParent } from '@/api/common'
let uuid = () => Math.random().toString(32).slice(-10)
const data = []
export default {
  name: 'ReceiptVue',
  components: {
    AFormItem,
    ReceiptSaleContract,
    EditableCell,
  },
  data() {
    return {
      fileList: [],
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      uploadUrl: getUploadPath2(),
      form: this.$form.createForm(this),
      showadd: false,
      showDeduction: false,
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      createdName: '',
      createTime: '',
      approveTime: '',
      approveName: '',
      isApprove: false,
      contractId: '',
      remark: '',
      info: '',
      dataSourceContract: [], //合同产品列表
      dataSourceDelivered: [], //已发货产品列表
      dataSourceUnshipped: [], //未发货产品列表
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '标的名称',
          dataIndex: 'targetName',
          width: '200px',
        },
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' },
          width: '200px',
        },
        {
          title: '产品代码',
          dataIndex: 'productStandard',
          scopedSlots: { customRender: 'productStandard' },
          width: '200px',
        },
        {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' },
          width: '80px',
        },
        {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
          width: '80px',
        },
        {
          title: '总金额',
          dataIndex: 'amountMoney',
          scopedSlots: { customRender: 'amountMoney' },
          width: '150px',
        },
      ],
      column: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: '200px',
        },
        // {
        //   title: '产品类型',
        //   dataIndex: 'productType',
        //   width: '200px',
        // },
        {
          title: '产品代码',
          dataIndex: 'productModel',
          width: '200px',
        },
        {
          title: '金额',
          dataIndex: 'countMoney',
          width: '150px',
        },
        // {
        //   title: '结算方式',
        //   dataIndex: 'paidType',
        //   scopedSlots: { customRender: 'payType' },
        //   width: '100px',
        // },
        // {
        //   title: '运费(元)',
        //   dataIndex: 'freightCharge',
        //   scopedSlots: { customRender: 'freightCharge' },
        //   width: '150px',
        // },
        {
          title: '已收金额(元)',
          dataIndex: 'receivable',
          width: '150px',
        },
        {
          title: '本次实收金额(元)',
          dataIndex: 'paidMoney',
          width: '150px',
        },
        {
          title: '结算折扣金额(元)',
          dataIndex: 'settlementDiscount',
          width: '150px',
        },
        {
          title: '币种',
          dataIndex: 'currency',
          scopedSlots: { customRender: 'currency' },
          width: '100px',
        },
        {
          title: '币率',
          dataIndex: 'currencyRate',
          width: '100px',
        },
      ],
      dataSource: [],
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象
    }
  },
  mounted() {
    this.init()
    //this.getContract()
  },
  methods: {
    previewCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      // debugger
      // 上传中、完成、失败都会调用这个函数。
      // fileList = fileList.slice(-1)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          // 成功
          console.log('file.response.data[0]', file.response.data[0])
          this.form.setFieldsValue({ url: file.response.data[0].url })
          this.form.setFieldsValue({ showPic: file.response.data[0].pic })
        }
      } else if (file.status === 'removed') {
        // 删除清空
        this.form.setFieldsValue({ url: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    // 编辑表格
    onCellChange(key, dataIndex, value) {
      console.log('onCellChange key dataIndex value', JSON.stringify(key), dataIndex, value)
      const dataSource = [...this.dataSource]
      const target = dataSource.find((item) => item.id === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    init() {
      receiptDetail({ id: this.$route.params.id }).then((res) => {
        console.log('res  ' + JSON.stringify(res))
        this.createdName = res.data.createName
        this.createTime = res.data.createTime
        this.contractId = res.data.contractId
        this.remark = res.data.remark
        if (res.data.evidenceUrl != null && res.data.evidenceUrl.length > 0) {
          let react = res.data.evidenceUrl.split(',')
          this.fileList = react.map((i) => {
            return {
              uid: uuid(),
              name: i.substr(41, 300),
              status: 'done',
              url: i,
            }
          })
        }
        if (res.data.receiptStatus > 1) {
          this.isApprove = true
          this.approveName = res.data.approveName
          this.approveTime = res.data.approveTime
        }
        const data = {
          receiptCode: res.data.receiptCode,
          contractNum: res.data.contractNum,
          customerName: res.data.saleCustomerName,
          payTypeName: res.data.payTypeName,
          saleUserName: res.data.saleUserName,
          payNumber: res.data.payNumber,
          receiptTime: res.data.receiptTime.substring(0, 10),
          paidMoney: res.data.paidMoney,
        }
        if (res.data.isDeduction === 1) {
          this.showadd = true
          this.showDeduction = true
        }
        let arr = {
          saleAdvancesId: res.data.advancesCode,
          outBoundTime: res.data.outBoundTime,
          isDeduction: res.data.isDeduction,
          deductionMoney: res.data.deductionMoney,
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...arr })
        })
        // 根据合同id获取合同信息
        const parameter = { id: res.data.contractId }
        getContractById(parameter)
          .then((res) => {
            this.info = res.data
            // 把获取到的合同信息放入表中
            this.setDataSource()
          })
          .catch((error) => {
            console.error(error)
          })
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...data })
        })

        //产品列表加上合计信息
        let aggregate = res.data.detailsList.reduce((obj, item) => {
          obj.countMoney = obj.countMoney || 0
          obj.countMoney += item.countMoney || 0

          obj.freightCharge = obj.freightCharge || 0
          obj.freightCharge += item.freightCharge || 0

          obj.receivable = obj.receivable || 0
          obj.receivable += item.receivable || 0

          obj.paidMoney = obj.paidMoney || 0
          obj.paidMoney += item.paidMoney || 0

          obj.settlementDiscount = obj.settlementDiscount || 0
          obj.settlementDiscount += item.settlementDiscount || 0

          return obj
        }, {})
        aggregate.id = -1000
        //console.log(aggregate)

        this.dataSource = res.data.detailsList
        this.dataSource.push(aggregate)
      })
    },
    add(res) {
      // const data = {"receiptCode"}
    },
    openModel() {
      console.log('openModel click')
      this.$refs.receiptContract.query()
    },
    setDataSource() {
      // 添加合同产品
      const listProduct = []
      for (const productKey in this.info.product) {
        const product = this.info.product[productKey]
        // debugger
        listProduct.push({
          id: product.id,
          targetName: product.targetName,
          productType: product.productType,
          productStandard: product.contractProductPo.productModel,
          company: product.company,
          count: product.count,
          amountMoney: Number(product.count * product.unitPrice).toFixed(2),
        })
      }
      this.dataSourceContract = listProduct
      //this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProduct))
      //debugger
      this.dataSourceUnshipped = listProduct.map((item) => Object.assign({}, item)).filter((item) => item.count > 0)
      this.setDelivered()
    },

    setDelivered() {
      // 根据合同id添加已发产品
      // 根据发货单id获取已发货产品
      const parameter = { receiptId: this.$route.params.id }
      getUnshipped(parameter)
        .then((res) => {
          const listProductDelivered = []
          for (const productKey in res.data) {
            const product = res.data[productKey]
            listProductDelivered.push({
              invoiceProductId: product.invoiceProductId,
              targetName: product.targetName,
              productType: product.productType,
              productStandard: product.productStandard,
              company: product.company,
              count: product.count,
              amountMoney: product.amountMoney,
            })
          }
          this.dataSourceDelivered = listProductDelivered
        })
        .then(() => {
          // Do something
          this.setUnshipped()
        })
        .catch(() => {
          // Do something
        })
        .finally(() => {
          // Do something
        })
    },

    // 计算未发货产品
    setUnshipped() {
      // debugger
      for (let i = 0; i < this.dataSourceUnshipped.length; i++) {
        for (let j = 0; j < this.dataSourceDelivered.length; j++) {
          if (this.dataSourceUnshipped[i].id == this.dataSourceDelivered[j].invoiceProductId) {
            this.dataSourceUnshipped[i].count = this.dataSourceUnshipped[i].count - this.dataSourceDelivered[j].count
            this.dataSourceUnshipped[i].amountMoney =
              this.dataSourceUnshipped[i].amountMoney - this.dataSourceDelivered[j].amountMoney
          }
        }
      }

      this.dataSourceUnshipped = this.dataSourceUnshipped.filter((item) => item.count > 0)
      console.log('this.dataSourceUnshipped', this.dataSourceUnshipped)
      console.log('this.dataSource', this.dataSource)
    },

    // 返回
    goBackPricing() {
      // 点击返回，返回核价单列表页
      // this.$router.push({ name: 'receiptList', params: { queryParam: this.$route.params.queryParam } })
      // this.$destroy('ReceiptVue')
      this.$router.go(-1)
    },
    writeAccountNum(record) {
      const data = { accountNum: record.bankNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    addClick() {
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('values :' + JSON.stringify(values))
          console.log('datasource :' + JSON.stringify(this.dataSource))
          var money = Number(0)
          for (const key in this.dataSource) {
            money += Number(this.dataSource[key].paidMoney)
          }
          this.$set(values, 'receiptDetails', this.dataSource)
          this.$set(values, 'paidMoney', money)
          console.log('json values :', JSON.stringify(values))
          save(values).then((res) => {})
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
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

.wdf-xyk {
  margin: 20px auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.xyk-div span:nth-child(2) {
  margin-left: 10px;
}
</style>
