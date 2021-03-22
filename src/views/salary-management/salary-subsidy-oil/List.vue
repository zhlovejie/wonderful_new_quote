<template>
  <!-- 油补申请 -->
  <div class="wdf-custom-wrapper" id="salary-subsidy-oil">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="部门" v-model="searchParam.departmentId" :allowClear="true" style="width: 150px">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">
              {{ item.departmentName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input style="width: 150px" v-model="searchParam.userName" placeholder="姓名模糊查询" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-input style="width: 150px" v-model="searchParam.carNo" placeholder="车牌号模糊查询" :allowClear="true" />
        </a-form-item>
        <a-form-item v-if="+activeKey === 0">
          <a-select placeholder="审批状态" v-model="searchParam.status" :allowClear="true" style="width: 150px">
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
            <a-select-option :value="4">已撤回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>

        <a-button
          v-if="$auth('salary-subsidy-oil:add')"
          style="float: right"
          type="primary"
          icon="plus"
          @click="doAction('add', null)"
          >新增</a-button
        >
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('salary-subsidy-oil:approval')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
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
        <div slot="itemType" slot-scope="text, record">
          {{ { 1: '初次申请', 2: '调整申请', 3: '其他申请' }[text] || '未知' }}
        </div>
        <div slot="amount" slot-scope="text, record">
          {{ text | moneyFormatNumber }}
        </div>

        <div slot="status" slot-scope="text, record">
          <a href="javascript:void(0);" @click="approvalPreview(record)">{{
            { 1: '待审批', 2: '通过', 3: '不通过', 4: '已撤回' }[text] || '未知'
          }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+activeKey === 1">
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>
          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>

          <template v-if="+activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template v-if="+record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="+record.status === 4 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a type="primary" href="javascript:;" @click="doAction('edit', record)">修改</a>
            </template>

            <template v-if="record.applyUrl">
              <a-divider type="vertical" />
              <a target="_blank" v-download="record.applyUrl">下载</a>
            </template>

            <template v-if="(+record.status === 4 || +record.status === 3) && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction({ current: 1 })" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import {
  oilApplyApproval,
  oilApplyDel,
  oilApplyPageList,
  oilApplyAddOrUpdate,
  oilApplyRevocation,
} from '@/api/salaryManagement'
import AddForm from './AddForm'

import moment from 'moment'
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
    dataIndex: 'ybNum',
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
  },
  {
    align: 'center',
    title: '车牌号',
    dataIndex: 'carNo',
  },
  {
    align: 'center',
    title: '申请事项',
    dataIndex: 'itemType',
    scopedSlots: { customRender: 'itemType' },
  },
  {
    align: 'center',
    title: '补贴金',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' },
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交日期',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'salary-subsidy-oil',
  components: {
    AddForm,
    ApproveInfo,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      depList: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      searchParam: {},
      activeKey: 0,
      bindEnterFn: null,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-subsidy-oil') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('#salary-subsidy-oil')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchParam.searchStatus = that.activeKey
      let queue = []
      let task1 = departmentList().then((res) => (that.depList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      oilApplyPageList(_searchParam)
        .then((res) => {
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
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.searchAction()
          }
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

    doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit', 'approval'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'del') {
        oilApplyDel({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        oilApplyRevocation({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam = { ...this.searchParam, searchStatus: this.activeKey }
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('#salary-subsidy-oil')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
