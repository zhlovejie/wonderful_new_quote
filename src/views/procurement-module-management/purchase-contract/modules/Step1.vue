<template>
  <div class="purchase-contract-step1-wrapper">
    <h3>产品信息</h3>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-table :columns="columns" :dataSource="orderList" :pagination="false" size="small">
        <div slot="order" slot-scope="text, record, index">
          {{ index + 1 }}
        </div>
        <div slot="requestApplyNum" slot-scope="text, record, index">
          <div v-if="record._isNew">
            <a-button @click="() => handleSelectOrder(record)">选择需求单</a-button>
          </div>
          <div v-else>
            {{ text }}
          </div>
        </div>

        <div slot="purchaseNum" slot-scope="text, record, index">
          <a-input-number
            style="width:100px;"
            placeholder="采购量"
            :value="record.purchaseNum"
            :min="0"
            :max="999999999999999"
            :step="1"
            :precision="0"
            @change="e => handlePurchaseNumChange(e, record)"
          />
        </div>
        <div slot="materialName" slot-scope="text, record, index">
          <a-popover :title="text" trigger="hover">
            <template slot="content">
              <p>物料名称：{{ record.materialName }}</p>
              <p>物料代码：{{ record.materialCode }}</p>
              <p>规格型号：{{ record.specification }}</p>
              <p>单位：{{ record.subUnit }}</p>
            </template>
            <a href="javascript:void(0);" @click="doAction('materialView', record)">
              {{ text }}
            </a>
          </a-popover>
        </div>
        <div slot="action" slot-scope="text, record, index">
          <a @click="doAction('del', record)">删除</a>
        </div>
      </a-table>
      <a-button style="width: 100%" type="dashed" icon="plus" @click="doAction('add', null)">添加</a-button>
    </a-form-model>

    <div class="calc-wrapper">
      <div>
        <span>运费(人民币)：{{ calInfo.freightFullAmountWithTax | moneyFormatNumber }}</span>
        <span>(</span>
        <span>运费：{{ calInfo.freightFullAmount | moneyFormatNumber }}</span>
        <span>税率：{{ calInfo.freightRate }}%</span>
        <span>)</span>
      </div>
      <div>
        <span>物料(人民币)：{{ calInfo.materialFullAmountWithTax | moneyFormatNumber }}</span>
        <span>(</span>
        <span>物料：{{ calInfo.materialFullAmount | moneyFormatNumber }}</span>
        <span>税率：{{ calInfo.materialRate }}%</span>
        <span>)</span>
      </div>
      <h3>
        <span>合计(人民币)：{{ calInfo.totalUpper }}</span>
        <span>({{ calInfo.total | moneyFormatNumber }})</span>
        <span>此价格含税、含运费</span>
      </h3>
    </div>

    <div>
      <span>变更原因:</span><br />
      <a-textarea placeholder="变更原因" :rows="3" v-model="remark" />
    </div>
    <SelectOrder ref="selectOrder" @change="handleSelectOrderChange" />
  </div>
</template>

