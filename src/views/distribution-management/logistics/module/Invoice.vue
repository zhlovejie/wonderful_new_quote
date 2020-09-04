<template>
  <a-modal
    title="新增发货单"
    :width="1250"
    :visible="visible"
    :footer="null"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
        <a-input
          placeholder="客户名称"
          v-model="queryParam.customerName"
          allowClear
          style="width: 200px;margin-right:10px;"
        />
        <a-select
          placeholder="运费结算方式"
          v-model="queryParam.delivery"
          :allowClear="true"
          style="width: 200px;margin-right:10px;"
        >
          <a-select-option :value="1">代付</a-select-option>
          <a-select-option :value="2">包邮</a-select-option>
          <a-select-option :value="3">到付</a-select-option>
        </a-select>
        <a-select
          placeholder="发放方式"
          v-model="queryParam.settlementMethod"
          :allowClear="true"
          style="width: 200px;margin-right:10px;"
        >
          <a-select-option :value="1">客户货站自提</a-select-option>
          <a-select-option :value="2">送货上门</a-select-option>
          <a-select-option :value="3">万德福自提</a-select-option>
        </a-select>
        <a-button style="margin-left:10px;" type="primary" @click="searchAction()">查询</a-button>
      </div>
      <a-layout>
        <!--  此处编写表单中的功能按钮    -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          @change="handleTableChange "
          :pagination="pagination"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="settlementMethod" slot-scope="text">
            <span v-if="text==1">代付</span>
            <span v-if="text==2">包邮</span>
            <span v-if="text==3">到付</span>
          </div>
          <div slot="delivery" slot-scope="text">
            <span v-if="text==1">客户货站自提</span>
            <span v-if="text==2">送货上门</span>
            <span v-if="text==3">万德福自提</span>
          </div>
          <div slot="invoiceNum" slot-scope="text ,record">
            <a @click="InvoiceNumber(record)">{{text}}</a>
          </div>
        </a-table>
      </a-layout>
    </a-card>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { getList } from '@/api/distribution-management'

export default {
  data() {
    return {
      visible: false,
      spinning: false,
      columns: [
        {
          dataIndex: 'name',
          title: '序号',
          key: 'name',
          align: 'center',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '发货编号',
          dataIndex: 'invoiceNum',
          key: 'invoiceNum',
          align: 'center',
          scopedSlots: { customRender: 'invoiceNum' },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          key: 'customerName',
          align: 'center',
        },
        {
          title: '收货地址',
          width: 200,
          dataIndex: 'address',
          key: 'address',
          align: 'center',
        },
        {
          title: '发货时间',
          dataIndex: 'deliveryTime',
          key: 'deliveryTime',
          align: 'center',
        },
        {
          title: '运费结算方式',
          dataIndex: 'delivery',
          key: 'delivery',
          align: 'center',
          scopedSlots: { customRender: 'delivery' },
        },
        {
          title: '发货方式',
          dataIndex: 'settlementMethod',
          key: 'settlementMethod',
          align: 'center',
          scopedSlots: { customRender: 'settlementMethod' },
        },
        {
          title: '运费',
          dataIndex: 'freightCharge',
          key: 'freightCharge',
          align: 'center',
        },
      ],
      dataSource: [],
      pagination: {
        current: 1,
      },

      queryParam: {},
    }
  },

  mounted() {},
  methods: {
    moment: moment,
    init() {
      this.visible = true
      this.searchAction()
    },
    handleCancel() {
      this.visible = false
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      if (this.queryParam.Dates) {
        let date = that.queryParam.Dates.format('YYYYMM')
        this.queryParam.accountDate = date
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination }, opt || {})
      getList(_searchParam)
        .then((res) => {
          that.loading = false
          this.queryParam.accountDate = ''
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    InvoiceNumber(record) {
      //抛出去
      this.$emit('selected', record)
      this.visible = false
    },
  },
}
</script>
<style scoped>
</style>
