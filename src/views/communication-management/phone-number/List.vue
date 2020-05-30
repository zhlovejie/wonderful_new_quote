<!-- 手机号管理 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        @change="depChangeHandler"
        v-model="searchParam.departmentId"
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option
          v-for="item in depSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.departmentName}}</a-select-option>
      </a-select>

      <a-select
        placeholder="选择岗位" 
        @change="postChangeHandler"
        v-model="searchParam.stationId"
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>

      <a-select 
        placeholder="选择人员"
        v-model="searchParam.userId" 
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option
          v-for="item in personSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.trueName}}</a-select-option>
      </a-select>

      <a-input placeholder="手机号模糊查询" style="width: 160px" v-model="searchParam.mobile" />
      <a-input placeholder="手机短号模糊查询" style="width: 160px" v-model="searchParam.mobileShort" />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button
        class="a-button"
        type="primary"
        icon="download"
        @click="doAction('download',null)"
      >下载</a-button>
      <a-button
        class="a-button"
        style="float:right;"
        type="primary"
        icon="plus"
        @click="doAction('add',null)"
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
        <div slot="order" slot-scope="text, record, index">{{ index + 1 }}</div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a href="javascript:void(0);">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByStation //获取岗位下人员
} from '@/api/systemSetting'
import {
  comManageMobileManagePage,
  comManageMobileManageExportExcel,
  comManageMobileManageDelete
} from '@/api/communicationManagement'
import AddForm from './AddForm'

const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'accountName'
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName'
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName'
  },
  {
    align: 'center',
    title: '使用人',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '手机',
    dataIndex: 'mobile',
  },
  {
    align: 'center',
    title: '手机短号',
    dataIndex: 'mobileShort',
  },
  {
    align: 'center',
    title: '手机密码',
    dataIndex: 'mobilePassword'
  },
  {
    align: 'center',
    title: '身份信息名称',
    dataIndex: 'identityName'
  },
  {
    align: 'center',
    title: '开卡时间',
    dataIndex: 'cardOpenTime'
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' }
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'communication-management-phone-number',
  components: {
    AddForm: AddForm
  },
  data() {
    return {
      depSelectDataSource: [],
      postSelectDataSource: [],
      personSelectDataSource:[],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam: {},
      packageDetail: '',
      visible: false,
      exportFilePath: comManageMobileManageExportExcel()
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'communication-management-phone-number') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      let that = this
      //depSelectDataSource
      departmentList().then(res => {
        that.depSelectDataSource = res.data
      })

      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      comManageMobileManagePage(_searchParam)
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
      if (type === 'add' || type === 'edit') {
        this.$refs.addForm.query(type, record)
        return
      }
      if (type === 'del') {
        comManageMobileManageDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
      if (type === 'download') {
        let eleA = document.createElement('a')
        eleA.href = that.exportFilePath
        eleA.target = '_blank'
        eleA.click()
        return
      }
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then(res => {
        that.postSelectDataSource = res.data
      })
    },
    postChangeHandler(stationId){
      this.personSelectDataSource = []
      getUserByStation({ stationId: stationId }).then(res => (this.personSelectDataSource = res.data))
    },
  }
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