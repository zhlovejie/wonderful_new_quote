<template>
  <!--公告管理 -->
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-date-picker
        style="width: 280px ;margin-right:10px;"
        mode="year"
        placeholder="请选择年份"
        format="YYYY"
        v-model=" yearPick"
        :open="yearPickShow"
        @panelChange="handlePanelChange"
        @openChange="handleOpenChange"
      />
      <a-select
        placeholder="审批状态"
        v-if="activeKey === 0"
        v-model="queryParam.status "
        :allowClear="true"
        style="width: 280px;margin-right:10px;"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative;top:-1px;"
        icon="search"
        @click="searchAction1"
      >查询</a-button>

      <a-dropdown style="float:right;">
        <a-button type="primary" @click="showModal()">
          <a-icon type="plus" />新增
        </a-button>
      </a-dropdown>
      <div style="float:right;"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template>
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
        <!-- v-if="$auth('leagueBuilding:list')" -->
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div slot="operationStatus" slot-scope="text ">
          <a href="javascript:void(0)">{{ getOperationStatus(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <template>
              <a type="primary" @click="doAction('view',record)">查看</a>
            </template>
            <template v-if=" record.status === 1&& +record.createdId  === +userInfo.id  ">
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
            <template v-if="record.status === 2 ">
              <a-divider type="vertical" />
              <a type="primary" :href="record.planUrl" target="_blank">下载</a>
            </template>
            <template
              v-if="record.status === 3||record.status === 4 && +record.createdId  === +userInfo.id"
            >
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
          </template>

          <template v-if="activeKey === 1 && record.status === 1 ">
            <a type="primary" @click="doAction('edit',record)">审核</a>
          </template>

          <template v-if="activeKey === 2 ">
            <a type="primary" @click="doAction('view',record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <a-modal v-model="visible" title="新增年度培训方案" @ok="handleOk">
      <a-date-picker
        style="width:280px ;margin-right:10px;"
        mode="year"
        placeholder="请选择年份"
        format="YYYY"
        v-model=" yearPick1"
        :open="yearPickShow1"
        @panelChange="handlePanelChange1"
        @openChange="handleOpenChange1"
      />
    </a-modal>
    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { getDevisionList } from '../../../api/systemSetting'
import { annualList, annualPlan, annualRemove } from '@/api/training-management'
import AddForm from './module/FromAdd'
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
    title: '时间',
    dataIndex: 'year',
    key: 'year',
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },

  {
    align: 'center',
    title: '审核状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createdUsername',
    dataIndex: 'createdUsername',
  },
  {
    align: 'center',
    title: '提交人时间',
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

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
    // UploadImgs: UploadImgs,
  },
  data() {
    return {
      visible: false,
      yearPick: null, //年选择器的值
      yearPickShow: false, //年选择器的显示隐藏
      yearPick1: null, //年选择器的值
      yearPickShow1: false, //年选择器的显示隐藏
      queryParam: {},
      status: '',
      activeKey: 0,
      departmentList: [],
      operation_status: undefined,
      person_name: undefined,
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      pagination: {
        current: 1,
      },
      loading: false,
      whole: true,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'training-management_programme') {
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
      this.searchAction()
      this.department()
    },
    searchAction1() {
      console.log('chaxun')
      if (this.yearPick != null) {
        this.queryParam.year = moment(this.yearPick).format('YYYY')
      } else {
        delete this.queryParam.year
      }
      this.searchAction()
    },
    showModal() {
      this.visible = true
      this.yearPick1 = null
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
      if (this.yearPick1) {
        this.doAction('add', { year: this.yearPick1 })
      } else {
        this.$message.error('请选择年份')
      }
    },
    // 得到年份选择器的值
    handlePanelChange(value) {
      this.yearPick = value
      this.yearPickShow = false
    },
    handleOpenChange(status) {
      this.yearPickShow = status
    },
    // 得到年份选择器的值
    handlePanelChange1(value) {
      this.yearPick1 = value
      console.log(value)
      this.yearPickShow1 = false
    },
    handleOpenChange1(status) {
      this.yearPickShow1 = status
    },
    // 删除
    confirmDelete(record) {
      let that = this
      annualRemove(`oaTrainYearPlanId=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },

    department() {
      getDevisionList().then((res) => {
        this.departmentList = res.data
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
      // console.log(record.id)
      annualPlan(`oaTrainYearPlanId=${record.id}`).then((res) => {
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
      annualList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          // pagination.total = res.data.total
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
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
