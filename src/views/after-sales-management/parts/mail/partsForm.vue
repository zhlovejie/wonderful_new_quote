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
            <td>收件人姓名</td>
            <td>{{ record.recipientName }}</td>
            <td>联系电话</td>
            <td>{{ record.contactNumber }}</td>
          </tr>
          <tr>
            <td>单位名称</td>
            <td>
              {{ record.unitName }}
            </td>
            <td>收货地址</td>
            <td>{{ record.provinceName }}{{ record.address }}</td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <a-table
            :columns="travelColumns"
            :dataSource="form.productInfoList"
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
            :prop="'logisticsId'"
            :rules="{
              required: true,
              message: '请选择物流名称',
            }"
          >
            <a-select :disabled="isDisabled" v-model="form.logisticsId" placeholder="物流名称">
              <a-select-option v-for="item in Warehouse" :key="item.code" :value="item.code">{{
                item.text
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="物流方式"
            v-if="form.logisticsId === 'LogisticsName_03'"
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
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { approvalAccessoriesManagement, accessoriesManagementDetail } from '@/api/after-sales-management' //机构名称
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
        productInfoList: [],
        logisticsId: undefined,
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
      return this.form.productInfoList.reduce((addr, item) => {
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
          width: 100,
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          width: 100,
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
          width: 150,
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
      this.form.handlerUser = record.saleUserId
      queryCode({ code: 'LogisticsName_01' })
        .then((res) => {
          this.Warehouse = res.data
        })
        .catch((err) => (this.loading = false))
      if (type !== 'add') {
        accessoriesManagementDetail({ id: record.id }).then((res) => {
          this.details = res.data
          this.form = { ...this.form, ...res.data }
          this.isTax = res.data.isTax === 0 ? true : false
          this.isAdopt = res.data.handlerResult === 0 || res.data.handlerResult === null ? true : false
          // this.form.mailRecord = res.data.mailRecord
        })
      }
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let ret = {}
          const params = that.$_.cloneDeep(that.form || {})
          // params.mailRecord.province = params.mailRecord.province.toString()

          approvalAccessoriesManagement(ret)
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