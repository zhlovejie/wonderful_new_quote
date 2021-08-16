<template>
  <a-modal
    :title="modalTitle"
    :width="1250"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <ApplyView ref="applyView" />
      <template v-if="detail.details && Array.isArray(detail.details)">
        <div class="__hd">报价信息</div>
        <a-table
          :columns="columns"
          :dataSource="detail.details"
          :pagination="false"
          size="small"
        >
          <div
            slot="nakedPrice"
            slot-scope="text, record, index"
          >
            {{ {1:'含税运',2:'含税不含运'}[text] }}
          </div>
          <div
            slot="newPrice"
            slot-scope="text, record, index"
          >
            {{ text | moneyFormatNumber }}
          </div>
          <div
            slot="materialRate"
            slot-scope="text, record, index"
          >
            {{ `${text}%` }}
          </div>
          <div
            slot="freightRate"
            slot-scope="text, record, index"
          >
            {{ `${text}%` }}
          </div>

          <div
            slot="deliveryCycle"
            slot-scope="text, record, index"
          >
            {{ `${text}天` }}
          </div>
          <div
            slot="shelfLife"
            slot-scope="text, record, index"
          >
            {{ `${text}天` }}
          </div>
          <div
            slot="createdDepName"
            slot-scope="text, record, index"
          >
            <span>{{ `${record.createdDepName}/${record.createdName}` }}</span>
          </div>

          <div
            slot="extendsDetail"
            slot-scope="text, record, index"
          >
            <a-popover trigger="click" placement="left">
              <template slot="content">
                <a-card
                  title="报价详情"
                  size="small"
                  style="width:320px"
                >
                  <p>供应商：{{`${record.supplierName}`}}</p>
                  <p>规格型号：{{`${record.materialModelType}`}}</p>
                  <p>包装方式：{{`${record.packageType}`}}</p>
                  <p>品牌型号：{{`${record.model}`}}</p>
                  <p>最新采购单价：{{`${record.lastPrice}` | moneyFormatNumber}}</p>
                  <p>结算方式：{{`${{0:'现款现货',1:'账期结算'}[record.settlementMode]}`}}</p>
                  <p>发票类型：{{`${{1:'不限',2:'增值税专用发票',3:'普通发票'}[record.invoiceType]}`}}</p>
                  <p>裸价标准：{{`${{0:'含税运',1:'含税不含运'}[record.nakedPrice]}`}}</p>
                  <p>最新报价：{{`${record.newPrice}` | moneyFormatNumber}}</p>
                  <p>物料税率：{{`${record.materialRate} %`}}</p>
                  <p>运费税率：{{`${record.freightRate} %`}}</p>
                  <p>最低采购数量：{{`${record.lowestNum}`}}</p>
                  <p>交货周期：{{`${record.deliveryCycle} 天`}}</p>
                  <p>保质期：{{`${record.shelfLife} 天`}}</p>
                </a-card>
                <a-card
                  title="异常信息"
                  size="small"
                  style="width:320px"
                  v-if="record.exception"
                >
                  <table>
                    <tr>
                      <td>抢单报价</td>
                      <td>报价单价</td>
                      <td>{{`${record.newPrice}` | moneyFormatNumber}}</td>
                      <td>报价人</td>
                      <td>{{`${record.createdDepName} / ${record.createdName}`}}</td>
                      <td>报价时间</td>
                      <td>{{`${record.createdTime}`}}</td>
                    </tr>
                    <tr>
                      <td>最新报价</td>
                      <td>报价单价</td>
                      <td>{{`${record.exception.newPrice}` | moneyFormatNumber}}</td>
                      <td>报价人</td>
                      <td>{{`${record.exception.npDepName} / ${record.exception.npCreater}`}}</td>
                      <td>报价时间</td>
                      <td>{{`${record.exception.npCreateTime}`}}</td>
                    </tr>
                  </table>

                  <p>处理方式：{{`${ {1:'重抢',2:'重新报价采购'}[record.exception.disposeType] }`}}</p>
                  <p>抢单时长：{{`${record.exception.grabTime} 分钟`}} 公示时长：{{`${record.exception.publicityTime} 分钟`}}</p>
                  <p>处理理由：{{`${record.exception.reason}`}}</p>
                  <p>处理人：{{`${record.exception.processor}`}} 处理时间：{{`${record.exception.reason}`}}</p>
                </a-card>
              </template>
              <a href="javascript:void(0);">详情信息</a>
            </a-popover>
          </div>

        </a-table>
      </template>

      <template v-if="detail.history && Array.isArray(detail.history)">
        <div class="__hd">历史价格信息</div>
        <a-table
          :columns="columnsHistory"
          :dataSource="detail.history"
          :pagination="false"
          size="small"
        >
          <div
            slot="nakedPrice"
            slot-scope="text, record, index"
          >
            {{ {1:'含税运',2:'含税不含运'}[text] }}
          </div>
          <div
            slot="newPrice"
            slot-scope="text, record, index"
          >
            {{ text | moneyFormatNumber }}
          </div>
          <div
            slot="materialRate"
            slot-scope="text, record, index"
          >
            {{ `${text}%` }}
          </div>
          <div
            slot="freightRate"
            slot-scope="text, record, index"
          >
            {{ `${text}%` }}
          </div>

          <div
            slot="deliveryCycle"
            slot-scope="text, record, index"
          >
            {{ `${text}天` }}
          </div>
          <div
            slot="shelfLife"
            slot-scope="text, record, index"
          >
            {{ `${text}天` }}
          </div>
        </a-table>
      </template>
    </a-spin>
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>
<script>
import {
  quotationAdd,
  quotationDetail,
  quotationDetailForUpdate,
  quotationApproval
} from '@/api/procurementModuleManagement'

