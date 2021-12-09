<template>
  <!-- 库内移位 -->
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="移动单编号"
        v-model="queryParam.translocateNum"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-input
        placeholder="物料代码"
        v-model="queryParam.materialCode"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-input
        placeholder="物料名称"
        v-model="queryParam.materialName"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-select
        placeholder="状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchCheck({ current: 1 })"
        >查询</a-button
      >
      <template v-if="$auth('InsideTheLibrary:add')">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="doAction('add', null)"> <a-icon type="plus" />新增库位移位单 </a-button>
        </a-dropdown>
      </template>

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('InsideTheLibrary:list')">
          <a-tab-pane tab="待我审批的" key="1" />
          <a-tab-pane tab="我已审批的" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('InsideTheLibrary:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :expandedRowKeys="expandedRowKeys"
        @expand="expandHandler"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <!-- <div slot="itemType" slot-scope="text, record, index">
          <span v-if="text === 1">补次申请</span>
          <span v-if="text === 2">调整申请 </span>
          <span v-if="text === 3">其他</span>
        </div> -->
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <a-table
          slot="expandedRowRender"
          slot-scope="record, index, indent, expanded"
          :columns="innerColumns"
          :dataSource="record.materialListVo"
          :pagination="false"
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <template v-if="$auth('InsideTheLibrary:view')">
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
            <template v-if="record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <template v-if="$auth('InsideTheLibrary:Withdraw')">
                <a-popconfirm title="是否确定撤回" ok-text="确定" cancel-text="取消" @confirm="confirmWithdraw(record)">
                  <a type="primary">撤回</a>
                </a-popconfirm>
              </template>
            </template>
            <template v-if="record.status === 2 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <template v-if="$auth('InsideTheLibrary:WithdrawEnd')">
                <a-popconfirm title="是否确定完结" ok-text="确定" cancel-text="取消" @confirm="confirmEnd(record)">
                  <a type="primary">完结</a>
                </a-popconfirm>
              </template>
            </template>
            <template
              v-if="
                $auth('InsideTheLibrary:edit-salary') &&
                (record.status === 3 || record.status === 4) &&
                +record.createdId === +userInfo.id
              "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit-salary', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1 && record.status === 1">
            <a type="primary" @click="doAction('edit', record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @filet="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { translocategetListByPage, translocateRevocation, translocateDelById, translocateIsEnd } from '@/api/storage'
import AddForm from './module/Formadd'
import ApproveInfo from '@/components/CustomerList/Materialapproval'
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
    title: '日期',
    dataIndex: 'translocateDate',
    key: 'translocateDate',
  },
  {
    align: 'center',
    title: '移位单编号',
    dataIndex: 'translocateNum',
    key: 'translocateNum',
  },
  {
    align: 'center',
    title: '状态',
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
    title: '提交时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
    key: 'materialCode',
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
  },
  {
    align: 'center',
    title: '仓库/库区',
    dataIndex: 'warehouseReservoir',
    key: 'warehouseReservoir',
  },
  {
    align: 'center',
    title: '移除库位',
    dataIndex: 'removePosition',
    key: 'removePosition',
  },
  {
    align: 'center',
    title: '移入库位',
    dataIndex: 'immigratePosition',
    key: 'immigratePosition',
  },
  {
    align: 'center',
    title: '计划转移数量',
    key: 'planImmigrateNum',
    dataIndex: 'planImmigrateNum',
  },
]
export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      visible: false,
      depList: [],
      queryParam: { current: 1 },
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
      activeKey: 0,
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      innerColumns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
      isExpanded: false, //是否展开列表子数据
      expandedRowKeys: [],
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'InsideTheLibraryList') {
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

    // 删除
    confirmDelete(record) {
      let that = this
      translocateDelById({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '审核通过',
        3: '审核未通过',
        4: '已撤回',
        5: '已完结',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    // 完结
    confirmEnd(record) {
      let that = this
      translocateIsEnd({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    // 撤回
    confirmWithdraw(record) {
      let that = this
      translocateRevocation({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchCheck(opt) {
      this.isExpanded = true
      this.searchAction(opt)
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      translocategetListByPage(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          that.expandedRowKeys = that.isExpanded ? that.dataSource.map((item) => item.key) : []
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
    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
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
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
