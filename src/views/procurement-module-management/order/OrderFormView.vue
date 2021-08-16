<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="ask-price-form-wrapper"
      >
        <h3>采购单号{{detail.orderNum}}</h3>

        <div class="card-item">
          <div class="__hd">报价信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">供应商名称</td>
                <td colspan="3">
                  {{detail.supplierName}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">物料名称</td>
                <td colspan="3">{{detail.materialName}}</td>
              </tr>
              <tr>
                <td style="width:150px;">规格型号</td>
                <td colspan="3">{{detail.materialModelType}}</td>
              </tr>
              <tr>
                <td style="width:150px;">包装方式</td>
                <td>{{detail.packageCount}}/{{detail.packageType}}</td>
              </tr>
              <tr>
                <td style="width:150px;">品牌型号</td>
                <td>{{detail.model}}</td>
              </tr>
              <tr>
                <td style="width:150px;">最新采购单价</td>
                <td>
                  {{detail.lastPrice | moneyFormatNumber}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">结算方式</td>
                <td>{{ {0:'现款现货',1:'账期结算'}[detail.settlementMode] }}</td>
              </tr>
              <tr>
                <td style="width:150px;">发票类型</td>
                <td>{{  {1:'不限',2:'增值税专用发票',3:'普通发票'}[detail.invoiceType]}}</td>
              </tr>
              <tr>
                <td style="width:150px;">裸价标准</td>
                <td>{{ {1:'含税运',2:'含税不含运'}[detail.nakedPrice] }}</td>
              </tr>
              <tr>
                <td style="width:150px;">最新报价</td>
                <td>
                  {{detail.newPrice | moneyFormatNumber}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">物料税率</td>
                <td>{{`${detail.materialRate}%`}}</td>
              </tr>
              <tr>
                <td style="width:150px;">运费税率</td>
                <td>{{`${detail.freightRate}%`}}</td>
              </tr>
              <tr>
                <td style="width:150px;">最低采购数量</td>
                <td>{{detail.lowestNum}}</td>
              </tr>
              <tr>
                <td style="width:150px;">交货周期</td>
                <td>{{`${detail.deliveryCycle}天`}}</td>
              </tr>
              <tr>
                <td style="width:150px;">保质期</td>
                <td>{{`${detail.shelfLife}天`}}</td>
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
                  {{detail.deliveryDate}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">采购总金额</td>
                <td>
                  {{detail.amount | moneyFormatNumber}}
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
                  <a
                    href="javascript:void(0);"
                    @click="docView(detail.fileUrl)"
                  >预览合同</a>
                  <a
                    href="javascript:void(0);"
                    style="margin-left:20px;"
                    v-download="detail.fileUrl"
                  >下载合同</a>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="card-item">
          <div class="__hd">采购完成记录列表</div>
          <div
            class="__bd"
            v-if="Array.isArray(detail.finishList) && detail.finishList.length > 0"
          >
            <table class="custom-table custom-table-border">
              <tr>
                <th>完成人</th>
                <th>完成时间</th>
                <th>理由</th>
                <th>审核结果</th>
              </tr>
              <tr
                v-for="(item,idx) in detail.finishList"
                :key="idx"
              >
                <td>{{item.createdName}}</td>
                <td>{{item.createdTime}}</td>
                <td>{{item.reason}}</td>
                <td>{{ {1:'待审核',2:'通过',3:'不通过'}[item.approveStatus] }}</td>
              </tr>
            </table>
          </div>
          <div class="__bd">暂无数据</div>
        </div>

      </a-form-model>
      <XdocView ref="xdocView" />
    </a-spin>
  </a-modal>
</template>
<script>
import { orderDetail } from '@/api/procurementModuleManagement'
import XdocView from './XdocView'
import moment from 'moment'
export default {
  components: {
    XdocView
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
      detail: {}
    }
  },
  computed: {
    modalTitle() {
      return `查看采购单`
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
