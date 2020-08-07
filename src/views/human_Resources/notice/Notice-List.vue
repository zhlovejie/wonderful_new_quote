<template>
  <!--公告管理 -->
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="标题"
        v-model="queryParam.title"
        allowClear
        style="width: 200px;margin-right:10px;"
      />
      <a-select
        placeholder="公告状态"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px;margin-right:10px;"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
        <a-select-option :value="4">发布</a-select-option>
        <a-select-option :value="5">审批时撤回</a-select-option>
        <a-select-option :value="6">发布时撤回</a-select-option>
      </a-select>
      <a-range-picker
        @change="dateChange"
        style="width:400px ;margin-right:10px;"
        v-model="queryParam.rangeDate"
      />
      <a-button
        class="a-button"
        type="primary"
        style="position: relative;top:-1px;"
        icon="search"
        @click="searchAction"
      >查询</a-button>
      <a-dropdown style="float:right;" v-if="$auth('adjustApply:add')">
        <a-button type="primary" @click="doAction('add',null)">
          <a-icon type="plus" />新增
        </a-button>
      </a-dropdown>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('human_Resources_notice:jurisdiction')">
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
          <template v-if="record.status === 1">
            <span>待审批</span>
          </template>
          <template v-if="record.status === 2">
            <span>审核通过</span>
          </template>
          <template v-if="record.status === 3">
            <span>审核未通过</span>
          </template>
          <template v-if="record.status === 4">
            <span>已发布</span>
          </template>
          <template v-if="record.status === 5">
            <span>已撤回</span>
          </template>
          <template v-if="record.status === 6">
            <span>已撤回</span>
          </template>
        </div>
        <div slot="operationStatus" slot-scope="text, record, index">
          <a href="javascript:void(0)">{{ getOperationStatus(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <template v-if="$auth('adjustApply:edit') && record.status === 1">
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确定撤回"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmWithdraw(record)"
              >
                <a type="primary">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="$auth('adjustApply:edit') && record.status === 2">
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确定发布"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmRelease(record)"
              >
                <a type="primary">发布</a>
              </a-popconfirm>
            </template>
            <template v-if="$auth('adjustApply:edit') && record.status === 3||record.status === 5">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit-salary',record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确定删除"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmDelete(record)"
              >
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
            <template v-if="$auth('adjustApply:edit') && record.status === 4">
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否撤回"
                ok-text="是"
                cancel-text="否"
                @confirm="confirmWithdraw(record)"
              >
                <a type="primary">撤回</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1 && record.status === 1 ">
            <a type="primary" @click="doAction('edit',record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view',record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <!-- <ApproveInfo ref="approveInfoCard" /> -->
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import { NoticeList, NoticeDelete, NoticeRelease, NoticeWithdraw } from '@/api/humanResources'
import AddForm from './module/AddForm'
// import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    align: 'center',
    title: '发布范围',
    dataIndex: 'exceptionName',
    key: 'exceptionName',
  },
  {
    align: 'center',
    title: '公告状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交人时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  {
    align: 'center',
    title: '发布时间',
    key: 'releaseTime',
    dataIndex: 'releaseTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    // ApproveInfo:ApproveInfo
  },
  data() {
    return {
      queryParam: {},
      activeKey: 0,
      operation_status: undefined,
      person_name: undefined,
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_notice') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },
    // 获取时间
    dateChange(date, dateString) {
      this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'beginTime', dateString[0])
      this.$set(this.queryParam, 'endTime', dateString[1])
    },
    // 删除
    confirmDelete(record) {
      let that = this
      NoticeDelete({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },

    // 发布
    confirmRelease(record) {
      let that = this
      NoticeRelease({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    // 撤回
    confirmWithdraw(record) {
      let that = this
      NoticeWithdraw({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      NoticeList(_searchParam)
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
      // console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
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
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>