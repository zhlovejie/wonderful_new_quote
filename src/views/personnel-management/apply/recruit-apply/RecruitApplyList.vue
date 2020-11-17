<template>
  <!-- 招聘申请 -->
  <div class="recruit-apply-list-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        @change="depChangeHandler"
        v-model="depId"
        :allowClear="true"
        style="width: 200px"
      >
        <a-select-option v-for="item in depSelectDataSource" :key="item.id" :value="item.id">
          {{ item.departmentName }}
        </a-select-option>
      </a-select>

      <a-select placeholder="选择岗位" v-model="stationId" :allowClear="true" style="width: 200px">
        <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">
          {{ item.stationName }}
        </a-select-option>
      </a-select>

      <a-select placeholder="紧急程度" v-model="emergency" :allowClear="true" style="width: 200px">
        <a-select-option value="0">加急</a-select-option>
        <a-select-option value="1">急</a-select-option>
        <a-select-option value="2">人才储备</a-select-option>
      </a-select>
      <a-select
        v-if="activeKey === 0"
        placeholder="处理状态"
        :allowClear="true"
        v-model="approval_status"
        style="width: 120px"
      >
        <a-select-option :value="0">待审批</a-select-option>
        <a-select-option :value="1">通过</a-select-option>
        <a-select-option :value="2">不通过</a-select-option>
        <a-select-option :value="3">已撤回</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button
        class="a-button"
        v-if="$auth('recruitApply:add')"
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        >新增</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('recruitApply:approval')">
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div slot="emergentLevel" slot-scope="text, record, index">
          {{ getEmergentLevelText(text) }}
        </div>

        <div slot="isEnd" slot-scope="text, record, index">
          <template v-if="$auth('recruitApply:isEnd') && +record.status === 1 && +record.isEnd === 0">
            <a-popconfirm title="是否要完结该记录？" @confirm="changeStatus(record)">
              <a href="javascript:void(0);">未完结</a>
            </a-popconfirm>
          </template>
          <template v-else>
            {{ { 0: '未完结', 1: '已完结' }[text] }}
          </template>
        </div>

        <!-- recruitApply:isEnd -->
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template>
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>

          <template v-if="activeKey === 0">
            <template v-if="record.status === 0 && record.createdId === userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => confirmWithdraw(record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <a-divider type="vertical" v-if="record.status === 3 && record.showModifyButtonFlag === 1" />
            <a
              type="primary"
              v-if="record.status === 3 && $auth('recruitApply:edit') && record.showModifyButtonFlag === 1"
              @click="doAction('edit', record)"
              >修改</a
            >
          </template>
          <template v-if="activeKey === 1">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { pageList, updateIsEnd, pageCancel } from '@/api/personnelManagement'
import AddForm from './module/AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'

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
    title: '编号',
    dataIndex: 'adverNum',
    key: 'adverNum',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
    scopedSlots: { customRender: 'departmentName' },
  },
  {
    align: 'center',
    title: '岗位',
    key: 'stationName',
    dataIndex: 'stationName',
    scopedSlots: { customRender: 'stationName' },
  },
  {
    align: 'center',
    title: '需求人数',
    dataIndex: 'needNum',
    key: 'needNum',
    scopedSlots: { customRender: 'needNum' },
  },
  {
    align: 'center',
    title: '紧急程度',
    dataIndex: 'emergentLevel',
    key: 'emergentLevel',
    scopedSlots: { customRender: 'emergentLevel' },
  },
  {
    align: 'center',
    title: '处理状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },

  {
    align: 'center',
    title: '是否完结',
    key: 'isEnd',
    dataIndex: 'isEnd',
    scopedSlots: { customRender: 'isEnd' },
  },

  {
    align: 'center',
    title: '申请人',
    dataIndex: 'createdName',
    key: 'createdName',
    scopedSlots: { customRender: 'createdName' },
  },
  {
    align: 'center',
    title: '申请时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' },
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'recruitApplyList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      activeKey: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      depId: undefined,
      stationId: undefined,
      emergency: undefined,
      approval_status: undefined,
      depSelectDataSource: [],
      postSelectDataSource: [],
      columns: columns,
      dataSource: [],
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      return {
        departmentId: this.depId,
        stationId: this.stationId,
        emergentLevel: this.emergency,
        status: this.approval_status,
        current: 1,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'recruit-apply') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    // { id: record.id  }
    confirmWithdraw(record) {
      let that = this
      pageCancel(`id=${record.id}`).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    init() {
      let that = this
      //depSelectDataSource
      departmentList().then((res) => {
        that.depSelectDataSource = res.data
      })

      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageList(_searchParam)
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
      this.searchAction()
    },
    doAction(type, record) {
      console.log(type)
      this.$refs.addForm.query(type, record)
    },
    getStateText(state) {
      let stateMap = {
        0: '待审批',
        1: '通过',
        2: '不通过',
        3: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    getEmergentLevelText(evaluation) {
      let evaluationMap = {
        0: '加急',
        1: '急',
        2: '人才储备',
      }
      return evaluationMap[evaluation] || `未知:${evaluation}`
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    changeStatus(record) {
      let that = this
      updateIsEnd({ id: record.id }).then((res) => {
        debugger
        that.$message.info(res.msg)
        if (+res.code === 200) {
          that.searchAction()
        }
      })
    },
  },
}
</script>
<style scoped>
.recruit-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.recruit-apply-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>