<template>
  <!-- 驾驶权限申请 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="姓名模糊查询" v-model="userName" allowClear style="width:160px;" />
      <a-select
        placeholder="持照类别"
        showSearch
        v-model="licenseTypeDicId"
        :allowClear="true"
        :filterOption="filterOption"
        style="width: 150px"
      >
        <a-select-option
          v-for="item in cardCategoryList"
          :key="item.id"
          :value="item.id"
        >{{item.text}}</a-select-option>
      </a-select>
      <a-select
        placeholder="架驶资格"
        v-model="qualificationDicId"
        :allowClear="true"
        style="width: 150px"
      >
        <a-select-option
          v-for="item in driveQualificationsList"
          :key="item.id"
          :value="item.id"
        >{{item.text}}</a-select-option>
      </a-select>

      <a-select
        v-if="+activeKey === 0"
        placeholder="单据状态"
        v-model="status"
        :allowClear="true"
        style="width: 150px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <!-- <template v-if="$auth('customerAppeal:all')">
          <a-tab-pane tab="全部" key="3" />
        </template>
        <template v-else>
          
        </template>-->
        <a-tab-pane tab="全部" key="0" />
        <a-tab-pane tab="待审批" key="1" />
        <a-tab-pane tab="已审批" key="2" />
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
        <div slot="remark" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,10) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStateTxt(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <template v-if="+activeKey === 0 && record.status === 3 ">
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          </template>
          <template v-if="+activeKey === 0 && record.status === 1 && +record.createdId === +userInfo.id">
            <a-divider type="vertical" />
            <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('revocation',record)">
              <a type="primary" href="javascript:;">撤回</a>
            </a-popconfirm>
          </template>
          <template v-if="(+activeKey === 0 && (record.status === 3 || record.status === 4))">
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
          <template v-if="+activeKey === 1">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval',record)">审批</a>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>

<script>
import { getDictionary } from '@/api/common'
import {
  driverAuthorityRevocation,
  driverAuthorityList,
  driverAuthorityDetail,
  driverAuthorityDel,
  driverAuthorityApproval,
  driverAuthorityAddOrUpdate,
} from '@/api/vehicleManagement'
import AddForm from './AddForm'
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
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    align: 'center',
    title: '持证类别',
    dataIndex: 'licenseTypeDicText',
  },
  {
    align: 'center',
    title: '驾龄(年)',
    dataIndex: 'driverAge',
  },
  {
    align: 'center',
    title: '驾驶资格',
    dataIndex: 'qualificationDicText',
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
  },
  {
    align: 'center',
    title: '单据状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交时间',
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
  name: 'vehicle-management-author-record',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      activeKey: 0,
      userName: undefined,
      licenseTypeDicId: undefined,
      qualificationDicId: undefined,
      status: undefined,
      columns: columns,
      dataSource: [],
      cardCategoryList: [],
      driveQualificationsList: [],
      pagination: {
        current: 1,
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    searchParam() {
      return {
        searchStatus: this.activeKey,
        userName: this.userName,
        licenseTypeDicId: this.licenseTypeDicId,
        qualificationDicId: this.qualificationDicId,
        status: this.status,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'vehicle-management-author-record') {
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

      let task2 = getDictionary({ text: '驾照类别' }).then((res) => (that.cardCategoryList = res.data))
      let task1 = getDictionary({ text: '驾驶资格' }).then((res) => (that.driveQualificationsList = res.data))

      //that.activeKey = that.$auth('customerAppeal:all') ? 3 : 0
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      driverAuthorityList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource =
            (res.data.records &&
              res.data.records.map((item, index) => {
                item.key = index + 1
                return item
              })) ||
            []
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'del') {
        driverAuthorityDel({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      } else if (actionType === 'revocation') {
        driverAuthorityRevocation({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
      this.$refs.addForm.query(actionType, record)
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey === 0) {
        this.status = undefined
      }
      if (this.activeKey === 1) {
        this.userName = undefined
        this.licenseTypeDicId = undefined
        this.qualificationDicId = undefined
        this.status = undefined
      }
      this.searchAction()
    },
    getStateTxt(state) {
      return { 1: '待审批', 2: '审批通过', 3: '不通过', 4: '已撤回' }[state] || '未知'
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    filterOption (input, option) { 
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
