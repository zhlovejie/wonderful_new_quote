<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="车牌号"
        allowClear
        v-model="queryParam.licensePlateNum"
      />

      <a-input
        v-if="this.activeKey === 1"
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="车辆名称"
        allowClear
        v-model="queryParam.carName"
      />
      <a-input
        v-if="this.activeKey === 1"
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="保管人"
        allowClear
        v-model="queryParam.careUserName"
      />

      <a-input
        v-if="this.activeKey === 0"
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="姓名"
        allowClear
        v-model="queryParam.name"
      />
      <a-input
        v-if="this.activeKey === 0"
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="手机号"
        allowClear
        v-model="queryParam.phone"
      />
      <a-select
        v-if="this.activeKey === 0"
        placeholder="当前状态"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">厂区</a-select-option>
        <a-select-option :value="2">场外</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <template v-if="$auth('year:add')">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="showModal()">车位管理 </a-button>
        </a-dropdown>
      </template>

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="员工车" key="0" />
        <a-tab-pane tab="公车" key="1" />
      </a-tabs>
      <a-table
        v-if="$auth('year:lists') && this.activeKey === 0"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <template v-if="text === 2">厂外</template>
          <template v-else-if="text === 1">厂区</template>
          <template v-else>{{ text }}</template>
        </div>
      </a-table>

      <a-table
        v-if="$auth('year:lists') && this.activeKey === 1"
        :columns="colu"
        :dataSource="dataSource1"
        :pagination="pagination3"
        :loading="loading"
        @change="handleTableChange1"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <template v-if="text === 2">厂外</template>
          <template v-else>厂区</template>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script>
import { accessPage, accessPageCarList } from '@/api/accessControl'

import moment from 'moment'
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
    title: '车牌号',
    dataIndex: 'licensePlateNum',
    key: 'licensePlateNum',
  },
  {
    align: 'center',
    title: '当前状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '备用车牌号',
    key: 'spareLicensePlateNum',
    dataIndex: 'spareLicensePlateNum',
  },
  {
    align: 'center',
    title: '备用车当前状态',
    key: 'spareCarStatus',
    dataIndex: 'spareCarStatus',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
  },
  {
    align: 'center',
    title: '职位',
    dataIndex: 'stationName',
    key: 'stationName',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
]

const colu = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '车牌号',
    dataIndex: 'carCode',
    key: 'carCode',
  },
  {
    align: 'center',
    title: '车牌号',
    dataIndex: 'carName',
    key: 'carName',
  },

  {
    align: 'center',
    title: '当前状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '保管人部门',
    dataIndex: 'careDepartmentName',
    key: 'careDepartmentName',
  },
  {
    align: 'center',
    title: '保管人',
    dataIndex: 'careUserName',
    key: 'careUserName',
  },
]

export default {
  name: 'NoticeList',
  components: {},
  data() {
    return {
      visible: false,
      //   depList: [],
      queryParam: { current: 1 },
      pagination1: {},
      pagination2: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      pagination3: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination2.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
      activeKey: 0,
      departmentList: [],
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      colu: colu,
      dataSource: [],
      dataSource1: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'access_control_vehicleList') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchAction()
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      that.loading = true
      if (this.activeKey === 0) {
        accessPage(_searchParam)
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
      } else {
        let searchParam = {
          carCode: this.queryParam.licensePlateNum,
          carName: this.queryParam.carName,
          careUserName: this.queryParam.careUserName,
        }
        let earchParam = Object.assign({}, { ...searchParam }, { ...this.pagination2 }, opt || {})
        accessPageCarList(earchParam)
          .then((res) => {
            that.loading = false
            that.dataSource1 = res.data.records.map((item, index) => {
              item.key = index + 1
              return item
            })
            //设置数据总条数
            const pagination = { ...that.pagination3 }
            pagination.total = res.data.total
            that.pagination3 = pagination
          })
          .catch((err) => (that.loading = false))
      }
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    // 分页
    handleTableChange1(pagination, filters, sorter) {
      this.pagination2.size = pagination.pageSize
      this.pagination2.current = pagination.current
      this.searchAction()
    },

    doAction(type, record) {
      this.$refs.addForm.query(type, record)
      //this.$message.info('功能尚未实现...')
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1 })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
