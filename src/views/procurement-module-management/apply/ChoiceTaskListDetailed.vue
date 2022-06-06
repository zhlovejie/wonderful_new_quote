<template>
  <a-modal
    :title="modalTitle"
    :width="1250"
    :visible="visible"
    :destroyOnClose="true"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            style="width: 200px"
            placeholder="任务单编号模糊查询"
            allowClear
            v-model="queryParam.taskDocumentNum"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="配件清单编号模糊查询"
            style="width: 200px"
            allowClear
            v-model="queryParam.accessoriesNum"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="客户名称/机构名称"
            style="width: 200px"
            allowClear
            v-model="queryParam.customerParameter"
          />
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          size="small"
          :scroll="{x:1600}"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <span slot="taskDocumentNum" slot-scope="text, record">
            <a href="#" @click="handleSelected(record)">{{ text }}</a>
          </span>
          <span slot="isTax" slot-scope="text, record">
            <span> {{ { 0: '含税', 1: '不含税' }[text] || '未知' }}</span>
          </span>
          <span slot="isPayment" slot-scope="text, record">
            <span v-if="text === 0" style="color: red">否</span>
            <span v-if="text === 1">是</span>
          </span>

          <span slot="paymentType" slot-scope="text, record">
            <span> {{ { 0: '完结付款', 1: '先付款', 2: '免付款', 3: '赠送' }[text] || '未知' }}</span>
          </span>
          <div slot="status" slot-scope="text, record">
            {{ { 1: '待处理', 2: '待完结', 3: '不通过', 4: '完结', 5: '已撤回' }[text] || '未知' }}
          </div>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.productInfoList"
            :pagination="false"
            size="small"
            :scroll="{x:1600}"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>

            <div slot="deliveryMode" slot-scope="text, record, index">
              {{ { 0: '自带', 1: '邮寄' }[record.deliveryMode] || '未知' }}
            </div>
            <div slot="isWarranty" slot-scope="text, record, index">
              <span v-if="record.isWarranty === 0">否</span>
              <span v-if="record.isWarranty === 1" style="color: red">是</span>
            </div>
            <div slot="materialName" slot-scope="text">
              <a-tooltip v-if="String(text).length > 25">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 25) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="specification" slot-scope="text">
              <a-tooltip v-if="String(text).length > 25">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 25) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="specification" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
          </a-table>
        </a-table>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { accessoriesManagementPage } from '@/api/after-sales-management'

const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    width: 150,
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' },
    width: 300,
  },
  {
    title: '规格型号',
    dataIndex: 'specification',
    scopedSlots: { customRender: 'specification' },
    width: 300,
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
    title: '单价（元）',
    dataIndex: 'unitPrice',
  },
  {
    title: '金额（元）',
    dataIndex: 'money',
    scopedSlots: { customRender: 'money' },
  },
  {
    title: '是否过保',
    scopedSlots: { customRender: 'isWarranty' },
  },
  {
    title: '带货方式',
    scopedSlots: { customRender: 'deliveryMode' },
  },
]

export default {
  name: 'ChoiceTaskListDetailed',
  components: {
    STable
  },
  data() {
    return {
      modalTitle: '选择售后任务单',
      visible: false,
      // 查询参数
      queryParam: {
        searchStatus: '0',
        isPayment:1
      },
      innerColumns,
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 80
        },
        {
          title: '配件清单编号',
          dataIndex: 'accessoriesNum',
          width: 130
        },
        {
          title: '任务单编号',
          dataIndex: 'taskDocumentNum',
          scopedSlots: { customRender: 'taskDocumentNum' },
          width: 130
        },
        {
          title: '客户名称',
          dataIndex: 'customerName'
        },
        {
          title: '机构名称',
          dataIndex: 'orgName'
        },
        {
          title: '销售负责人',
          dataIndex: 'saleUserName',
          width: 100
        },
        {
          title: '售后人员',
          dataIndex: 'createdName',
          width: 100
        }
      ],
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      loading: false
    }
  },
  methods: {
    query() {
      this.visible = true
      this.searchAction()
    },
    handleCancel() {
      this.visible = false
    },
    handleSelected(record) {
      this.$emit('change', { ...record })
      this.handleCancel()
    },
    searchAction(opt) {
      let that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      accessoriesManagementPage(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.searchAction()
          }
        })
        .catch(err => (that.loading = false))
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    }
  }
}
</script>

<style scoped></style>
