<template>
  <!-- 会议记录 -->
  <div class="meeting-records-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-button-group>
            <a-button
              type="primary"
              :class="{currentDayWeekMonth:dayWeekMonth === 1}"
              @click="simpleSearch(1)"
            >本周</a-button>
            <a-button
              type="primary"
              :class="{currentDayWeekMonth:dayWeekMonth === 2}"
              @click="simpleSearch(2)"
            >本月</a-button>
            <a-button
              type="primary"
              :class="{currentDayWeekMonth:dayWeekMonth === 3}"
              @click="simpleSearch(3)"
            >全部</a-button>
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="选择会议类别"
            v-model="meetingType"
            :allowClear="true"
            style="width: 150px"
          >
            <a-select-option
              v-for="item in meetingTypesList"
              :key="item.id"
              :value="item.id"
            >{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择会议部门" v-model="depId" :allowClear="true" style="width: 150px">
            <a-select-option
              v-for="item in depList"
              :key="item.id"
              :value="item.id"
            >{{item.departmentName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input placeholder="会议名称查询" v-model="meetingName" allowClear style="width:150px;" />
        </a-form-item>
        <a-form-item>
          <a-range-picker v-model="sDate" style="width:220px;" :allowClear="true" />
        </a-form-item>

        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
        <div class="action-wrapper" style="float:right;">
          <!-- <a-form-item>
          <a-button type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
          </a-form-item>-->
        </div>
      </a-form>
    </div>
    <div class="main-wrapper">
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
        <div slot="checkFlag" slot-scope="text, record, index">
          <span>{{ text === 1 ? '有' : '无' }}</span>
        </div>
        <div slot="status" slot-scope="text, record, index">
          <span>{{ getMeetingStatusTxt(text) }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('start',record)">发起会议</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要取消此会议？" @confirm="doAction('cancel',record)">
            <a>取消会议</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a type="primary" :href="record.templateUrl" target="_blank">下载会议模板</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('uploadRecords',record)">上传会议记录</a>
          <a-divider type="vertical" />
          <a type="primary" :href="record.recordUrl" target="_blank">预览会议记录</a>-->

          <template v-if="record.status === 0">
            <template v-if="record.authorationFlag === 1">
              <a type="primary" @click="doAction('start',record)">发起会议</a>
            </template>
          </template>

          <template v-if="record.status === 1 || record.status === 2">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <template v-if="record.authorationFlag === 1">
              <a-divider type="vertical" />
              <a-popconfirm title="是否要取消此会议？" @confirm="doAction('cancel',record)">
                <a>取消会议</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a type="primary" :href="record.templateUrl" target="_blank">下载会议模板</a>
            </template>
          </template>

          <template v-if="record.status === 3">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" :href="record.templateUrl" target="_blank">下载会议模板</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('uploadRecords',record)">上传会议记录</a>
          </template>

          <template v-if="record.status === 4">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('viewRecords',record)">预览会议记录</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
    <UploadRecords ref="uploadRecords" @finish="searchAction" />
    <XdocView ref="xdocView" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList //获取部门下面的岗位
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import {
  meetingRecordList,
  meetingRecordDetail,
  meetingRecordCancel,
  meetingRecordSaveOrUpdate,
  meetingRecordUpload
} from '@/api/meetingManagement'
import AddForm from './module/AddForm'
import UploadRecords from './module/UploadRecords'
import XdocView from '@/views/personnel-management/apply/severance-apply/module/XdocView'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '会议编号',
    dataIndex: 'meetingNum'
  },
  {
    align: 'center',
    title: '会议类别',
    dataIndex: 'typeDicName'
  },
  {
    align: 'center',
    title: '会议部门',
    dataIndex: 'departmentName'
  },
  {
    align: 'center',
    title: '会议名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '会议负责人',
    dataIndex: 'chargePersonName'
  },
  {
    align: 'center',
    title: '会议设定时间',
    dataIndex: 'eventTimeStr'
  },
  {
    align: 'center',
    title: '是否有考核',
    dataIndex: 'checkFlag',
    scopedSlots: { customRender: 'checkFlag' }
  },
  {
    align: 'center',
    title: '会议状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '会议时间',
    dataIndex: 'setTimeStr'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'meetingManagementSettings',
  components: {
    AddForm,
    UploadRecords,
    XdocView
  },
  data() {
    return {
      depId: undefined,
      meetingType: undefined,
      meetingName: undefined,
      sDate: [undefined, undefined],
      meetingTypesList: [],
      depList: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,

      dayWeekMonth: 1 //本周、本月、全部
    }
  },
  computed: {
    searchParam() {
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        departmentId: this.depId,
        typeDicId: this.meetingType,
        name: this.meetingName,
        beginTime: startTime,
        endTime: endTime,
        periodType: this.dayWeekMonth
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'meetingManagementRecords') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      //let that = this

      let that = this
      getDictionaryList({ parentId: 498 }).then(res => (that.meetingTypesList = res.data))
      departmentList().then(res => (that.depList = res.data))
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      meetingRecordList(_searchParam)
        .then(res => {
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
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'view') {
        this.$refs.addForm.query(actionType, record)
      } else if (actionType === 'start') {
        this.$refs.addForm.query(actionType, record)
      } else if (actionType === 'uploadRecords') {
        this.$refs.uploadRecords.query(actionType, record)
      } else if (actionType === 'viewRecords') {
        if (!record.recordUrl) {
          that.$message.info('尚未上传会议记录')
          return
        }
        this.$refs.xdocView.query(record.recordUrl)
      } else if (actionType === 'cancel') {
        meetingRecordCancel(`id=${record.id}`).then(res => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      } else {
        that.$message.info(`未知指令：${actionType}`)
      }
    },
    simpleSearch(type) {
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      this.searchAction()
    },
    getMeetingStatusTxt(status) {
      let m = {
        0: '未启动',
        1: '已启动',
        2: '会议中',
        3: '已结束',
        4: '已完结'
      }
      return m[status] || '未知'
    }
  }
}
</script>

<style scoped>
.meeting-records-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
