<template>
  <a-modal
    title="修改记录"
    :width="960"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form layout="inline">
      <a-form-item>
        <a-select placeholder="变更" v-model="priceType" :allowClear="true" style="width: 150px">
          <a-select-option :value="0">成本价</a-select-option>
          <a-select-option :value="1">a价</a-select-option>
          <a-select-option :value="2">b价</a-select-option>
          <a-select-option :value="3">c价</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-input placeholder="修改人名称" v-model="createdName" :allowClear="true" style="width: 150px" />
      </a-form-item>
      <a-form-item>
        <a-range-picker style="width: 300px" v-model="sDate" :allowClear="true" />
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" icon="search" @click="searchAction()">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" icon="download" @click="actionHandler()">波动图</a-button>
      </a-form-item>
    </a-form>
    <a-spin :spinning="confirmLoading">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="confirmLoading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="money" slot-scope="text, record">
          <span>{{ record.money | moneyFormatNumber }}</span>
        </div>
        <div slot="priceType" slot-scope="text, record, index">
          <span v-if="text === 0">成本价</span>
          <span v-if="text === 1">a价</span>
          <span v-if="text === 2">b价</span>
          <span v-if="text === 3">c价</span>
        </div>
      </a-table>
    </a-spin>
    <waveChart ref="wavechart" />
  </a-modal>
</template>

<script>
import { getChangeRecordPageList } from '@/api/workBox'
import waveChart from './waveChart'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '变更名称',
    dataIndex: 'priceType',
    scopedSlots: { customRender: 'priceType' },
  },
  {
    align: 'center',
    title: '原价格(元)',
    dataIndex: 'oldPrice',
  },
  {
    align: 'center',
    title: '现价格(元)',
    dataIndex: 'newPrice',
  },

  {
    align: 'center',
    title: '浮动(元)',
    dataIndex: 'floatPrice',
  },
  {
    align: 'center',
    title: '修改人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'createdTime',
  },
]

export default {
  name: 'PriceEdit',
  components: {
    // 组件
    waveChart,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      priceType: undefined,
      createdName: undefined,
      sDate: [undefined, undefined],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      record: {},
    }
  },
  computed: {
    searchParam() {
      let beginTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        beginTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        beginTime,
        endTime,
        priceType: this.priceType,
        createdName: this.createdName,
      }
    },
  },
  methods: {
    moment,
    async query(record) {
      // 父页面点击修改调用
      this.visible = true
      this.record = record
      this.searchAction()
    },
    actionHandler(opt) {
      let that = this
      let _searchParam = Object.assign({ productId: that.record.id }, { ...that.searchParam }, opt || {})
      that.$refs.wavechart.query(_searchParam)
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign(
        { productId: that.record.id },
        { ...that.searchParam },
        paginationParam,
        opt || {}
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      that.dataSource = []
      getChangeRecordPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },

    handleCancel() {
      this.visible = false
    },
    previewCancel() {
      this.previewVisible = false
    },
  },
}
</script>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
