<template>
  <!-- 离职申请 -->
  <div class="severance-apply-list-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        :allowClear="true"
        @change="depChangeHandler"
        v-model="depId"
        style="width: 200px"
      >
        <a-select-option
          v-for="item in depSelectDataSource"
          :key="item.id"
          :value="item.id"
        >
        {{item.departmentName}}
        </a-select-option>
      </a-select>

      <a-select
        placeholder="选择岗位"
        :allowClear="true"
        v-model="stationId"
        style="width: 200px"
      >
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >
        {{item.stationName}}
        </a-select-option>
      </a-select>
      <a-select
        placeholder="离职类别"
        :allowClear="true"
        v-model="operation_type"
        style="width: 120px"
      >
        <a-select-option :value="1">事故型辞退</a-select-option>
        <a-select-option :value="2">裁员型辞退</a-select-option>
        <a-select-option :value="3">自愿离职</a-select-option>
      </a-select>
      <a-select
        placeholder="处理状态"
        :allowClear="true"
        v-model="operation_status"
        style="width: 120px"
      >
        <a-select-option :value="0">处理中</a-select-option>
        <a-select-option :value="1">已完结</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a href="https://www.delanshi.cn/images/cloud/20200409/辞职报告df1cb1eb-1a80-41a7-9db1-2cbe105ae9be.docx" class="a-button ant-btn ant-btn-primary" target="_blank">下载辞职报告模板</a>
      <a href="https://www.delanshi.cn/images/cloud/20200409/交接单2dcdff6c-88a7-484d-9e8a-2e59db9940c8.docx" class="a-button ant-btn ant-btn-primary" target="_blank">下载交接单模板</a>
      <!-- <a-button class="a-button" type="primary" icon="download" @click="downloadAction(1)">下载辞职报告模板</a-button>
      <a-button class="a-button" type="primary" icon="download" @click="downloadAction(2)">下载交接单模板</a-button> -->
      <a-button
        class="a-button"
        style="float:right;"
        type="primary"
        icon="plus"
        @click="doAction('add',null)"
        v-if="$auth('severanceApply:add')"
      >新增</a-button>
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

        <div slot="status" slot-scope="text, record, index">
          <span>{{ record.status == 0 ? '处理中' : (record.status == 1 ? '完结' : '未知状态') }}</span>
        </div>

        <div slot="type" slot-scope="text, record, index">
          <span>{{ record.type == 1 ? '事故型辞退' : (record.type == 2 ? '裁员型辞退' : '自愿离职') }}</span>
        </div>

        <div slot="reportId" slot-scope="text, record, index">
          <template v-if="record.reportId">
            <a @click="viewAccidentReport(record.reportId)">查看</a>
          </template>
          <template v-else>无</template>
        </div>
        <div slot="reportLeaveUrl" slot-scope="text, record, index">
          <template v-if="record.reportLeaveUrl">
            <a @click="xdocView(record.reportLeaveUrl)">查看</a>
          </template>
          <template v-else>无</template>
        </div>
        <div slot="leaveReportBookUrl" slot-scope="text, record, index">
          <template v-if="record.leaveReportBookUrl">
            <a @click="xdocView(record.leaveReportBookUrl)">查看</a>
          </template>
          <template v-else>无</template>
        </div>

        <div slot="agreeUrl" slot-scope="text, record, index">
          <template v-if="record.agreeUrl">
            <a @click="xdocView(record.agreeUrl)">查看</a>
          </template>
          <template v-else>无</template>
        </div>
        <div slot="goodsHandUrl" slot-scope="text, record, index">
          <template v-if="record.goodsHandUrl">
            <a @click="xdocView(record.goodsHandUrl)">查看</a>
          </template>
          <template v-else>无</template>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <template v-if="$auth('severanceApply:edit') && record.showModifyButtonFlag === 1" >
            <a-divider type="vertical"/>
            <a type="primary" @click="doAction('edit',record)">修改</a>
          </template>
          <template v-if="$auth('severanceApply:del') && record.showModifyButtonFlag === 1" >
            <a-divider type="vertical"/>
            <a type="primary" @click="doAction('del',record)">删除</a>
          </template>
          <a-divider type="vertical"/>
          <a type="primary" @click="doAction('upload',record)">上传</a>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
    <AccidentReportForm ref="accidentReportForm" />
    <UploadForm ref="uploadForm" @finish="searchAction()"/>
    <XdocView ref="xdocView" />
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { personLeaveApplyPageList ,deletePersonnelLeaveApply} from '@/api/personnelManagement'
import AddForm from './module/AddForm'
//查看事故调查表
import AccidentReportForm from '@/views/personnel-management/apply/accident-report/module/AddForm'
//上传模块
import UploadForm from './module/UploadFile'

