<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk()">保存</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 20%">收件人姓名</td>
            <td style="width: 30%">{{ record.recipientName }}</td>
            <td style="width: 20%">联系电话</td>
            <td style="width: 30%">{{ record.contactNumber }}</td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>
              {{ recordDetails.customerName }}
            </td>
            <td>收货地址</td>
            <td>{{ record.provinceName }}{{ record.address }}</td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <a-table
            :columns="travelColumns"
            :dataSource="recordDetails.productInfoList"
            :pagination="false"
            bordered
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>

            <div slot="deliveryMode" slot-scope="text, record, index">
              {{ text === 0 ? '自带' : '邮寄' }}
            </div>
            <div slot="footer" slot-scope="text, record, index">
              <div style="text-align: right; font-size: 16px; color: red">
                <span>数量合计：{{ totalPrice }}</span>
              </div>
            </div>
          </a-table>
        </div>
        <div style="margin-top: 20px">
          <h3>物流信息</h3>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="物流名称"
            :prop="'logisticsCode'"
            :rules="{
              required: true,
              message: '请选择物流名称',
            }"
          >
            <a-select :disabled="isDisabled" v-model="form.logisticsCode" placeholder="物流名称">
              <a-select-option v-for="item in Warehouse" :key="item.code" :value="item.code">{{
                item.text
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="物流方式"
            v-if="form.logisticsCode === 'LogisticsName_03'"
            :prop="'logisticsType'"
            :rules="{
              required: true,
              message: '请选择物流方式',
            }"
          >
            <a-select :disabled="isDisabled" v-model="form.logisticsType" placeholder="物流方式">
              <a-select-option :value="0">特惠</a-select-option>
              <a-select-option :value="1">标快</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="付款方式"
            :prop="'paymentMailType'"
            :rules="{
              required: true,
              message: '请选择付款方式',
            }"
          >
            <a-select :disabled="isDisabled" v-model="form.paymentMailType" placeholder="付款方式">
              <a-select-option :value="0">包邮</a-select-option>
              <a-select-option :value="1">到付</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="送货方式"
            :prop="'deliveryType'"
            :rules="{
              required: true,
              message: '请选择送货方式',
            }"
          >
            <a-select :disabled="isDisabled" v-model="form.deliveryType" placeholder="送货方式">
              <a-select-option :value="0">自提</a-select-option>
              <a-select-option :value="1">上门</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="订单号"
            :prop="'orderNum'"
            :rules="{
              required: true,
              message: '请输入订单号',
            }"
          >
            <a-input :disabled="isDisabled" v-model="form.orderNum" />
          </a-form-model-item>
        </div>
        <table v-if="record.status === 1" class="custom-table custom-table-border">
          <tr>
            <td style="width: 20%">处理人</td>
            <td style="width: 30%">{{ form.modifierName }}</td>
            <td style="width: 20%">处理时间</td>
            <td style="width: 30%">{{ form.modifyTime }}</td>
          </tr>
        </table>

        <!-- status -->
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { addAndHandleMailRecord, mailRecordDetail } from '@/api/after-sales-management' //机构名称
import { queryCode } from '@/api/workBox'
export default {
  name: 'BecomingForm',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
      opinionData: [],
      details: {},
      form: {
        logisticsCode: undefined,
        logisticsType: undefined,
        paymentMailType: undefined,
        deliveryType: undefined,
        orderNum: undefined,
      },
      isWarranty: undefined,
      record: {},
      Warehouse: [],
      mobile: '',
      options: [],
      recordDetails: {},
      visible: false,
      spinning: false,
      type: 'add',
      userInfo: this.$store.getters.userInfo,
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '邮寄' : this.isVeiw ? '详情' : '修改'
      return `${txt}`
    },
    isAdd() {
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'view'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isVeiw
    },
    totalPrice() {
      return this.recordDetails.productInfoList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.quantity)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    travelColumns() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 60,
        },
        {
          title: '物料代码',
          dataIndex: 'materialCode',
          width: 150,
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          width: 200,
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          width: 220,
        },
        {
          title: '单位',
          dataIndex: 'company',
        },
        {
          title: '数量',
          dataIndex: 'quantity',
        },
        {
          title: '带货方式',
          scopedSlots: { customRender: 'deliveryMode' },
          width: 120,
        },
      ]
      return baseColumns
    },
  },

  created() {},
  methods: {
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      queryCode({ code: 'LogisticsName_01' })
        .then((res) => {
          this.Warehouse = res.data
        })
        .catch((err) => (this.loading = false))
      if (type !== 'add') {
        mailRecordDetail({ id: record.id }).then((res) => {
          console.log(res.data)
          this.recordDetails = res.data
          this.form = res.data
        })
      }
    },
    handleOk() {
      let that = this
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = that.$_.cloneDeep(that.form || {})
          let react = {
            id: this.recordDetails.id,
            accessoriesId: this.recordDetails.accessoriesId,
            logisticsCode: params.logisticsCode,
            deliveryType: params.deliveryType,
            logisticsType: params.logisticsType,
            paymentMailType: params.paymentMailType,
            orderNum: params.orderNum,
          }

          addAndHandleMailRecord(react)
            .then((res) => {
              if (res.code === 200) {
                that.spinning = false
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('filet')
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
