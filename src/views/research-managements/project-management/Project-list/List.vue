<template>
  <!-- 项目列表 -->
  <div class="project-records-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="项目编号模糊查询" v-model="searchParam.projectCode" allowClear style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="项目名称模糊查询" v-model="searchParam.projectName" allowClear style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="项目总负责人" v-model="searchParam.chargeUserName" allowClear style="width: 180px" />
        </a-form-item>

        <a-form-item>
          <a-select v-model="searchParam.modelType" placeholder="项目开发模式" style="width: 200px">
            <a-select-option v-for="item in projectDevelopmentModes" :value="item.id" :key="item.id">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-select v-model="searchParam.status" placeholder="项目进程" style="width: 200px">
            <a-select-option v-for="item in projectProcesses" :value="item.id" :key="item.id">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-range-picker
            :placeholder="['开始日期', '结束日期']"
            @change="rangePickerChange"
            style="width: 260px"
            :allowClear="true"
          />
        </a-form-item>

        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <a-button type="primary" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
        <a-tab-pane v-for="tagItem in tabList" :key="tagItem.key">
          <span slot="tab"> {{ tagItem.label }}</span>
          <!-- <span slot="tab"> {{tagItem.label}} ( {{ tagItem.count || 0 }} ) </span> -->
        </a-tab-pane>
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
        <div slot="modelType" slot-scope="text, record, index">
          <!-- <a @click="approvalPreview(record)">{{text}}</a> -->
          {{ getModelType(text) }}
        </div>
        <div slot="status" slot-scope="text, record, index">
          <!-- <a @click="approvalPreview(record)">{{text}}</a> -->
          {{ getStatus(text) }}
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+activeKey === 1">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit', record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="是否确定完结项目吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="doAction('over', record)"
            >
              <a type="primary">完结</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('start', record)">立项</a>
          </template>

          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit', record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="是否确定完结项目吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="doAction('over', record)"
            >
              <a type="primary">完结</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('transfer', record)">转让</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('meetingRecord', record)">会议记录</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('setProcess', record)">项目进程设置</a>
          </template>

          <template v-if="+activeKey === 3">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
          <template v-if="+activeKey === 3 || +activeKey === 2">
            <a-divider type="vertical" />
            <a type="primary" @click="process(record)">查看项目进程</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm key="k1" ref="addForm" @finish="searchAction" />
    <Transfer key="k2" ref="transfer" @finish="searchAction" />
    <MeetingAddForm ref="meetingAddForm" />
    <StartProject ref="startProject" @finish="searchAction" />
    <SetProjectProcess ref="setProjectProcess" @finish="searchAction" />
  </div>
</template>

<script>
import {
  listProjectAllPageList,
  listProjectAllDetail,
  finishProjectStatus,
  getMeetingRecordDetail,
} from '@/api/researchManagementByWzz'
import AddForm from './modules/AddForm'
import Transfer from './modules/Transfer'
// import MeetingAddForm from '@/views/meeting-management/records/module/AddForm.vue'
import MeetingAddForm from './modules/MeetingView'

import StartProject from './modules/StartProject'
import SetProjectProcess from './modules/SetProjectProcess'

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
    title: '项目编号',
    dataIndex: 'projectCode',
  },
  {
    align: 'center',
    title: '项目开发模式',
    dataIndex: 'modelType',
    scopedSlots: { customRender: 'modelType' },
  },
  {
    align: 'center',
    title: '项目名称',
    dataIndex: 'projectName',
  },
  {
    align: 'center',
    title: '项目负责人',
    dataIndex: 'chargeUserName',
  },
  {
    align: 'center',
    title: '项目进程',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdUserName',
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

function makeProjectDevelopmentMode() {
  const arr = ['全部', '自主研发新产品', '客户定制新产品', '产品研发改进', '非常规产品开发']
  return arr.map((v, idx) => {
    return { id: idx, text: v }
  })
}

function makeProjectProcess() {
  const arr = [
    '立项阶段',
    '设计方案评审',
    '试制资料输出',
    '产品试制',
    '可行性测试',
    '可行性测试结果联合评审',
    '稳定性测试',
    '稳定性测试结果评审',
    '配置方案研发',
    '配置方案研发评审',
    '配置方案技术资料归档',
    '设计模块',
    '工艺研发',
    '工艺下达',
    '小批量生产',
    '小批量生产评审',
    '样品展示',
    '批量生产&完结',
  ]
  return arr
    .map((v, idx) => {
      return {
        id: idx + 1,
        text: v,
      }
    })
    .filter((item) => item.id > 0)
}

export default {
  name: 'project-management-Project-list',
  components: {
    AddForm,
    Transfer,
    MeetingAddForm,
    StartProject,
    SetProjectProcess,
  },
  data() {
    return {
      projectDevelopmentModes: Object.freeze(makeProjectDevelopmentMode()),
      projectProcesses: Object.freeze(makeProjectProcess()),
      searchParam: {
        searchStatus: 1,
      },
      activeKey: 1,
      tabList: [
        { key: 1, label: '申请立项', count: 0 },
        { key: 2, label: '进行中', count: 0 },
        { key: 3, label: '已完结', count: 0 },
      ],
      depList: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'project-management-Project-list') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      const that = this
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      listProjectAllPageList(_searchParam)
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
            that.search()
          }
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    process(record) {
      this.$router.push({
        name: 'project-management-My-projectProgress',
        params: { record: record },
      })
    },
    async doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record)
        return
      } else if (actionType === 'over') {
        //完结
        finishProjectStatus({ projectId: record.id, finishStauts: 1 }).then((res) => {
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.searchAction()
          }
        })
        return
      } else if (actionType === 'start') {
        //立项
        that.$refs.startProject.query('start', record)
        return
      } else if (actionType === 'transfer') {
        that.$refs.transfer.query(actionType, record)
      } else if (actionType === 'meetingRecord') {
        let detail = await getMeetingRecordDetail({ meetingNum: record.meetingCode })
          .then((res) => res.data)
          .catch((err) => {
            return null
          })
        if (detail === null) {
          that.$message.info(`通过会议编码查询会议记录详情接口失败 【meetingCode:${record.meetingCode}】`)
          return
        }
        that.$refs.meetingAddForm.query('view', { ...detail })
        return
      } else if (actionType === 'setProcess') {
        that.$refs.setProjectProcess.query(actionType, record)
        return
      } else {
        that.$message.info(`未知指令：${actionType}`)
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam = {
        ...this.searchParam,
        searchStatus: this.activeKey,
      }
      this.searchAction({ current: 1 })
    },
    rangePickerChange(arr, arrStr) {
      if (arr.length === 0) {
        this.searchParam = { ...this.searchParam, beginDate: undefined, endDate: undefined }
      } else {
        this.searchParam = { ...this.searchParam, beginDate: arrStr[0], endDate: arrStr[1] }
      }
    },
    getModelType(type) {
      return this.projectDevelopmentModes[type].text
    },
    getStatus(type) {
      return this.projectProcesses[+type - 1].text
    },
  },
}
</script>

<style scoped>
.project-records-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
</style>
