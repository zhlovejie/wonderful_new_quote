<template>
  <div class="purchase-contract-step1-wrapper">
    <h3>产品信息</h3>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <div class="sub-title" v-if="addForm.isChange">未变动部分</div>
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
          <template v-if="addForm.isChange">
            <span>{{text}}</span>
          </template>
          <template v-else>
            <a-input-number
              :disabled="addForm.isDisabled"
              :key="record.key"
              style="width:100px;"
              placeholder="采购量"
              :value="record.purchaseNum"
              :min="record._sourcePurchaseNum"
              :max="999999999999999"
              :step="1"
              :precision="0"
              @change="e => handlePurchaseNumChange(e, record)"
            />
          </template>
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
          <template v-if="addForm.isChange">
            <a v-if="+record.purchaseProgress < 8" @click="doAction('del', record)">删除</a>
            <span style="color:red;" v-else>已完结</span>
          </template>
          <template v-else-if="addForm.isDisabled">
            <span>-</span>
          </template>
          <template v-else>
            <a @click="doAction('del', record)">删除</a>
          </template>
        </div>
      </a-table>
      <div v-if="!addForm.isChange">
        <a-button
          v-if="!addForm.isDisabled"
          style="width: 100%"
          type="dashed"
          icon="plus"
          @click="doAction('add', { key: 'orderList' })"
          >添加</a-button
        >
      </div>

      <template v-if="addForm.isChange">
        <div class="sub-title">变动部分</div>
        <a-table :columns="columns" :dataSource="orderListForChange" :pagination="false" size="small">
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
              :key="record.key"
              style="width:100px;"
              placeholder="采购量"
              :value="record.purchaseNum"
              :min="record._sourcePurchaseNum"
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
            <a-divider type="vertical" />
            <a @click="doAction('refresh', record)">刷新</a>
          </div>
        </a-table>
        <a-button style="width: 100%" type="dashed" icon="plus" @click="doAction('add', { key: 'orderListForChange' })"
          >添加</a-button
        >
      </template>
      <div class="calc-wrapper sub-title">
        <div>
          <span>运费(人民币)：{{ calInfo.freightFullAmount | moneyFormatNumber }}</span>
          <!-- <span>(</span>
          <span>运费：{{ calInfo.freightFullAmount | moneyFormatNumber }}</span>
          <span>税率：{{ calInfo.freightRate }}%</span>
          <span>)</span> -->
        </div>
        <div>
          <span>物料(人民币)：{{ calInfo.materialFullAmount | moneyFormatNumber }}</span>
          <!-- <span>(</span>
          <span>物料：{{ calInfo.materialFullAmount | moneyFormatNumber }}</span>
          <span>税率：{{ calInfo.materialRate }}%</span>
          <span>)</span> -->
        </div>
        <h3>
          <span>合计(人民币)：{{ calInfo.totalUpper }}</span>
          <span>({{ calInfo.total | moneyFormatNumber }})</span>
          <span>此价格含税、含运费</span>
        </h3>
      </div>

      <!-- <div v-show="isPurchaseNumChange || addForm.isDisabled"> -->
      <div>
        <a-form-model-item
          prop="changeReason"
          label="变更原因"
          :rules="{
            required: isPurchaseNumChange,
            message: '请输入变更原因',
            trigger: 'blur'
          }"
        >
          <a-textarea placeholder="变更原因" :rows="3" v-model="form.changeReason" :disabled="addForm.isDisabled"/>
        </a-form-model-item>
      </div>
    </a-form-model>

    <SelectOrder ref="selectOrder" @change="handleSelectOrderChange" />
  </div>
</template>

