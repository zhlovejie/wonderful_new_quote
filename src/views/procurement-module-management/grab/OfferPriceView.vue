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

      <a-tabs
        :activeKey="activeKey"
        :defaultActiveKey="activeKey"
        @change="tabChange"
      >
        <a-tab-pane tab="采购申请单" :key="1" />
        <a-tab-pane tab="抢单报价" :key="2" />
        <a-tab-pane tab="异议信息" :key="3" />
        <a-tab-pane tab="历史价格信息" :key="4" />
      </a-tabs>

      <div v-show="+activeKey === 1">
      <ApplyView ref="applyView" />
      </div>

      <div v-show="+activeKey === 2">
      <template v-if="detail.detail">
        <div class="__hd">抢单/领单信息</div>
        <a-card
          title="详情"
          size="small"
        >
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >供应商名称：</a-col>
            <a-col :span="8">{{`${detail.detail.supplierName}`}}</a-col>
            <a-col
              :span="4"
              class="lbl"
            >结算方式：</a-col>
            <a-col :span="8">{{`${{0:'现款现货',1:'账期结算'}[detail.detail.settlementMode]}`}}</a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >物料名称：</a-col>
            <a-col :span="8">{{`${detail.materialName}`}}</a-col>
            <a-col
              :span="4"
              class="lbl"
            >发票类型：</a-col>
            <a-col :span="8">{{`${{0:'不限',1:'增值税专用发票',2:'普通发票'}[detail.detail.invoiceType]}`}}</a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >规格型号：</a-col>
            <a-col :span="8">{{`${detail.detail.materialModelType}`}}</a-col>
            <a-col
              :span="4"
              class="lbl"
            >裸价标准：</a-col>
            <a-col :span="8">{{`${{1:'含税运',2:'含税不含运'}[detail.detail.nakedPrice]}`}}</a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >包装方式：</a-col>
            <a-col :span="8">{{`${detail.detail.packageCount}/${detail.detail.packageType}`}}</a-col>
            <a-col
              :span="4"
              class="lbl"
            >抢单报价：</a-col>
            <a-col :span="8">{{`${detail.detail.newPrice}` | moneyFormatNumber}}</a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >品牌型号：</a-col>
            <a-col :span="8">
              <div v-for="s in String(detail.detail.model).split(';')">
                {{s}}
              </div>
            </a-col>
            <a-col
              :span="4"
              class="lbl"
            >物料税率：</a-col>
            <a-col :span="8">{{`${detail.detail.materialRate} %`}}</a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <template v-if="detail.detail.nowPrice">
            <a-col
              :span="4"
              class="lbl"
            >最后一次采购单价：</a-col>
            <a-col :span="8">{{`${detail.detail.nowPrice}` | moneyFormatNumber}}</a-col>
            </template>
            <a-col
              :span="4"
              class="lbl"
            >运费税率：</a-col>
            <a-col :span="8">{{`${detail.detail.freightRate} %`}}</a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >最低采购数量：</a-col>
            <a-col :span="8">{{`${detail.detail.lowestNum}`}}</a-col>
            <a-col
              :span="4"
              class="lbl"
            >交货周期：</a-col>
            <a-col :span="8">{{`${detail.detail.deliveryCycle} 天`}}</a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >保质期：</a-col>
            <a-col :span="8">{{`${detail.detail.shelfLife} 天`}}</a-col>
            <a-col :span="4"></a-col>
            <a-col :span="8"></a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col
              :span="4"
              class="lbl"
            >抢单人：</a-col>
            <a-col :span="8">{{`${detail.detail.createdDepName}/${detail.detail.createdName}`}}</a-col>
            <a-col
              :span="4"
              class="lbl"
            >抢单时间：</a-col>
            <a-col :span="8">{{`${detail.detail.createdTime}`}}</a-col>
          </a-row>
        </a-card>
        <a-card
          title="异常信息"
          size="small"
          v-if="Array.isArray(detail.detail.exception) && detail.detail.exception.length > 0"
        >

          <div v-if="detail.detail.exception.find(item => !item.disposeType)">
              <a-row :gutter="[16,16]">
                <a-col :span="24">
                  <p>异常说明：系统判断系统内最新报价与抢单成功时报价不一致</p>
                </a-col>
              </a-row>
              <a-row :gutter="[16,16]">
                <a-col :span="3">
                  <p>抢单报价</p>
                </a-col>
                <a-col :span="4">
                  <p>报价单价：{{`${detail.detail.newPrice}` | moneyFormatNumber}}</p>
                </a-col>
                <a-col :span="5">
                  <p>报价部门：{{`${detail.detail.createdDepName}`}}</p>
                </a-col>
                <a-col :span="4">
                  <p>报价人：{{`${detail.detail.createdName}`}}</p>
                </a-col>
                <a-col :span="8">
                  <p>报价时间：{{`${detail.detail.createdTime}`}}</p>
                </a-col>
              </a-row>
          </div>

          <div v-for="item in detail.detail.exception.filter(item => !item.disposeType)">
              <a-row :gutter="[16,16]">
                <a-col :span="3">
                  <p>最新报价</p>
                </a-col>
                <a-col :span="4">
                  <p>维护单价：{{`${item.newPrice}` | moneyFormatNumber}}</p>
                </a-col>
                <a-col :span="5">
                  <p>报价部门：{{`${item.npDepName}`}}</p>
                </a-col>
                <a-col :span="4">
                  <p>维护人：{{`${item.npCreater}`}}</p>
                </a-col>
                <a-col :span="8">
                  <p>更新时间：{{`${item.npCreateTime}`}}</p>
                </a-col>
              </a-row>
          </div>

          <template v-if="detail.detail.exception.find(item => !!item.disposeType)">
          <a-row :gutter="[16,16]" v-for="item in detail.detail.exception.filter(item => !!item.disposeType)">
            <a-col :span="6">
              <p>处理方式：{{`${ {1:'重抢',2:'新报价采购'}[item.disposeType] }`}}</p>
            </a-col>
            <template v-if="+item.disposeType === 1">
              <a-col :span="6">
                <p>抢单时长：{{`${item.grabTime} 分钟`}}</p>
              </a-col>
              <a-col :span="6">
                <p>公示时长：{{`${item.publicityTime} 分钟`}}</p>
              </a-col>
            </template>

            <a-col :span="24">
              <p>处理理由：{{`${item.reason}`}}</p>
            </a-col>
            <a-col :span="6">
              <p>处理人：{{`${item.processor}`}}</p>
            </a-col>
            <a-col :span="6">
              <p>处理时间：{{`${item.createdTime || '无'}`}}</p>
            </a-col>
          </a-row>
          </template>
          <template v-else>
            <a-row :gutter="[16,16]">
              <a-col :span="24">
                <p style="color:red;">该异常尚未处理</p>
              </a-col>
            </a-row>
          </template>
        </a-card>
      </template>
      </div>

      <div v-show="+activeKey === 3">
      <template v-if="Array.isArray(detail.objections) && detail.objections.length > 0">
        <div class="__hd">异议信息</div>
        <div
          v-for="(item,idx) in detail.objections"
          :key="item.id"
        >
          <a-card
            :title=" `异议信息${idx + 1}` "
            size="small"
          >
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >供应商名称：</a-col>
              <a-col :span="8">{{`${item.supplierName}`}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >结算方式：</a-col>
              <a-col :span="8">{{`${{0:'现款现货',1:'账期结算'}[item.settlementMode]}`}}</a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >物料名称：</a-col>
              <a-col :span="8">{{`${detail.materialName}`}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >发票类型：</a-col>
              <a-col :span="8">{{`${{0:'不限',1:'增值税专用发票',2:'普通发票'}[item.invoiceType]}`}}</a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >规格型号：</a-col>
              <a-col :span="8">{{`${item.materialModelType}`}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >裸价标准：</a-col>
              <a-col :span="8">{{`${{0:'含税运',1:'含税不含运'}[item.nakedPrice]}`}}</a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >包装方式：</a-col>
              <a-col :span="8">{{`${item.packageType}`}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >最新报价：</a-col>
              <a-col :span="8">{{`${item.newPrice}` | moneyFormatNumber}}</a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >品牌型号：</a-col>
              <a-col :span="8">{{`${item.model}`}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >物料税率：</a-col>
              <a-col :span="8">{{`${item.materialRate} %`}}</a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >最新采购单价：</a-col>
              <a-col :span="8">{{`${item.lastPrice}` | moneyFormatNumber}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >运费税率：</a-col>
              <a-col :span="8">{{`${item.freightRate} %`}}</a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >最低采购数量：</a-col>
              <a-col :span="8">{{`${item.lowestNum}`}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >交货周期：</a-col>
              <a-col :span="8">{{`${item.deliveryCycle} 天`}}</a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >保质期：</a-col>
              <a-col :span="8">{{`${item.shelfLife} 天`}}</a-col>
              <a-col :span="4"></a-col>
              <a-col :span="8"></a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col
                :span="4"
                class="lbl"
              >异议人：</a-col>
              <a-col :span="8">{{`${item.createdDepName}/${item.createdName}`}}</a-col>
              <a-col
                :span="4"
                class="lbl"
              >异议时间：</a-col>
              <a-col :span="8">{{`${item.createdTime}`}}</a-col>
            </a-row>
          </a-card>


          <!-- <template v-if="Array.isArray(item.exception) && item.exception.length > 0">
          <a-card
            title="异常信息"
            size="small"
            v-if="Array.isArray(item.exception) && item.exception.length > 0"
          >

            <a-row :gutter="[16,16]">
              <a-col :span="6">
                <p>报价单价：{{`${item.exception.newPrice}` | moneyFormatNumber}}</p>
              </a-col>
              <a-col :span="6">
                <p>报价部门：{{`${item.exception.npDepName}`}}</p>
              </a-col>
              <a-col :span="6">
                <p>报价人：{{`${item.exception.npCreater}`}}</p>
              </a-col>
              <a-col :span="6">
                <p>报价时间：{{`${item.exception.npCreateTime}`}}</p>
              </a-col>
            </a-row>

            <a-row :gutter="[16,16]" v-if="item.exception.disposeType">
              <a-col :span="6">
                <p>处理方式：{{`${ {1:'重抢',2:'新报价采购'}[item.exception.disposeType] }`}}</p>
              </a-col>
              <template v-if="+item.exception.disposeType === 1">
              <a-col :span="6">
                <p>抢单时长：{{`${item.exception.grabTime} 分钟`}}</p>
              </a-col>
              <a-col :span="6">
                <p>公示时长：{{`${item.exception.publicityTime} 分钟`}}</p>
              </a-col>
              </template>
              <a-col :span="24">
                <p>处理理由：{{`${item.exception.reason}`}}</p>
              </a-col>
              <a-col :span="6">
                <p>处理人：{{`${item.exception.processor}`}}</p>
              </a-col>
              <a-col :span="6">
                <p>处理时间：{{`${item.exception.createdTime || '无'}`}}</p>
              </a-col>
            </a-row>
            <a-row v-else :gutter="[16,16]">
              <a-col :span="24">
                <p style="color:red;">该异常尚未处理</p>
              </a-col>
            </a-row>

          </a-card>
          </template> -->



        </div>
      </template>
      <template v-else>
        <span>无</span>
      </template>
      </div>

      <div v-show="+activeKey === 4">
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
      <template v-else>
        <span>无</span>
      </template>
      </div>

    </a-spin>
    <Approval
      ref="approval"
      @opinionChange="opinionChange"
    />
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
      detailUpdate: {},
      activeKey:2
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
      } else if (that.isApproval) {
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
        that.$refs.applyView.query({ id: that.detail.raId })
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
      const values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      quotationApproval(values)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.$emit('finish')
            that.handleCancel()
          }
        })
        .catch(err => {
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
        opinion: opinion
      })
    },
    //审批部分
    tabChange(key){
      this.activeKey = +key
    }
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
.lbl {
  color: #999;
  text-align: right;
}
p{
  margin: 0;
  padding: 0;
}
</style>

