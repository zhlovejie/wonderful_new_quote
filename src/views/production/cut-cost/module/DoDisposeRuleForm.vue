<template>
  <a-modal
    :title="modalTitle"
    :width="500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <div class="add-form-wrapper">
        <a-table :columns="columns" :dataSource="dataSource" :pagination="false" size="small">
          <div slot="allocationProportion" slot-scope="text, record, index">
            <template v-if="isView">
              <span>{{record.allocationProportion | NumberFormat}}</span>
            </template>
            <template v-else>
              <a-input-number
                style="width:80px;"
                :min="0"
                :max="100"
                :step="1"
                :precision="0"
                :value="record.allocationProportion"
                @change="priceChange($event,'allocationProportion',record)"
              />
            </template>
          </div>
          <div slot="bonus" slot-scope="text">{{text | moneyFormatNumber}}</div>
        </a-table>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { depreciateUserListByApply ,depreciateRecordUserListByDetail} from '@/api/production/cutCost'
import moment from 'moment'

const columns = [
  {
    align: 'center',
    title: '人员',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '奖金分配比例(%)',
    dataIndex: 'allocationProportion',
    scopedSlots: { customRender: 'allocationProportion' }
  },
  {
    align: 'center',
    title: '提成额(元)',
    dataIndex: 'bonus',
    scopedSlots: { customRender: 'bonus' }
  }
]

export default {
  name: 'DoDisposeRuleForm',
  components: {},
  data() {
    return {
      visible: false,
      actionType: 'add',
      spinning: false,
      columns: columns,
      dataSource: [],
      record: {},
      detail: {}
    }
  },
  computed: {
    modalTitle() {
      return '参与人员金额分配'
    },
    isView() {
      return this.actionType === 'view'
    },
    isUse() {
      return this.actionType === 'use'
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      return Promise.all([])
    },
    async handleOk() {
      let that = this
      let _allocationProportion = this.dataSource.reduce((calc, item) => {
        calc += parseInt(item.allocationProportion,10) || 0
        return calc
      }, 0)

      if (_allocationProportion !== 100) {
        that.$message.info('检测到奖金分配比例未达到100%')
        return
      } 

      that.$emit('finish', { ...that.record }, [...that.dataSource])
      that.handleCancel()
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.dataSource = []
      await that.init()
      that.visible = true

      //debugger
      // if (Array.isArray(record.users)) {
      //   that.dataSource = record.users.map(item => {
      //     let _item = Object.assign({}, item)
      //     _item.key = Math.random()
      //       .toString(16)
      //       .slice(-10)
      //     _item.userName = _item.userName || '-'
      //     return _item
      //   })
      // } else {
        that.spinning = true
        let _api = (that.record.withdrawState || 0) === 0 && (that.record.approveState || 0) === 0 
            ? depreciateUserListByApply({ applyId: that.record.applyId })
            : depreciateRecordUserListByDetail({detailId:that.record.id})
        _api.then(res => {
            that.spinning = false
            console.log(res)
            that.dataSource = res.data.map(item => {
              let _item = Object.assign({}, item)
              _item.key = Math.random()
                .toString(16)
                .slice(-10)
              _item.userName = _item.userName || '-'
              return _item
            })
          })
          .catch(err => {
            console.log(err)
            that.spinning = false
          })
      //}
    },

    priceChange(val, fieldName, record) {
      let _dataSource = [...this.dataSource]
      let target = _dataSource.find(item => item.key === record.key)
      if (target) {
        target[fieldName] = parseInt(val) || 0
        this.dataSource = _dataSource
        this.calcPrice()
      }
    },
    calcPrice() {
      //debugger
      let _bonus = parseFloat(this.record.bonus) || 0
      let _dataSource = [...this.dataSource]
      _dataSource.map(item => {
        //降本奖励金额
        item.bonus = (parseInt(item.allocationProportion, 10) / 100) * _bonus
      })
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>