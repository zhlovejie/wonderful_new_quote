<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
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
        <h3>采购单号{{detail.requestApplyNum}}</h3>
        <div class="card-item">
          <div class="__hd">采购需求详情</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">物料名称</td>
                <td colspan="3">{{detail.materialName}}</td>
              </tr>
              <tr>
                <td style="width:150px;">需求数量</td>
                <td >{{detail.requestNum}}</td>
                <td style="width:150px;">需求日期</td>
                <td >{{detail.requestTime}}</td>
              </tr>
              <tr>
                <td style="width:150px;">需求部门</td>
                <td>{{detail.applyDepName}}</td>
                <td style="width:150px;">申请人</td>
                <td>{{detail.proposerName}}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="card-item">
          <div class="__hd">报价信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">供应商名称</td>
                <td colspan="3">
                  {{detail.detail && detail.detail.supplierName}}
                </td>
              </tr>
              <tr>
                <td style="width:150px;">物料名称</td>
                <td colspan="3">{{detail.materialName}}</td>
              </tr>
              <tr>
                <td style="width:150px;">规格型号</td>
                <td colspan="3">{{detail.detail.materialModelType}}</td>
              </tr>
              <tr>
                <td style="width:150px;">包装方式</td>
                <td>{{detail.detail.packageCount}}/{{detail.detail.packageType}}</td>
              </tr>
              <tr>
                <td style="width:150px;">品牌型号</td>
                <td>{{detail.detail.model}}</td>
              </tr>
              <tr>
                <td style="width:150px;">最后一次采购单价</td>
                <td>
                  {{`${form.nowPrice || 0}元`}}
                  <!-- <a-form-model-item prop="lastPrice">
                    <a-input-number
                      placeholder="最新采购单价"
                      v-model="form.lastPrice"
                      style="width:100%;"
                      :min="0"
                      :step="1"
                      :precision="2"
                      :formatter="value => `${value}元`"
                      :parser="value => value.replace('元', '')"
                    />
                  </a-form-model-item> -->
                </td>
              </tr>
              <tr>
                <td style="width:150px;">结算方式</td>
                <td>{{ {0:'现款现货',1:'账期结算'}[detail.detail.settlementMode] }}</td>
              </tr>
              <tr>
                <td style="width:150px;">发票类型</td>
                <td>{{  {1:'不限',2:'增值税专用发票',3:'普通发票'}[detail.detail.invoiceType]}}</td>
              </tr>
              <tr>
                <td style="width:150px;">裸价标准</td>
                <td>{{ {1:'含税运',2:'含税不含运'}[detail.detail.nakedPrice] }}</td>
              </tr>
              <tr>
                <td style="width:150px;">最新报价</td>
                <td>
                  <a-form-model-item prop="newPrice" >
                    {{form.newPrice | moneyFormatNumber}}
                    <!-- <a-input-number
                      placeholder="最新报价"
                      v-model="form.newPrice"
                      style="width:100%;"
                      :min="0"
                      :step="1"
                      :precision="2"
                      :formatter="value => `${value}元`"
                      :parser="value => value.replace('元', '')"
                    /> -->
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">物料税率</td>
                <td>{{`${detail.detail.materialRate}%`}}</td>
              </tr>
              <tr>
                <td style="width:150px;">运费税率</td>
                <td>{{`${detail.detail.freightRate}%`}}</td>
              </tr>
              <tr>
                <td style="width:150px;">最低采购数量</td>
                <td>{{detail.detail.lowestNum}}</td>
              </tr>
              <tr>
                <td style="width:150px;">交货周期</td>
                <td>{{`${detail.detail.deliveryCycle}天`}}</td>
              </tr>
              <tr>
                <td style="width:150px;">保质期</td>
                <td>{{`${detail.detail.shelfLife}天`}}</td>
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
                  <a-form-model-item >
                    {{ (form.deliveryDate && form.deliveryDate.format && form.deliveryDate.format('YYYY-MM-DD HH:mm:ss')) || form.deliveryDate }}
                    <!-- <a-date-picker
                      style="width:100%;"
                      v-model="form.deliveryDate"
                      format="YYYY-MM-DD"
                      placeholder="预计到货日期"
                    /> -->
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">采购总金额</td>
                <td>
                  <a-form-model-item  >
                    {{form.amount | moneyFormatNumber}}
                    <!-- <a-input-number
                      placeholder="采购总金额"
                      v-model="form.amount"
                      style="width:100%;"
                      :min="0"
                      :step="1"
                      :precision="2"
                      :formatter="value => `${value}元`"
                      :parser="value => value.replace('元', '')"
                    /> -->
                  </a-form-model-item>
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
                  <a-form-model-item prop="fileUrl">
                    <UploadFile
                      ref="uploadFile"
                      :config="uploadConfig"
                      @change="(files) => fileChange('fileUrl',files)"
                    />
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { orderAdd, quotationDetail, quotationDetailForUpdate,getOrderLastPrice } from '@/api/procurementModuleManagement'

