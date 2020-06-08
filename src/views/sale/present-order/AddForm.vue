<template>
  <a-modal
    :title="modalTitle"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">订单编号</td>
            <td style="width:300px;">
              <span>{{contractNum}}</span>
            </td>
            <td>赠送单编号</td>
            <td>{{presentNum}}</td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>{{isView && record.findCustomerFlag === 0 ? '***' : customerName}}</td>
            <td>销售经理</td>
            <td>{{saleUserName}}</td>
          </tr>
        </table>

        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :scroll="{ x: 2000 }"
          :pagination="false"
          size="middle"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1}}</span>
          </div>
          <div slot="productType" slot-scope="text, record, index">
            <span>{{ record.productType === 0 ? '常规产品' : '非常规产品'}}</span>
          </div>
          <div slot="company" slot-scope="text, record, index">
            <span>{{ getCompanyTxt(record.company)}}</span>
          </div>
          <template slot="deliveryDate" slot-scope="text, record">
            <a-date-picker
              :disabled="!isCreatedUser" 
              placeholder=""
              format="YYYY-MM-DD"
              :value="record.deliveryDate"
              @change="onChangeDate(record,$event)"
            />
          </template>

          <template slot="productStatus" slot-scope="text, record">
            <a-select
              :disabled="!isProducer"
              :value="record.productStatus === null ? undefined :String(record.productStatus)"
              placeholder=""
              @change="productStatusSelectChange(record,$event)"
              style="width:120px;"
            >
              <a-select-option value="0">待生产</a-select-option>
              <a-select-option value="1">现货</a-select-option>
              <a-select-option value="2">已发货</a-select-option>
            </a-select>
          </template>

          <template slot="remarks" slot-scope="text, record">
            <a-textarea
              :disabled="!isProducer"
              placeholder=""
              autosize
              :value="record.remarks"
              @change="remarksSelectChange(record,$event)"
              style="width:180px;"
            />
          </template>
        </a-table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { presentOrderDetail, presentOrderUpdate } from '@/api/receipt'
import moment from 'moment'
import { mapGetters } from 'vuex'

const columns = [
  {
    align: 'center',
    title: '标的名称',
    dataIndex: 'targetName',
    key: 'targetName',
    width: '200px'
  },
  {
    align: 'center',
    title: '产品类别',
    dataIndex: 'productType',
    key: 'productType',
    scopedSlots: { customRender: 'productType' },
    width: '200px'
  },
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    width: '200px'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '200px'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'productStand',
    key: 'productStand',
    width: '200px'
  },
  {
    align: 'center',
    title: '单位',
    dataIndex: 'company',
    key: 'company',
    scopedSlots: { customRender: 'company' },
    width: '70px'
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'count',
    key: 'count',
    width: '70px'
  },
  {
    align: 'center',
    title: '交货日期',
    dataIndex: 'deliveryDate',
    key: 'deliveryDate',
    scopedSlots: { customRender: 'deliveryDate' },
    width: '120px'
  },
  {
    align: 'center',
    title: '产品状态',
    dataIndex: 'productStatus',
    key: 'productStatus',
    scopedSlots: { customRender: 'productStatus' },
    width: '120px'
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    scopedSlots: { customRender: 'remarks' },
    width: '200px'
  }
]

export default {
  name: 'AddForm',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},

      contractNum: '',
      presentNum: '',
      customerName: '',
      saleUserName: '',
      columns: columns,
      dataSource: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '编辑'}`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    },
    isCreatedUser(){ //创建者 可以修改交货日期
      return this.type === 'edit' && this.record.userFlag === 1
    },
    isProducer(){ //生产部人员 可以修改产品状态和备注信息
      return this.type === 'edit' && this.record.userFlag === 2
    }
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.dataReset()
      that.type = type
      that.record = Object.assign({}, record)
      that.form.resetFields()
      await that.initData()

      presentOrderDetail({ presentId: that.record.id }).then(res => {
        that.fillData(res.data)
      })
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async fillData(resultData) {
      let that = this
      that.contractNum = resultData.contractNum
      that.presentNum = resultData.presentNum
      that.customerName = resultData.customerName
      that.saleUserName = resultData.saleUserName
      that.dataSource = resultData.productList.map(item => {
        item.key = item.id
        item.deliveryDate = item.deliveryDate ? that.moment(item.deliveryDate) : undefined
        return item
      })
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      let values = {}
      if (that.isEdit) {
        values.id = that.record.id
      }
      values.presentProductList = that.dataSource.map(item => Object.assign({},item))
      that.spinning = true
      presentOrderUpdate(values)
        .then(res => {
          that.spinning = false
          if (res.code === 200) {
            that.handleCancel()
            that.$message.success('操作成功')
            that.$emit('finish')
          } else {
            that.$message.warning(res.msg)
          }
        })
        .catch(err => {
          that.spinning = false
          that.$message.error('操作失败')
        })
    },
    handleCancel() {
      this.dataReset()
      this.$nextTick(() => (this.visible = false))
    },
    dataReset() {
      this.form.resetFields()
      this.todayList = []
      this.planList = []
      this.fileList = []
    },
    getCompanyTxt(type) {
      let m = {
        0: '套',
        1: '台',
        2: '个',
        3: '块',
        4: '条',
        5: '根',
        6: '张',
        7: '卷'
      }
      return m[type] || '未知'
    },
    // 交货日期的改变
    onChangeDate(record, e) {
      debugger
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === record.key)
      if (target) {
        target['deliveryDate'] = e
        this.dataSource = dataSource
      }
    },
    productStatusSelectChange(record, e) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === record.key)
      if (target) {
        target['productStatus'] = e
        this.dataSource = dataSource
      }
    },
    remarksSelectChange(record, e) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === record.key)
      if (target) {
        target['remarks'] = e.target.value.trim()
        this.dataSource = dataSource
      }
    }
  }
}
</script>
<style scoped>
.report-day-header h2 {
  text-align: center;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
i.wdf-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  font-style: normal;
  line-height: 1;
  content: '*';
}
</style>
