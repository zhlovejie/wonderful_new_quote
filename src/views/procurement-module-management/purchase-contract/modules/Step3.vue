<template>
  <div class="purchase-contract-step3-wrapper">
    <h3>交货/验收</h3>
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

        <div slot="materialName" slot-scope="text, record, index">
          <a-popover :title="text" trigger="hover">
            <template slot="content">
              <p>物料名称：{{ record.materialName }}</p>
              <p>物料代码：{{ record.materialCode }}</p>
              <p>规格型号：{{ record.specification }}</p>
              <p>单位：{{ record.subUnit }}</p>
            </template>
            <a href="javascript:void(0);">
              {{ text }}
            </a>
          </a-popover>
        </div>
        <div slot="action" slot-scope="text, record, index">
          <a @click="doAction('view', record)">查看</a>
        </div>
      </a-table>
      <div>
        <a-form-model-item prop="transportType" label="运输方式">
          <a-radio-group v-model="form.transportType">
            <a-radio :value="0">代办运输</a-radio>
            <a-radio :value="1">自提</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </div>
      <div>
        <a-form-model-item prop="transportType" label="备注">
          <a-textarea placeholder="备注" :rows="3" v-model="form.remark" />
        </a-form-model-item>
      </div>
    </a-form-model>

    <QualityStandardView ref="qualityStandardView" :showCopy="false" />
  </div>
</template>

<script>
import moment from 'moment'
import QualityStandardView from '@/views/quality-management/checkInspectionStandardSet/AddForm.vue'

import { checkInspectionStandardSetPage } from '@/api/qualityManagement'

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
    title: '交货期(天)',
    dataIndex: 'deliveryCycle'
  },
  {
    title: '保质期(天)',
    dataIndex: 'shelfLife'
  },
  {
    title: '预计到货日期',
    dataIndex: 'preDeliveryCycle'
  },
  {
    title: '预计质保时间',
    dataIndex: 'preShelfLife'
  },
  {
    title: '验收标准',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'purchase-contract-step3',
  inject: ['addForm'],
  components: {
    QualityStandardView
  },
  data() {
    return {
      columns,
      form: {
        transportType: undefined,
        remark: ''
      },
      rules: {
        transportType: [{ required: true, message: '请选择运输方式', trigger: 'change' }]
      },
      orderList: []
    }
  },
  activated() {
    console.log('stop3 activated called...')
    const that = this
    const { orderList, transportType, remark } = that.addForm.pick(that.addForm.submitParams, [
      'orderList',
      'transportType',
      'remark'
    ])
    that.orderList = that.$_.cloneDeep(orderList).map(item => {
      item.preDeliveryCycle = moment(item.requestTime)
        .add('days', item.deliveryCycle)
        .format('YYYY-MM-DD')
      item.preShelfLife = moment(item.requestTime)
        .add('days', item.shelfLife)
        .format('YYYY-MM-DD')
      return item
    })
    that.form = {
      transportType,
      remark
    }
  },
  methods: {
    moment,
    async doAction(type, record) {
      const that = this
      if (type === 'view') {
        let _record = await that.getRecord(record)
        if (!_record) {
          that.$message.info(`查不到物料代码【${record.materialCode}】的验收标准`)
          return
        }
        that.$refs.qualityStandardView.query('view', _record)
      }
    },
    getRecord(record) {
      return checkInspectionStandardSetPage({
        searchStatus: 3,
        materialCode: record.materialCode,
        current: 1,
        size: 10
      })
        .then(res => {
          if (Array.isArray(res.data.records) && res.data.records.length > 0) {
            return res.data.records[0]
          } else {
            return null
          }
        })
        .catch(err => {
          console.log(err)
          return null
        })
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if (1) {
          let params = { ...that.form }
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
.purchase-contract-step3-wrapper {
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
