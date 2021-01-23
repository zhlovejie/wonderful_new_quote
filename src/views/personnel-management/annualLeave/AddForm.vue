<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <div class="adjust-apply-list-wrapper">
      <div class="search-wrapper">
        <a-range-picker @change="dateChange" style="width: 250px; margin-right: 10px" />
        <a-button
          class="a-button"
          type="primary"
          style="position: relative; top: -1px"
          icon="search"
          @click="searchAction({ current: 1 })"
          >查询</a-button
        >
      </div>
      <div class="main-wrapper">
        <a-tabs :activeKey="activeKey" defaultActiveKey="1" @change="tabChange">
          <a-tab-pane tab="调休" :key="1" />
          <template>
            <a-tab-pane tab="年假" :key="2" />
          </template>
        </a-tabs>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          size="middle"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="changeHours" slot-scope="text, record, index">
            <span v-if="record.operationType === 3 || record.operationType === 4">+{{ text }}</span>
            <span v-if="record.operationType === 1 || record.operationType === 2">-{{ text }}</span>
            <span v-if="(record.operationType === 5 || record.operationType === 6) && text > 0">+{{ text }}</span>
            <span v-if="(record.operationType === 5 || record.operationType === 6) && text < 0">{{ text }}</span>
          </div>

          <div slot="operationType" slot-scope="text, record, index">
            <span v-if="text === 1">调休请假</span>
            <span v-if="text === 2">年假请假</span>
            <span v-if="text === 3">加班</span>
            <span v-if="text === 4">年假发放</span>
            <span v-if="text === 5">手动修改调休</span>
            <span v-if="text === 6">手动修改年假</span>
          </div>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { annualLeave } from '@/api/personnelManagement'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '来源',
    dataIndex: 'operationType',
    scopedSlots: { customRender: 'operationType' },
  },
  {
    align: 'center',
    title: '变更时长(H)',
    dataIndex: 'changeHours',
    scopedSlots: { customRender: 'changeHours' },
  },

  {
    align: 'center',
    title: '剩余时长(H)',
    dataIndex: 'changeAfterHours',
  },
  {
    align: 'center',
    title: '人工变更原因',
    dataIndex: 'reason',
  },

  {
    align: 'center',
    title: '操作时间',
    dataIndex: 'createdTime',
  },
]
export default {
  name: 'UpdateRecord',
  data() {
    return {
      visible: false,
      columns: columns,
      dataSource: [],
      record: {},
      activeKey: 1,
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: { type: 1 },
    }
  },
  computed: {
    modalTitle() {
      return '变更记录'
    },
  },
  methods: {
    // 获取时间
    dateChange(date, dateString) {
      this.$set(this.searchParam, 'startTime', dateString[0])
      this.$set(this.searchParam, 'endTime', dateString[1])
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.record = record
      that.searchParam = {...that.searchParam,userId:record.userId}
      this.searchAction({ current: 1 })
    },
    searchAction(opt) {
      let that = this
      // debugger
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      that.loading = true
      annualLeave(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    handleCancel() {
      this.visible = false
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.searchParam = {...this.searchParam,type:this.activeKey}
      this.searchAction({ current: 1 })
    },
  },
}
</script>

