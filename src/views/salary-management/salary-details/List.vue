<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-select
        style="width: 200px; margin-right: 10px"
        v-model="queryParam.departmentId"
        :allowClear="true"
        placeholder="请选择部门"
      >
        <a-select-option :value="undefined">请选择部门</a-select-option>
        <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
      <a-input
        placeholder="员工姓名"
        v-model="queryParam.userName"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-month-picker style="width: 200px; margin-right: 10px" placeholder="开始月份" v-model="startMonth" />
      <a-month-picker style="width: 200px; margin-right: 10px" placeholder="结束月份" v-model="endMonth" />
      <a-select
        placeholder="审核状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <template>
        <a-button
          class="a-button"
          type="primary"
          style="position: relative; top: -1px; margin-left: 10px"
          @click="downAction()"
          >导出</a-button
        >
      </template>

      <template v-if="activeKey === 0">
        <a-button
          :disabled="selectedRows.length === 0"
          style="position: relative; top: -1px; margin-left: 10px"
          type="primary"
          @click="batchDelete"
          >批量删出</a-button
        >
      </template>
      <template v-if="activeKey === 1">
        <a-button
          :disabled="selectedRows.length === 0"
          style="position: relative; top: -1px; margin-left: 10px"
          type="primary"
          @click="passAction"
          >通过</a-button
        >
        <a-button
          :disabled="selectedRows.length === 0"
          style="position: relative; top: -1px; margin-left: 10px"
          type="primary"
          @click="noPassAction"
          >不通过</a-button
        >
      </template>
      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('salaryDetails:approve')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('salaryDetails:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :rowSelection="
          activeKey === 1 || activeKey === 0
            ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }
            : null
        "
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template v-if="$auth('salaryDetails:download') && record.status === 2">
              <a-divider type="vertical" />
              <!-- <a type="primary" @click="outPort(record)">下载</a> -->
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

    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
    <Approval ref="approval" @opinionChange="opinionChange" />
  </div>
</template>
<script>
import { getDevisionList } from '@/api/systemSetting'
import { wages_List, getExportList, wages_approcal, wages_del, wages_ImportExcel } from '@/api/bonus_management'
import AddForm from './module/Formadd'
import Approval from './module/Approval'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    key: 'month',
    dataIndex: 'month',
  },
  {
    align: 'center',
    title: '部门',
    key: 'departmentName',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    key: 'stationName',
    dataIndex: 'stationName',
  },
  {
    align: 'center',
    title: '姓名',
    key: 'userName',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '工资',
    key: 'realSalaryBigDecimal',
    dataIndex: 'realSalaryBigDecimal',
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
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
    Approval: Approval,
  },
  data() {
    return {
      departmentList: [], // 部门列表
      visible: false,
      queryParam: {},
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
      activeKey: 0,
      selectedRowKeys: [],
      selectedRows: [],
      startMonth: undefined,
      endMonth: undefined,
      departmentList: [],
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
    }
  },
  computed: {
    searchParam() {
      return {
        startMonth: this.startMonth instanceof moment ? this.startMonth.format('YYYY-MM') : undefined,
        endMonth: this.endMonth instanceof moment ? this.endMonth.format('YYYY-MM') : undefined,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-details') {
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
      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
      that.searchAction()
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 下载
    downAction() {
      const downListParams = Object.assign(
        {
          searchStatus: this.activeKey,
        },
        { ...this.queryParam },
        { ...this.searchParam }
      )
      console.log(downListParams)
      this.loading = true
      wages_ImportExcel(downListParams)
        .then((res) => {
          this.loading = false
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            //const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '工资条下载.xls'
              a.click()
              document.body.removeChild(a)
              this.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    this.$message.info(_res.msg)
                  } else {
                    this.$message.info('下载成功')
                  }
                } else {
                  this.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              this.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (this.loading = false))
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '审核未通过',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    searchAction(opt) {
      let that = this
      that.selectedRowKeys = []
      that.selectedRows = []
      let _searchParam = Object.assign(
        {},
        { ...that.queryParam },
        { ...this.searchParam },
        { ...that.pagination1 },
        opt || {},
        {
          searchStatus: that.activeKey,
        }
      )
      that.loading = true
      wages_List(_searchParam)
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
      this.$refs.addForm.query(type, record)
      //this.$message.info('功能尚未实现...')
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      this.selectedRowKeys = []
      this.selectedRows = []
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1 })
    },
    //批量删除
    batchDelete() {
      const that = this
      const ids = that.selectedRows.map((item) => {
        return {
          approveId: item.id,
        }
      })
      // this.submitAction({ commonApprovalVOS: ids })
      wages_del({ commonApprovalVOS: ids })
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          that.searchAction()
        })
        .catch((err) => (that.spinning = false))
    },

    //批量审批
    submitAction(opt) {
      let that = this
      that.spinning = true
      wages_approcal(opt)
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          that.searchAction()
          // that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },

    passAction(opt = {}) {
      const that = this
      const ids = that.selectedRows.map((item) => {
        return {
          approveId: item.id,
          isAdopt: 0,
          opinion: '通过',
        }
      })
      this.submitAction({ commonApprovalVOS: ids })
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      const that = this
      const ids = that.selectedRows.map((item) => {
        return {
          approveId: item.id,
          isAdopt: 1,
          opinion: opinion,
        }
      })
      this.submitAction({ commonApprovalVOS: ids })
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
