<template>
  <div class="purchase-contract-step2-wrapper">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="inline">
      <h3>现款现货</h3>

      <a-form-model-item label="全款付款金额(元)" prop="fullTotalMoney">
        <a-input-number
          style="width:200px;"
          v-model="form.fullTotalMoney"
          :min="0"
          :step="1"
          :precision="2"
          @change="handleFullTotalMoney"
        />
      </a-form-model-item>

      <a-table
        :columns="columns"
        :dataSource="form.settlementList"
        :pagination="false"
        size="small"
        :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="percentage" slot-scope="text, record, index">
          <a-form-model-item>
            <a-input-number
              style="width:100%;"
              :value="record.percentage"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              @change="v => handleFreightRate(v, record)"
            />
          </a-form-model-item>
        </div>

        <div slot="paymentDate" slot-scope="text, record, index">
          <a-form-model-item>
            <a-date-picker
              v-model="record.paymentDate"
              valueFormat="YYYY-MM-DD"
              style="width:100%;"
              :allowClear="true"
            />
          </a-form-model-item>
        </div>

        <div slot="remark" slot-scope="text, record, index">
          <a-form-model-item>
            <a-input v-model="record.remark" style="width:100%;" :allowClear="true" />
          </a-form-model-item>
        </div>
      </a-table>

      <h3>账期结算</h3>

      <div style="display:flex;">
        <a-form-model-item label="票到付款周期" prop="paymentCycle">
          <a-input-number style="width:200px;" v-model="form.paymentCycle" :min="1" :step="1" :precision="0" />
        </a-form-model-item>
        <span style="line-height:36px;">天</span>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '结算方式',
    dataIndex: 'moneyTypeText'
  },
  {
    title: '结算比例(%)',
    dataIndex: 'percentage',
    scopedSlots: { customRender: 'percentage' }
  },
  {
    title: '折算金额',
    dataIndex: 'percentageMoeny'
  },
  {
    title: '付款日期',
    dataIndex: 'paymentDate',
    scopedSlots: { customRender: 'paymentDate' }
  },
  {
    title: '备注信息',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  }
]
export default {
  name: 'purchase-contract-step2',
  components: {
    CommonDictionarySelect
  },
  inject: ['addForm'],
  data() {
    return {
      columns,
      form: {
        settlementList: [],
        paymentCycle: undefined,
        fullTotalMoney: undefined
      },
      rules: {
        fullTotalMoney: [{ required: true, message: '请输入全款付款金额', trigger: 'blur' }],
        paymentCycle: [{ required: true, message: '请输入票到付款周期', trigger: 'blur' }]
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  activated() {
    console.log('stop2 activated called...')
    const that = this
    that.form = that.addForm.pick(that.addForm.submitParams, Object.keys(that.form))
    if (that.addForm.isAdd) {
      let { contractSettlements, paymentCycle } = that.addForm.supplierInfo.supplierInfo
      let { __calInfo } = that.addForm.submitParams
      const m = {
        1: '预付款',
        2: '提货款',
        3: '验收款',
        4: '质保金'
      }
      that.form = {
        ...that.form,
        settlementList: contractSettlements.map(item => {
          item.key = that._uuid()
          item.moneyTypeText = m[item.moneyType]
          return item
        }),
        paymentCycle: paymentCycle || undefined,
        fullTotalMoney: __calInfo.total || undefined
      }

      that.handleFullTotalMoney()
    }
  },
  methods: {
    moment,
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      const totalFreightRate = selectedRows.reduce((c, item) => {
        return c + item.freightRate
      }, 0)
      if (totalFreightRate > 100) {
        this.$message.info(`结算比例不能超过100%`)
        return
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.handleFullTotalMoney()
    },
    checkSelection(record) {
      return this.selectedRowKeys.includes(record.key)
    },
    handleFreightRate(v, record) {
      const that = this
      let { fullTotalMoney, settlementList } = that.form
      let _settlementList = [...settlementList]
      let target = _settlementList.find(item => item.key === record.key)
      target.percentage = v
      let rate = v / 100
      target.percentageMoeny = that.$root._f('moneyFormatNumber')(fullTotalMoney * rate)
      that.form = {
        ...that.form,
        settlementList: _settlementList
      }
    },
    handleFullTotalMoney() {
      const that = this
      let f = () => {
        debugger
        let { fullTotalMoney, settlementList } = that.form
        let _settlementList = [...settlementList]
        _settlementList = _settlementList.map(item => {
          item.percentageMoeny = that.$root._f('moneyFormatNumber')((fullTotalMoney * (item.percentage || 0)) / 100)
          return item
        })
        that.form = {
          ...that.form,
          settlementList: _settlementList
        }
      }

      that.$nextTick(() => {
        f()
      })
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        that.$refs.ruleForm.validate(valid => {
          if (valid && !that.validate_self()) {
            let params = { ...that.form }
            console.log(JSON.stringify(params, null, 2))
            resolve({ hasError: false, data: params })
          } else {
            console.log('error submit!!')
            resolve({ hasError: true, data: {} })
            return false
          }
        })
      })
    },
    validate_self() {
      const that = this
      if (that.selectedRows.length === 0) {
        that.$message.info(`请选择结算方式`)
        return true
      }
      const totalRate = that.selectedRows.reduce((c, item) => {
        return c + item.percentage
      }, 0)
      if (totalRate !== 100) {
        that.$message.info(`结算比例尚未达到100%`)
        return true
      }

      for (let i = 0, len = that.selectedRows.length; i < len; i++) {
        const { paymentDate } = that.selectedRows[i]
        if (!paymentDate) {
          that.$message.info(`请选择付款日期`)
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.purchase-contract-step2-wrapper {
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
}
</style>
