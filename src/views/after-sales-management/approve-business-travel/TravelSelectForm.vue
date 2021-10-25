<template>
  <a-modal
    title="选择出差单"
    :width="1250"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div class="wdf-custom-wrapper">
      <div class="main-wrapper">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            <span>{{ index + 1 }}</span>
          </div>
          <div
            slot="travelType"
            slot-scope="text"
          >{{ { 1: '出差', 2: '公事外出' }[text] || '未知' }}</div>
          <div
            slot="travelUsers"
            slot-scope="text, record"
          >
            {{ Array.isArray(record.users) ? record.users.map((item) => item.userName).join(',') : '-' }}
          </div>
        </a-table>
      </div>
    </div>

  </a-modal>
</template>

<script>
import {
  departmentList //所有部门
} from '@/api/systemSetting'
import { travelListByUserIdForReimburse } from '@/api/after-sales-management-custom'

import moment from 'moment'
import { getDictionaryList } from '@/api/workBox'

export default {
  name: 'travel-select-form',
  components: {},
  data() {
    return {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      loading: false,
      searchParam: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      visible: false,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    columns() {
      const columns = [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          align: 'center',
          title: '出差人员',
          scopedSlots: { customRender: 'travelUsers' }
        },
        // {
        //   align: 'center',
        //   title: '出差类型',
        //   dataIndex: 'travelType',
        //   scopedSlots: { customRender: 'travelType' },
        // },
        {
          align: 'center',
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          align: 'center',
          title: '结束时间',
          dataIndex: 'endTime'
        },
        // {
        //   align: 'center',
        //   title: '出发城市',
        //   dataIndex: 'beginAreaName',
        // },
        {
          align: 'center',
          title: '预付金额',
          dataIndex: 'overdraftAmount'
        }
      ]
      return columns
    }
  },

  methods: {
    query() {
      const that = this
      that.visible = true
      that.selectedRowKeys = []
      that.selectedRows = []
      that.dataSource = []
      that.searchParam = {
        userId:that.userInfo.id
      }
      that.searchAction()
    },
    searchAction(opt = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      const _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      travelListByUserIdForReimburse(_searchParam)
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
        })
        .catch(err => (that.loading = false))
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    handleCancel() {
      this.visible = false
    },
    handleSubmit() {
      if (this.selectedRows.length === 0) {
        this.$message.info('请选择出差单')
        return
      }
      this.handleCancel()
      this.$emit('change', [...this.selectedRows])
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style scoped>
</style>
