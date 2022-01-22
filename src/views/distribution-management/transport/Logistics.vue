<template>
  <a-modal
    title="新增物流单号"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <!-- <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template> -->
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" style="margin-bottom: 20px">
        <a-input
          placeholder="物流单号"
          v-model="queryParam.logisticsOrderNo"
          allowClear
          style="width: 200px; margin-right: 10px"
        />
        <a-input
          placeholder="承运方"
          v-model="queryParam.logisticsCompanyName"
          allowClear
          style="width: 200px; margin-right: 10px"
        />
        <a-range-picker @change="dateChange" style="width: 400px; margin-right: 10px" v-model="queryParam.rangeDate" />

        <a-button style="margin-left: 10px" type="primary" @click="searchAction({ current: 1 })">查询</a-button>
      </div>
      <a-layout>
        <!--  此处编写表单中的功能按钮    -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          @change="handleTableChange"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          v-if="$auth('logistics:list')"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="carrierType" slot-scope="text, record, index">
            <span>{{ text === 1 ? '配货站——' + record.logisticsCompanyName : '专车' }}</span>
          </div>

          <span slot="addressName" slot-scope="text, record">
            <span>{{ (text = text.split(',').join('')) }}{{ record.detailedAddressName }}</span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="applyFor(record)">查看</a>
            <a-divider type="vertical" />
          </span>
        </a-table>
      </a-layout>

      <ReturnVisit ref="returnVisit" />
    </a-card>
  </a-modal>
</template>

<script>
import moment from 'moment'
import system from '@/config/defaultSettings'
import ReturnVisit from './returnVisit'
import { listInformation, logisticsDelete } from '@/api/distribution-management'
const columns = [
  {
    dataIndex: 'name',
    title: '序号',
    key: 'name',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '物流单号',
    dataIndex: 'logisticsOrderNo',
    key: 'logisticsOrderNo',
    align: 'center',
  },
  {
    title: '承运方',
    dataIndex: 'carrierType',
    key: 'carrierType',
    align: 'center',
    scopedSlots: { customRender: 'carrierType' },
  },
  {
    title: '车牌号',
    dataIndex: 'licensePlateNumber',
    key: 'licensePlateNumber',
    align: 'center',
  },
  {
    title: '目的地',
    dataIndex: 'addressName',
    key: 'addressName',
    align: 'center',
    scopedSlots: { customRender: 'addressName' },
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    align: 'center',
  },

  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]
export default {
  name: 'RoleManagement',
  components: { ReturnVisit },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      columns,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      pagination1: {},
      queryParam: { current: 1 },
      hiddenBoolean: false,
      visible: false,
      selectedRowKeys: [], // Check here to configure the default column
      selectedRows: [],

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  computed: {},
  methods: {
    moment: moment,
    init() {
      this.visible = true
      this.searchAction()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    dateChange(date, dateString) {
      // this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'startDate', dateString[0])
      this.$set(this.queryParam, 'endDate', dateString[1])
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      // if (this.queryParam.Dates) {
      //   let date = that.queryParam.Dates.format('YYYYMM')
      //   this.queryParam.accountDate = date
      // }
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      listInformation(_searchParam)
        .then((res) => {
          that.loading = false
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
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      // console.log(pagination, filters, sorter)
      // const pager = { ...this.pagination }
      // pager.current = pagination.current
      // this.pagination = pager
      this.searchAction()
    },

    applyFor(record) {
      this.$refs.returnVisit.query(record)
    },
    handleOk() {
      this.visible = false
      this.$emit('filet', this.selectedRows)
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
</style>