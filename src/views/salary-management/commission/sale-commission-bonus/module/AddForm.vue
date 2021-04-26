<template>
  <a-modal
    :title="modalTitle"
    :width="1450"
    :visible="visible"
    @cancel="handleCancel"
    :footer="footer"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning" class="commission-order-addForm-wrapper">
      <h2 style="text-align: center" v-html="headerTitle" />
      <h3 v-html="headerTotalTitle" />
      <template v-if="salerBounsDetailVoList.length > 0">
      <a-table
        bordered
        v-for="item in salerBounsDetailVoList"
        :key="item.key"
        :title="() => item.departmentName"
        :columns="columns"
        :dataSource="item.salerBounsDetailListVoList"
        :pagination="false"
        size="small"
        style="margin-top: 20px"
      />
      </template>
      <template v-else>
        none....
      </template>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  approvalSalaryMonthInstanceApply,
  exportSalaryExcel,
  getOaSalarySalerBounsApplyDetail,
} from '@/api/commissionDetail'
import Approval from './Approval'
import moment from 'moment'
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

export default {
  name: 'commission-order-addForm',
  components: {
    Approval,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      month: '',
      dictionaryList: [],
      allAmount: 0,
      salerBounsDetailVoList: [],
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'view' ? '查看' : this.type === 'approval' ? '审批' : '未知'
    },
    isView() {
      return this.type === 'view'
    },
    isApproval() {
      return this.type === 'approval'
    },
    footer() {
      const that = this
      const h = that.$createElement
      let buttons = []

      if (that.isApproval) {
        buttons.push(
          h(
            'a-button',
            {
              key: 'approval-pass',
              props: {
                type: 'primary',
              },
              on: {
                click: that.passAction,
              },
            },
            '通过'
          )
        )
        buttons.push(
          h(
            'a-button',
            {
              key: 'approval-nopass',
              props: {
                type: 'primary',
              },
              on: {
                click: that.noPassAction,
              },
            },
            '不通过'
          )
        )
        return h('div', {}, buttons)
      } else {
        return null
      }
    },
    columns() {
      let baseColumns = [
        // {
        //   title: '部门',
        //   dataIndex: 'departmentName',
        //   moneyFormat: false,
        // },
        {
          title: '岗位',
          dataIndex: 'stationName',
          moneyFormat: false,
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          moneyFormat: false,
        },
        {
          title: '实际收款(元)',
          dataIndex: 'receiveAmountBigDecimal',
          moneyFormat: true,
        },
        {
          title: '基本工资',
          dataIndex: 'salaryBigDecimal',
          moneyFormat: true,
        },
        {
          title: '总提成奖金(元)',
          dataIndex: 'allPercentageBigDecimal',
          moneyFormat: true,
        },
        {
          title: '产品提成差额(元)',
          dataIndex: 'subAmountBigDecimal',
          moneyFormat: true,
        }

      ]

      if (this.dictionaryList.length > 0) {
        this.dictionaryList.map((item) => {
          baseColumns.push({ title: item.text, dataIndex: item.code, moneyFormat: true })
        })
      }

      return baseColumns.map((item) => {
        item.key = uuid()
        return item
      })
    },
    headerTotalTitle() {
      let f = this.$root._f('moneyFormatNumber')
      let str = `总提成(元)：${f(this.allAmount)}&nbsp;&nbsp;`
      this.salerBounsDetailVoList.map((item) => {
        str += `${item.departmentName}(元)：${f(item.allPercentageBigDecimal)} &nbsp;&nbsp;`
      })
      return str
    },
    headerTitle() {
      return this.month ? `${moment(this.month).format('YYYY年MM月份')}提成奖金统计表` : '-'
    },
  },
  methods: {
    init(opt) {
      const that = this
      that.month = ''
      that.dictionaryList = []
      that.allAmount = 0
      that.salerBounsDetailVoList = []
      that.spinning = true
      getOaSalarySalerBounsApplyDetail(opt)
        .then((res) => {
          that.spinning = false
          let { month, dictionaryList, allAmount, salerBounsDetailVoList } = res.data
          that.month = month
          that.dictionaryList = dictionaryList
          that.allAmount = allAmount
          that.salerBounsDetailVoList = salerBounsDetailVoList.map((item) => {
            if (Array.isArray(item.salerBounsDetailListVoList) && item.salerBounsDetailListVoList.length > 0) {
              item.salerBounsDetailListVoList = item.salerBounsDetailListVoList.map((detail) => {
                // 字段提升一层
                if (Array.isArray(detail.dicList) && detail.dicList.length > 0) {
                  detail.dicList.map((dic) => {
                    detail[dic.bounsDicCode] = dic.bounsAmountBigDecimal
                  })
                }
                detail.key = uuid()
                // 格式化数字
                that.columns.map((col) => {
                  if (col.moneyFormat) {
                    // detail[col.dataIndex] = that.$root._f('moneyFormatNumber')(detail[col.dataIndex])
                    detail[col.dataIndex] = detail[col.dataIndex]
                      ? that.$root._f('moneyFormatNumber')(detail[col.dataIndex])
                      : '-'
                  }
                })
                return detail
              })
            }
            item.key = uuid()
            return item
          })
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(err.message)
        })
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = { ...record }
      let { id } = record
      this.$nextTick(() => {
        this.init({ applyId: id })
      })
    },
    handleCancel() {
      this.visible = false
    },

    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      approvalSalaryMonthInstanceApply(values)
        .then((res) => {
          that.spinning = false
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
  line-height: 40px;
}
.custom-table-border tfoot {
  font-weight: bold;
  color: red;
}

.commission-order-addForm-wrapper >>> .ant-empty-normal {
  margin: 0;
}
</style>