<script>
//数字转大写接口
import { turnTheCapital } from '@/api/contractListManagement'
import { purchaseContractOrderListRefresh } from '@/api/procurementModuleManagement'
import SelectOrder from './SelectOrder'
import moment from 'moment'
let base_columns = [
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
    scopedSlots: { customRender: 'action' },
    width: 150
  }
]
export default {
  name: 'purchase-contract-step1',
  components: {
    SelectOrder
  },
  inject: ['addForm'],
  data() {
    this.handlePurchaseNumChange = this.$_.debounce(this.handlePurchaseNumChange, 800)
    return {
      // columns,
      form: {
        changeReason: ''
      },
      rules: {},
      orderList: [],
      orderListForChange: [],
      changeReason: '', // changeReason
      calInfo: {}
    }
  },
  computed: {
    isPurchaseNumChange() {
      let keyName = this.addForm.isChange ? 'orderListForChange' : 'orderList'
      let case1 = !!this[keyName].find(o => o._sourcePurchaseNum !== o.purchaseNum)
      console.log(case1)
      return case1
    },
    columns(){
      let _base_columns = [...base_columns]
      if(this.addForm.isDisabled){
        return _base_columns.slice(0,-1)
      }
      return _base_columns
    }
  },
  activated() {
    console.log('stop1 activated called...')
    const that = this
    const { orderList,__isChange, changeReason,signDate } = that.addForm.pick(that.addForm.submitParams, ['orderList','__isChange', 'changeReason','signDate'])

    that.form = {
      changeReason
    }
    // console.log(JSON.stringify(that.form, null, 2))
    if (that.addForm.isAdd) {
      let _orderList = that.$_.cloneDeep(that.addForm.selectedRows || [])
      that.orderList = _orderList.map(o => {
        o.key = that._uuid()
        o.purchaseNum = o.requestNum || 0
        o._sourcePurchaseNum = o._sourcePurchaseNum || o.purchaseNum
        o.amount = Number(o.newPrice || 0) * o.purchaseNum
        o.amountText = that.$root._f('moneyFormatNumber')(o.amount)

        o.deliveryDate = moment(o.requestTime)
          .add('days', o.deliveryCycle)
          .format('YYYY-MM-DD HH:mm:ss')
        o.shelfLifeTime = moment(o.requestTime)
          .add('days', o.shelfLife)
          .format('YYYY-MM-DD HH:mm:ss')

        return o
      })
    } else {
      if(__isChange){
        that.orderList = that.$_.cloneDeep(orderList.filter(o => o.isChange === 0))
        that.orderListForChange = that.$_.cloneDeep(orderList.filter(o => o.isChange === 1))
      }else{
        let _baseOrderList = that.$_.cloneDeep(orderList || []).map(o => {
          let obj = { ...o }
          obj.key = that._uuid()
          // o.purchaseNum = o.requestNum || 0
          // o.amount = Number(o.newPrice || 0) * o.purchaseNum
          obj._sourcePurchaseNum = obj._sourcePurchaseNum || obj.purchaseNum
          obj.amountText = that.$root._f('moneyFormatNumber')(obj.amount)
          obj.isChange = obj.isChange || 0
  
          obj.deliveryDate = moment(obj.requestTime || signDate)
            .add('days', obj.deliveryCycle)
            .format('YYYY-MM-DD HH:mm:ss')
          obj.shelfLifeTime = moment(obj.requestTime || signDate)
            .add('days', obj.shelfLife)
            .format('YYYY-MM-DD HH:mm:ss')
          return obj
        })
  
        that.orderList = _baseOrderList.map(o => {
          return {...o,isChange:0,key:that._uuid()}
        })
  
        if(that.addForm.isChange){
          that.orderListForChange = _baseOrderList.map(o => {
            return {...o,isChange:1,key:that._uuid()}
          })
        }
      }
    }
    that.$nextTick(() => {
      that.calc()
    })
  },

  methods: {
    moment,
    doAction(type, record) {
      const that = this
      let keyName = type === 'add' ? record.key : that.getKeyName(record.key)
      let orderList = [...that[keyName]]
      if (type === 'add') {
        orderList.push({
          key: that._uuid(),
          requestApplyNum: '',
          _isNew: true
        })
        that[keyName] = orderList
      } else if (type === 'del') {
        that[keyName] = orderList.filter(o => o.key !== record.key)
        that.$nextTick(() => {
          that.calc()
        })
      } else if (type === 'refresh') {
        that.addForm.spinning = true
        purchaseContractOrderListRefresh({ requestId: record.requestId })
          .then(res => {
            that.addForm.spinning = false
            let data = res.data || {}
            let orderList = [
              ...that.orderListForChange.filter(r => r.key !== record.key),
              ...[data].map(o => {
                o.key = that._uuid()
                o.purchaseNum = o.requestNum || 0
                o._sourcePurchaseNum = o._sourcePurchaseNum || o.purchaseNum
                o.amount = Number(o.newPrice || 0) * o.purchaseNum
                o.amountText = that.$root._f('moneyFormatNumber')(o.amount)
                o.isChange = 1
                return o
              })
            ]
            that.orderListForChange = that.$_.cloneDeep(orderList)

            that.$nextTick(() => {
              that.calc()
            })
          })
          .catch(err => {
            that.addForm.spinning = false
            that.$message.info(err.message)
          })
      }
    },
    handleSelectOrder(record) {
      this.$refs.selectOrder.query(record)
    },
    handleSelectOrderChange({ decoratorKey, selectedRows }) {
      const that = this
      // that.$_.cloneDeep(orderList)
      let keyName = that.getKeyName(decoratorKey.key)
      let orderList = [
        ...that[keyName].filter(r => r.key !== decoratorKey.key),
        ...selectedRows.map(o => {
          o.key = that._uuid()
          o.purchaseNum = o.requestNum || 0
          o._sourcePurchaseNum = o._sourcePurchaseNum || o.purchaseNum
          o.amount = Number(o.newPrice || 0) * o.purchaseNum
          o.amountText = that.$root._f('moneyFormatNumber')(o.amount)
          return o
        })
      ]
      that[keyName] = that.$_.cloneDeep(orderList)

      that.$nextTick(() => {
        that.calc()
      })
    },
    handlePurchaseNumChange(val, record) {
      const that = this
      if(+val < +record._sourcePurchaseNum){
        that.$message.info(`采购数量必须大于需求数量`)
        return
      }
      let keyName = that.getKeyName(record.key)
      let orderList = [...that[keyName]]
      let target = orderList.find(o => o.key === record.key)
      target.purchaseNum = val || 0
      target.amount = Number(target.newPrice || 0) * target.purchaseNum
      target.amountText = that.$root._f('moneyFormatNumber')(target.amount)
      that[keyName] = orderList

      that.$nextTick(() => {
        that.calc()
      })
    },

    getKeyName(key) {
      const { orderList, orderListForChange } = this
      if (orderList.find(o => o.key === key)) {
        return 'orderList'
      }
      if (orderListForChange.find(o => o.key === key)) {
        return 'orderListForChange'
      }
      throw new Error(`getParentName error:${JSON.stringify(record, null, 2)}`)
    },
    async calc() {
      const that = this
      let { taxType, freightType, freightRate, materialRate, freightFullAmount } = that.addForm.submitParams

      let _freightRate = freightRate || 0
      let _materialRate = materialRate || 0
      let _freightFullAmount = freightFullAmount || 0
      const hasTax = +taxType === 1
      const hasFreight = +freightType === 1

      let new_freightRate = hasFreight ? _freightRate : 0
      let new_materialRate = hasTax ? _materialRate : 0

      let materialAmount = 0
      that.orderList.map(o => {
        materialAmount += o.amount || 0
        return o
      })

      that.orderListForChange.map(o => {
        materialAmount += o.amount || 0
        return o
      })

      let calInfo = {
        freightFullAmount: _freightFullAmount,
        freightFullAmountWithTax: _freightFullAmount + _freightFullAmount * (new_freightRate / 100),
        freightTaxAmount: _freightFullAmount * (new_freightRate / 100),
        materialFullAmount: materialAmount,
        materialFullAmountWithTax: materialAmount + materialAmount * (new_materialRate / 100),
        materialTaxAmount: materialAmount * (new_materialRate / 100),
        hasTax,
        hasFreight,
        freightRate: _freightRate,
        new_freightRate,
        materialRate: _materialRate,
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
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = {
              orderList: [...that.orderList,...that.orderListForChange],
              __isChange:that.addForm.isChange,
              changeReason: that.form.changeReason,
              __calInfo: that.calInfo,
              totalAmount: that.calInfo.total
            }
            console.log(JSON.stringify(params, null, 2))
            resolve({ hasError: false, data: params })
          } else {
            console.log('error submit!!')
            resolve({ hasError: true, data: {} })
            return false
          }
        })
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
  .sub-title {
    margin-top: 10px;
    font-size: 16px;
    padding: 10px 0;
  }
}
</style>