import XdocView from './module/XdocView'

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
    title: '离职类别',
    dataIndex: 'type',
    key: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    align: 'center',
    title: '离职人',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    align: 'center',
    title: '事故调查报告',
    key: 'reportId',
    scopedSlots: { customRender: 'reportId' }
  },
  {
    align: 'center',
    title: '辞退告知书',
    key: 'reportLeaveUrl',
    scopedSlots: { customRender: 'reportLeaveUrl' }
  },
  {
    align: 'center',
    title: '辞职报告',
    key: 'leaveReportBookUrl',
    scopedSlots: { customRender: 'leaveReportBookUrl' }
  },
  {
    align: 'center',
    title: '离职协议',
    key: 'agreeUrl',
    scopedSlots: { customRender: 'agreeUrl' }
  },
  {
    align: 'center',
    title: '物品交接单',
    key: 'goodsHandUrl',
    scopedSlots: { customRender: 'goodsHandUrl' }
  },
  {
    align: 'center',
    title: '处理状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '申请人',
    dataIndex: 'createdUserName',
    key: 'createdUserName'
  },
  {
    align: 'center',
    title: '申请时间',
    key: 'createdTime',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SeveranceApply',
  components: {
    AddForm:AddForm,
    AccidentReportForm:AccidentReportForm,
    UploadForm:UploadForm,
    XdocView:XdocView
  },
  data() {
    return {
      depId: undefined,
      stationId:undefined,
      operation_status: undefined,
      operation_type: undefined,
      depSelectDataSource:[],
      postSelectDataSource:[],
      activeKey: 0,
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false
    }
  },
  computed: {
    searchParam() {
      return {
        userDepartmentId: this.depId,
        userStationId: this.stationId,
        type:this.operation_type,
        status:this.operation_status
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'severance-apply') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
      //部门
      departmentList().then(res => (that.depSelectDataSource = res.data))
      //事故异常类型
      //getDictionaryList({ parentId: 477 }).then(res => (that.accidentTypeSelectDataSource = res.data))
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign(
        {},
        { ...this.searchParam },
        { ...this.pagination },
        opt || {},
        { approveStatus: that.activeKey }
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      personLeaveApplyPageList(_searchParam)
        .then(res => {
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
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if(type === 'del'){
        deletePersonnelLeaveApply({applyId:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        })
      }else if(type === 'upload'){
        this.$refs.uploadForm.query(record)
      }
      else{
        this.$refs.addForm.query(type, record)
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, approveStatus: this.activeKey })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    depChangeHandler(depId) {
      getStationList({ id: depId }).then(res => (this.postSelectDataSource = res.data))
    },
    empty(obj){
      console.log(obj,typeof obj)
      if(typeof obj === 'string'){
        obj = obj.trim()
      }
      return obj === null || obj === undefined || obj === ''
    },
    viewAccidentReport(id){
      this.$refs.accidentReportForm.query('view',{id:id})
    },
    xdocView(docUrl){
      this.$refs.xdocView.query(docUrl)
    }
  }
}
</script>
<style scoped>
.severance-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.severance-apply-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
