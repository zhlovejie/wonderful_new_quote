<template>
  <!-- 图纸权限管理 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        @change="depChangeHandler"
        v-model="searchParam.depId"
        :allowClear="true"
        style="width: 150px"
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
        style="width: 180px"
      >
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
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

        <div slot="stationNames" slot-scope="text, record, index" style="text-align:center;">
          <div class="__station_names">{{text}}</div>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { blueprintPermissionList, blueprintPermissionDel } from '@/api/researchManagement'
import AddForm from './AddForm'
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
    title: '名称',
    dataIndex: 'permissionName',
  },
  {
    align: 'center',
    title: '权限岗位',
    dataIndex: 'stationNames',
    scopedSlots: { customRender: 'stationNames' },
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'research-managements-drawing-managements-permissions',
  components: {
    AddForm: AddForm,
  },
  data() {
    return {
      searchParam: {},
      columns: columns,
      dataSource: [],
      depSelectDataSource: [],
      postSelectDataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'research-managements-drawing-managements-permissions') {
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
      departmentList().then((res) => {
        that.depSelectDataSource = res.data
      })
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      blueprintPermissionList(_searchParam)
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
        })
        .catch((err) => (that.loading = false))
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
      if (['add', 'edit', 'view'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        blueprintPermissionDel(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else {
        this.$message.info('功能尚未实现！')
      }
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      that.searchParam = Object.assign({}, that.searchParam, { stationId: undefined })
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
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
.__station_names {
  display: inline-block;
  max-width: 800px;
  word-break: break-all;
  text-align: justify;
}
</style>