import ApplyView from '../apply/ApplyView'
import Approval from '../apply/Approval'
const columns = [
  {
    title: '供应商',
    dataIndex: 'supplierName'
  },
  {
    title: '裸价标准',
    dataIndex: 'nakedPrice',
    scopedSlots: { customRender: 'nakedPrice' }
  },
  {
    title: '最新报价',
    dataIndex: 'newPrice',
    scopedSlots: { customRender: 'newPrice' }
  },
  {
    title: '物料税率',
    dataIndex: 'materialRate',
    scopedSlots: { customRender: 'materialRate' }
  },
  {
    title: '运费税率',
    dataIndex: 'freightRate',
    scopedSlots: { customRender: 'freightRate' }
  },
  {
    title: '最低采购数量',
    dataIndex: 'lowestNum'
  },
  {
    title: '交货周期',
    dataIndex: 'deliveryCycle',
    scopedSlots: { customRender: 'deliveryCycle' }
  },
  {
    title: '保质期',
    dataIndex: 'shelfLife',
    scopedSlots: { customRender: 'shelfLife' }
  },
  {
    title: '报价人',
    dataIndex: 'createdDepName',
    scopedSlots: { customRender: 'createdDepName' }
  },
  {
    title: '详情',
    scopedSlots: { customRender: 'extendsDetail' }
  }
]

const columnsHistory = [
  {
    title: '供应商',
    dataIndex: 'supplierName'
  },
  {
    title: '裸价标准',
    dataIndex: 'nakedPrice',
    scopedSlots: { customRender: 'nakedPrice' }
  },
  {
    title: '最新报价',
    dataIndex: 'newPrice',
    scopedSlots: { customRender: 'newPrice' }
  },
  {
    title: '物料税率',
    dataIndex: 'materialRate',
    scopedSlots: { customRender: 'materialRate' }
  },
  {
    title: '运费税率',
    dataIndex: 'freightRate',
    scopedSlots: { customRender: 'freightRate' }
  },
  {
    title: '最低采购数量',
    dataIndex: 'lowestNum'
  },
  {
    title: '交货周期',
    dataIndex: 'deliveryCycle',
    scopedSlots: { customRender: 'deliveryCycle' }
  },
  {
    title: '保质期',
    dataIndex: 'shelfLife',
    scopedSlots: { customRender: 'shelfLife' }
  }
]

export default {
  components: {
    ApplyView,
    Approval
  },
  data() {
    return {
      columns,
      columnsHistory,
      cardBordered: true,
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {
        requestApply: {
          exception: []
        },
        details: [],
        history: []
      },
      detailUpdate: {}
    }
  },
  computed: {
    modalTitle() {
      const type = this.type
      const t = type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '审批'
      return `${t}物料报价单`
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      if (that.isView) {
        return null
      }  else if (that.isApproval) {
        btn.push(
          h(
            'a-button',
            { key: 'no-pass', on: { click: that.noPassAction }, props: { loading: that.spinning } },
            '不通过'
          )
        )
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.record = { ...record }
      that.visible = true

      const [d1, d2] = await Promise.all([
        quotationDetail({ id: that.record.id })
          .then(res => res.data)
          .catch(err => {
            that.$message.error(err)
            return null
          }),
        quotationDetailForUpdate({ id: that.record.id })
          .then(res => res.data)
          .catch(err => {
            that.$message.error(err)
            return null
          })
      ])
      if (d1 === null || d2 === null) {
        return
      }
      that.detail = d1
      that.detailUpdate = d2

      that.$nextTick(() => {
        that.$refs.applyView.query({ id: that.detail.requestApply.id })
      })
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          const { modelName, modelType } = that.form

          quotationAdd({ ...that.form, model: `${modelName}-${modelType}` })
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    //审批部分
    submitAction(opt) {
      const that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      quotationApproval(values)
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          if(+ res.code === 200){
            that.$emit('finish')
            that.handleCancel()
          }
        })
        .catch((err) => {
          that.spinning = false
          console.log(err)
        })
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    //审批部分
  }
}
</script>

<style scoped>
.__hd {
  font-weight: 700;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