<script>
//数字转大写接口
import { turnTheCapital } from '@/api/contractListManagement'
import SelectOrder from './SelectOrder'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '需求采购单号',
    dataIndex: 'requestApplyNum',
    scopedSlots: { customRender: 'requestApplyNum' }
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '品牌型号',
    dataIndex: 'model'
  },
  {
    title: '包装方式',
    dataIndex: 'packageType'
  },
  {
    title: '包内数量',
    dataIndex: 'packageCount'
  },
  {
    title: '需求量',
    dataIndex: 'requestNum'
  },
  {
    title: '采购量',
    dataIndex: 'purchaseNum',
    scopedSlots: { customRender: 'purchaseNum' }
  },
  {
    title: '最后一次采购单价',
    dataIndex: 'nowPrice'
  },
  {
    title: '最新报价',
    dataIndex: 'newPrice'
  },
  {
    title: '金额',
    dataIndex: 'amountText'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'purchase-contract-step1',
  components: {
    SelectOrder
  },
  inject: ['addForm'],
  data() {
    return {
      columns,
      form: {
        // contractNum: undefined,
        // supplierName: '',
        // taxType: 0,
        // invoiceType: 1,
        // materialRate: undefined,
        // settlementMode: undefined,
        // freightType: undefined,
        // freightFullAmount: undefined,
        // freightRate: undefined,
        // logisticsTypeId: undefined,
        // logisticsTypeName: undefined,
        // signDate: undefined,
        // purchaseUserName: undefined,
        // purchasePhone: undefined,
        // purchaseUserId: undefined
      },
      rules: {
        // materialRate: [{ required: true, message: '请输入物料税率', trigger: 'blur' }],
        // settlementMode: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
        // freightType: [{ required: true, message: '请选择是否含运费', trigger: 'change' }],
        // freightFullAmount: [{ required: true, message: '请输入运费金额', trigger: 'blur' }],
        // freightRate: [{ required: true, message: '请输入运费税率', trigger: 'blur' }],
        // logisticsTypeId: [{ required: true, message: '请选择货运方式', trigger: 'change' }]
      },
      orderList: [],
      remark: '',
      calInfo: {}
    }
  },
  activated() {
    console.log('stop1 activated called...')
    const that = this
    const { orderList, remark } = that.addForm.pick(that.addForm.submitParams, ['orderList', 'remark'])
    that.orderList = orderList
    that.remark = remark
    // console.log(JSON.stringify(that.form, null, 2))
    if (that.addForm.isAdd) {
      let orderList = that.$_.cloneDeep(that.addForm.selectedRows || [])
      that.orderList = orderList.map(o => {
        o.purchaseNum = o.requestNum || 0
        o.amount = Number(o.newPrice || 0) * o.purchaseNum
        o.amountText = that.$root._f('moneyFormatNumber')(o.amount)
        return o
      })

      that.$nextTick(() => {
        that.calc()
      })
    }
  },
  methods: {
    doAction(type, record) {
      const that = this
      let orderList = [...that.orderList]
      if (type === 'add') {
        orderList.push({
          key: that._uuid(),
          requestApplyNum: '',
          _isNew: true
        })
        that.orderList = orderList
      } else if (type === 'del') {
        that.orderList = orderList.filter(o => o.key !== record.key)
      }
    },
    handleSelectOrder(record) {
      this.$refs.selectOrder.query(record)
    },
    handleSelectOrderChange({ decoratorKey, selectedRows }) {
      const that = this
      let orderList = [
        ...that.orderList.filter(r => r.key !== decoratorKey.key),
        ...selectedRows.map(r => {
          r.key = that._uuid()
          return r
        })
      ]
      that.orderList = orderList
    },
    handlePurchaseNumChange(val, record) {
      debugger
      const that = this
      let orderList = [...that.orderList]
      let target = orderList.find(o => o.key === record.key)
      target.purchaseNum = val || 0
      target.amount = Number(target.newPrice || 0) * target.purchaseNum
      target.amountText = that.$root._f('moneyFormatNumber')(target.amount)
      that.orderList = orderList

      that.$nextTick(() => {
        that.calc()
      })
    },
    async calc() {
      const that = this
      let { taxType, freightType, freightRate, materialRate, freightFullAmount } = that.addForm.submitParams
      const hasTax = +taxType === 1
      const hasFreight = +freightType === 1

      let new_freightRate = hasFreight ? freightRate : 0
      let new_materialRate = hasTax ? materialRate : 0

      let materialAmount = 0
      that.orderList.map(o => {
        materialAmount += o.amount
        return o
      })

      let calInfo = {
        freightFullAmount: freightFullAmount,
        freightFullAmountWithTax: freightFullAmount + freightFullAmount * (new_freightRate / 100),
        freightTaxAmount: freightFullAmount * (new_freightRate / 100),
        materialFullAmount: materialAmount,
        materialFullAmountWithTax: materialAmount + materialAmount * (new_materialRate / 100),
        materialTaxAmount: materialAmount * (new_materialRate / 100),
        hasTax,
        hasFreight,
        freightRate,
        new_freightRate,
        materialRate,
        new_materialRate
      }
      let total = calInfo.freightFullAmountWithTax + calInfo.materialFullAmountWithTax
      let totalUpper = await turnTheCapital({ money: total }).then(res => res.data)
      calInfo = {
        ...calInfo,
        total,
        totalUpper
      }
      that.calInfo = calInfo
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if (1) {
          let params = { orderList: [...that.orderList], remark: that.remark, __calInfo: that.calInfo }
          console.log(JSON.stringify(params, null, 2))
          resolve({ hasError: false, data: params })
        } else {
          console.log('error submit!!')
          resolve({ hasError: true, data: {} })
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.purchase-contract-step1-wrapper {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
  .custom-table tr:nth-child(odd) {
    background-color: #f5f5f5;
  }
  .custom-table {
    th,
    td {
      padding: 5px;
    }
  }
  .calc-wrapper span {
    margin: 0 5px;
  }
}
</style>