import UploadFile from './UploadFile'
import moment from 'moment'
export default {
  components:{
    UploadFile
  },
  data() {
    return {
      type: 'add',
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {

      },
      rules: {
        // lastPrice:[{ required: true, message: '请输入最新采购单价' }],
        // newPrice: [{ required: true, message: '请输入最新报价' }],
        // deliveryDate: [{ required: true, message: '请选择预计到货日期' }],
        // amount: [{ required: true, message: '请输入采购总金额' }],
        // fileUrl: [{ required: true, message: '请上传采购合同' }],
      },
      cardBordered: true,
      visible: false,
      spinning: false,
      record: {},
      detail: {
        detail:{},
        objections:[],
        history:[]
      },
      detailUpdate:{},
      uploadConfig: {
        maxFileCount: 1
      },
      materialRequirement:{}, //物料要求
    }
  },
  computed: {
    modalTitle() {
      const type = this.type
      const t = type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '审批'
      return `${t}下单采购`
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
      btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
      btn.push(
        h(
          'a-button',
          {
            key: 'submit',
            on: { click: () => that.handleSubmit() },
            props: { type: 'primary', loading: that.spinning }
          },
          '提交'
        )
      )
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
        console.log(d1,d2)
        if (d1 === null || d2 === null) {
          return
        }

        that.detail = d1
        that.detailUpdate = d2


        //根据物料id获取该物料最新采购价  目前尚未使用
        // let newLastPrice = await getOrderLastPrice({materialId:that.detail.materialId}).then(res => {
        //   if(res && res.code === 200){
        //     return res.data || 0
        //   }else{
        //     that.$message.info(`获取物料最新采购单价失败:${res.msg}`)
        //     return 0
        //   }
        // }).catch(err => {
        //   that.$message.info(`获取物料最新采购单价失败:${err}`)
        //   return 0
        // })
        that.form = {
          // ...that.form,
          requestId: that.detail.raId,
          materialId:that.detail.materialId,
          nowPrice:d2.nowPrice,
          lastPrice:d2.lastPrice,
          newPrice:d2.newPrice,
          packMethod:d2.packageType,
          pageNum:d2.packageCount,
          supplierId:d2.supplierId,
          supplierName:d2.supplierName,
          quotationId:d2.id,
          deliveryDate:moment(d2.modifyTime).add('days',+d2.deliveryCycle),
          amount: that.detail.requestNum * d2.newPrice
        }

    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          let param = {
            ...that.form,
            deliveryDate:moment(that.form.deliveryDate).format('YYYY-MM-DD HH:mm:ss')
          }

          param.newPrice = param.lastPrice

          orderAdd(param)
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
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      this.resetForm()
      this.visible = false
    },
    fileChange(field, files) {
      const that = this
      let _files = files.filter(f => f && f.status === 'done')
      if (_files && _files.length > 0) {
        _files.map((_f, idx) => {
          //_f.url
          that.form = {...that.form,fileUrl:_f.url}
        })
      }
    }
  }
}
</script>

<style scoped>
.card-item {
  margin-bottom: 10px;
}
.card-item:last-child{
  margin-bottom: 0;
}
.__hd {
  font-weight: 700;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ant-form-item{
  margin-bottom: 0;
}
.custom-table-border th, .custom-table-border td{
  padding: 5px;
  text-align: left;
}
.ant-alert-with-description.ant-alert-no-icon{
  padding: 5px 20px;
}
</style>
