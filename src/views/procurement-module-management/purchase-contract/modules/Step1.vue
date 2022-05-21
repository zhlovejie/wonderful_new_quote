<template>
  <div class="purchase-contract-step1-wrapper">
    <h3>产品信息</h3>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-table :columns="columns" :dataSource="orderList" :pagination="false" size="small">
        <div slot="order" slot-scope="text, record, index">
          {{ index + 1 }}
        </div>
        <div slot="purchaseNum" slot-scope="text, record, index">
          <a-input-number
            style="width:100px;"
            placeholder="采购量"
            v-model="record.purchaseNum"
            :min="0"
            :max="100"
            :step="1"
            :precision="0"
          />
        </div>
        <div slot="action" slot-scope="text, record, index">
          <a @click="doAction('del', record)">删除</a>
        </div>
      </a-table>
      <a-button style="width: 100%" type="dashed" icon="plus" @click="doAction('add', null)">添加</a-button>
    </a-form-model>

    <div>
      <div>运费(人民币):xxxx (运费:xxxx 运费税率:xxxx)</div>
      <div>物料(人民币):xxxx (物料:xxxx 运费税率:xxxx)</div>
      <h3>合计(人民币):xxxx大写 (xxxxx小写) 此价格含税、含运费</h3>
    </div>

    <div>
      <span>变更原因:</span><br />
      <a-textarea placeholder="变更原因" :rows="3" v-model="remark" />
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '需求采购单号',
    dataIndex: 'requestApplyNum'
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
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
    dataIndex: 'amount'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'purchase-contract-step1',
  components: {},
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
      remark: ''
    }
  },
  activated() {
    console.log('stop1 activated called...')
    const that = this
    that.form = that.addForm.pick(that.addForm.submitParams, ['orderList', 'remark'])
    console.log(JSON.stringify(that.form, null, 2))
    if (that.addForm.isAdd) {
    }
  },
  methods: {
    doAction(type, record) {
      const that = this
      let orderList = [...that.orderList]
      if (type === 'add') {
        orderList.push({
          key: that._uuid(),
          requestApplyNum: 'test123',
          materialCode: 'tet123',
          materialName: 'tet123',
          specification: 'tet123',
          model: 'tet123',
          packageType: 'tet123',
          packageCount: 100,
          requestNum: 1,
          purchaseNum: 2,
          nowPrice: 88,
          newPrice: 88,
          amount: 123
        })
        that.orderList = orderList
      } else if (type === 'del') {
        that.orderList = orderList.filter(o => o.key !== record.key)
      }
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if (1) {
          let params = { orderList: [...that.orderList], remark: that.remark }
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
}
</style>
