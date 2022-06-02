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
      <a-tabs :activeKey="activeKey" :defaultActiveKey="activeKey" @change="tabChange">
        <a-tab-pane tab="采购申请单" :key="1" />
        <a-tab-pane tab="抢单报价" :key="2" />
        <a-tab-pane tab="异议信息" :key="3" />
        <a-tab-pane tab="历史价格信息" :key="4" />
        <a-tab-pane tab="采购信息" :key="5" />
        <a-tab-pane tab="采购进程" :key="6" />
        <a-tab-pane tab="采购合同" :key="7" v-if="detail.contractId" />
        <a-tab-pane tab="变更报价" :key="8" v-if="detail.quotationChange" />
      </a-tabs>

      <div v-show="+activeKey === 1">
        <ApplyView ref="applyView" />
      </div>

      <div v-show="[2, 3, 4].includes(+activeKey)">
        <OfferPriceView ref="offerPriceView" :tagKey="activeKey" />
      </div>

      <div v-show="+activeKey === 5">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          class="ask-price-form-wrapper"
        >
          <h3>采购单号{{ detail.orderNum }}</h3>

          <div class="card-item">
            <div class="__hd">报价信息</div>
            <div class="__bd">
              <table class="custom-table custom-table-border">
                <tr>
                  <td style="width:150px;">供应商名称</td>
                  <td colspan="3">
                    {{ detail.supplierName }}
                  </td>
                </tr>
                <tr>
                  <td style="width:150px;">物料名称</td>
                  <td colspan="3">{{ detail.materialName }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">规格型号</td>
                  <td colspan="3">{{ detail.materialModelType }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">包装方式</td>
                  <td>{{ detail.packageCount }}/{{ detail.packageType }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">品牌型号</td>
                  <td>{{ detail.model }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">最后一次采购单价</td>
                  <td>
                    {{ detail.nowPrice | moneyFormatNumber }}
                  </td>
                </tr>
                <tr>
                  <td style="width:150px;">结算方式</td>
                  <td>{{ { 0: '现款现货', 1: '账期结算' }[detail.settlementMode] }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">发票类型</td>
                  <td>{{ { 1: '不限', 2: '增值税专用发票', 3: '普通发票' }[detail.invoiceType] }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">裸价标准</td>
                  <td>{{ { 1: '含税运', 2: '含税不含运' }[detail.nakedPrice] }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">最新报价</td>
                  <td>
                    {{ detail.lastPrice | moneyFormatNumber }}
                  </td>
                </tr>
                <tr>
                  <td style="width:150px;">物料税率</td>
                  <td>{{ `${detail.materialRate}%` }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">运费税率</td>
                  <td>{{ `${detail.freightRate}%` }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">最低采购数量</td>
                  <td>{{ detail.lowestNum }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">交货周期</td>
                  <td>{{ `${detail.deliveryCycle}天` }}</td>
                </tr>
                <tr>
                  <td style="width:150px;">保质期</td>
                  <td>{{ `${detail.shelfLife}天` }}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="card-item">
            <div class="__hd">采购信息</div>
            <div class="__bd">
              <table class="custom-table custom-table-border">
                <tr>
                  <td style="width:150px;">预计到货日期</td>
                  <td>
                    {{ detail.deliveryDate }}
                  </td>
                </tr>
                <tr>
                  <td style="width:150px;">采购总金额</td>
                  <td>
                    {{ detail.amount | moneyFormatNumber }}
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="card-item">
            <div class="__hd">合同信息</div>
            <div class="__bd">
              <table class="custom-table custom-table-border">
                <tr>
                  <td style="width:150px;">合同条款</td>
                  <td>
                    <div v-if="detail.fileUrl">
                      <a href="javascript:void(0);" @click="docView(detail.fileUrl)">预览合同</a>
                      <a href="javascript:void(0);" style="margin-left:20px;" v-download="detail.fileUrl">下载合同</a>
                    </div>
                    <div v-else>未上传合同信息</div>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="card-item">
            <div class="__hd">采购完成记录列表</div>
            <div class="__bd" v-if="Array.isArray(detail.finishList) && detail.finishList.length > 0">
              <table class="custom-table custom-table-border">
                <tr>
                  <th>完成人</th>
                  <th>完成时间</th>
                  <th>理由</th>
                  <th>审核结果</th>
                </tr>
                <tr v-for="(item, idx) in detail.finishList" :key="idx">
                  <td>{{ item.createdName }}</td>
                  <td>{{ item.createdTime }}</td>
                  <td>{{ item.reason }}</td>
                  <td>{{ { 1: '待审核', 2: '通过', 3: '不通过' }[item.approveStatus] }}</td>
                </tr>
              </table>
            </div>
            <div class="__bd" v-else>暂无数据</div>
          </div>
        </a-form-model>
      </div>

      <div v-show="+activeKey === 6">
        <OrderProcessView ref="orderProcessView" />
      </div>

      <div v-show="+activeKey === 7">
        <a-button type="primary" @click="handlePurchaseContract">查看采购合同</a-button>
      </div>

      <div v-show="+activeKey === 8">
        <template v-if="detail.quotationChange">
          <div class="__hd">变更报价</div>
          <a-card title="详情" size="small">
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">供应商名称：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.supplierName}` }}</a-col>
              <a-col :span="4" class="lbl">结算方式：</a-col>
              <a-col :span="8">{{
                `${{ 0: '现款现货', 1: '账期结算' }[detail.quotationChange.settlementMode]}`
              }}</a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">物料名称：</a-col>
              <a-col :span="8">{{ `${detail.materialName}` }}</a-col>
              <a-col :span="4" class="lbl">发票类型：</a-col>
              <a-col :span="8">{{
                `${{ 0: '不限', 1: '增值税专用发票', 2: '普通发票' }[detail.quotationChange.invoiceType]}`
              }}</a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">规格型号：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.materialModelType}` }}</a-col>
              <a-col :span="4" class="lbl">裸价标准：</a-col>
              <a-col :span="8">{{ `${{ 1: '含税运', 2: '含税不含运' }[detail.quotationChange.nakedPrice]}` }}</a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">包装方式：</a-col>
              <a-col :span="8">{{
                `${detail.quotationChange.packageCount}/${detail.quotationChange.packageType}`
              }}</a-col>
              <a-col :span="4" class="lbl">抢单报价：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.newPrice}` | moneyFormatNumber }}</a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">品牌型号：</a-col>
              <a-col :span="8">
                <div v-for="s in String(detail.quotationChange.model).split(';')">
                  {{ s }}
                </div>
              </a-col>
              <a-col :span="4" class="lbl">物料税率：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.materialRate} %` }}</a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <template v-if="detail.quotationChange.nowPrice">
                <a-col :span="4" class="lbl">最后一次采购单价：</a-col>
                <a-col :span="8">{{ `${detail.quotationChange.nowPrice}` | moneyFormatNumber }}</a-col>
              </template>
              <a-col :span="4" class="lbl">运费税率：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.freightRate} %` }}</a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">最低采购数量：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.lowestNum}` }}</a-col>
              <a-col :span="4" class="lbl">交货周期：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.deliveryCycle} 天` }}</a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">保质期：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.shelfLife} 天` }}</a-col>
              <a-col :span="4"></a-col>
              <a-col :span="8"></a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
              <a-col :span="4" class="lbl">变更人：</a-col>
              <a-col :span="8">{{
                `${detail.quotationChange.createdDepName}/${detail.quotationChange.createdName}`
              }}</a-col>
              <a-col :span="4" class="lbl">变更时间：</a-col>
              <a-col :span="8">{{ `${detail.quotationChange.createdTime}` }}</a-col>
            </a-row>
          </a-card>
        </template>
        <template v-else>
          <span>无</span>
        </template>

        <!-- quotationChange -->
      </div>

      <XdocView ref="xdocView" />
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { orderDetail, orderFinishAudit } from '@/api/procurementModuleManagement'
import XdocView from './XdocView'
import Approval from './Approval'
import ApplyView from '../apply/ApplyView'
import OfferPriceView from './OfferPriceView'
import OrderProcessView from './OrderProcessView'
import moment from 'moment'
export default {
  components: {
    XdocView,
    Approval,
    ApplyView,
    OfferPriceView,
    OrderProcessView
  },
  data() {
    return {
      type: 'view',
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {},
      rules: {},
      cardBordered: true,
      visible: false,
      spinning: false,
      record: {},
      detail: {},
      activeKey: 5
    }
  },
  computed: {
    modalTitle() {
      let m = this.isView ? '查看' : '审批'
      return `${m}采购单`
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
    query(type, record) {
      const that = this
      that.type = type
      that.record = { ...record }
      that.visible = true
      orderDetail({ id: that.record.id })
        .then(res => {
          that.detail = res.data
        })
        .catch(err => {
          that.$message.error(err)
          return null
        })

      that.$nextTick(() => {
        that.$refs.applyView.query({ id: that.record.requestId })

        that.$refs.offerPriceView.query(that.record.quotationId)

        that.$refs.orderProcessView.query(that.record.id)
      })
    },
    handleCancel() {
      this.visible = false
    },
    docView(url) {
      const that = this
      if (!url) {
        that.$message.info('尚未上传文件')
        return
      }
      that.$refs.xdocView.query(url)
    },
    //审批部分
    submitAction(opt) {
      const that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.orderId })
      that.spinning = true
      orderFinishAudit(values)
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
    tabChange(key) {
      this.activeKey = +key
    },
    handlePurchaseContract() {
      this.$router.push({
        name: 'procurement-module-management-purchase-contract-action',
        params: {
          record: { id: this.record.contractId },
          action: 'view',
          from: 'procurement-module-management-purchase-contract'
        }
      })
      return
    }
  }
}
</script>

<style scoped>
.card-item {
  margin-bottom: 10px;
}
.card-item:last-child {
  margin-bottom: 0;
}
.__hd {
  font-weight: 700;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ant-form-item {
  margin-bottom: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
  text-align: left;
}
.ant-alert-with-description.ant-alert-no-icon {
  padding: 5px 20px;
}
</style>
