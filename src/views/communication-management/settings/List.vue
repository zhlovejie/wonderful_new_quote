<!-- 通讯设置 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        @change="depChangeHandler"
        v-model="searchParam.departmentId"
        :allowClear="true"
        style="width: 200px"
      >
        <a-select-option
          v-for="item in depSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.departmentName}}</a-select-option>
      </a-select>

      <a-select
        placeholder="选择岗位"
        v-model="searchParam.stationId"
        :allowClear="true"
        style="width: 200px"
      >
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>

      <a-select
        v-for="item in searchItems"
        :key="item.id"
        :placeholder="item.txt"
        v-model="searchParam[item.key]"
        :allowClear="true"
        style="width: 100px"
      >
        <a-select-option v-for="opt in item.options" :key="opt.id" :value="opt.id">{{opt.name}}</a-select-option>
      </a-select>

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
        <div slot="phone" slot-scope="text">{{ text === 1 ? '有' : '无' }}</div>
        <div slot="mobile" slot-scope="text, record, index">{{ text === 1 ? '有' : '无' }}</div>
        <div slot="email" slot-scope="text, record, index">{{ text === 1 ? '有' : '无' }}</div>
        <div slot="wxNum" slot-scope="text, record, index">{{ text === 1 ? '有' : '无' }}</div>
        <div slot="qqNum" slot-scope="text, record, index">{{ text === 1 ? '有' : '无' }}</div>
        <div slot="packageDetail" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('packageDetail',record)">查看</a>
        </div>

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
    <a-modal
      title="套餐详情"
      :width="450"
      :visible="visible"
      :footer="null"
      @cancel="visible = false"
    >{{packageDetail}}</a-modal>
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList //获取部门下面的岗位
} from '@/api/systemSetting'
import {
  comManageSettingsAddAndUpdate,
  comManageSettingsPage,
  comManageSettingsDetail,
  comManageSettingsGetSettingsByStationId,
  comManageSettingsExportExcel,
  comManageSettingsDelete
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
    title: '手机',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'phone' }
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'mobile',
    scopedSlots: { customRender: 'mobile' }
  },
  {
    align: 'center',
    title: '公司邮箱',
    dataIndex: 'email',
    scopedSlots: { customRender: 'email' }
  },
  {
    align: 'center',
    title: '公司微信号',
    dataIndex: 'wxNum',
    scopedSlots: { customRender: 'wxNum' }
  },
  {
    align: 'center',
    title: '公司QQ号',
    dataIndex: 'qqNum',
    scopedSlots: { customRender: 'qqNum' }
  },
  {
    align: 'center',
    title: '手机套餐',
    dataIndex: 'mobilePackage',
    scopedSlots: { customRender: 'mobilePackage' }
  },
  {
    align: 'center',
    title: '套餐详情',
    dataIndex: 'packageDetail',
    scopedSlots: { customRender: 'packageDetail' }
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'communication-management-settings',
  components: {
    AddForm: AddForm
  },
  data() {
    return {
      depSelectDataSource: [],
      postSelectDataSource: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchItems: [
        {
          id: 1,
          txt: '手机',
          key: 'phone',
          options: [
            { id: 1, name: '有' },
            { id: 0, name: '无' }
          ]
        },
        {
          id: 0,
          txt: '手机号',
          key: 'mobile',
          options: [
            { id: 1, name: '有' },
            { id: 0, name: '无' }
          ]
        },
        {
          id: 3,
          txt: '公司邮箱',
          key: 'email',
          options: [
            { id: 1, name: '有' },
            { id: 0, name: '无' }
          ]
        },
        {
          id: 4,
          txt: '公司微信号',
          key: 'wxNum',
          options: [
            { id: 1, name: '有' },
            { id: 0, name: '无' }
          ]
        },
        {
          id: 5,
          txt: '公司QQ',
          key: 'qqNum',
          options: [
            { id: 1, name: '有' },
            { id: 0, name: '无' }
          ]
        }
      ],
      searchParam: {},
      packageDetail: '',
      visible: false,
      exportFilePath: comManageSettingsExportExcel()
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'communication-management-settings') {
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
      comManageSettingsPage(_searchParam)
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
        comManageSettingsDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
      if (type === 'packageDetail') {
        that.packageDetail = record.packageDetail
        that.visible = true
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
    }
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