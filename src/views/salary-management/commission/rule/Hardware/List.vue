<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-select
        style="width: 200px; margin-right: 10px"
        placeholder="选择部门"
        :allowClear="true"
        v-model="queryParam.deptId"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
      <a-input placeholder="姓名" v-model="queryParam.userName" allowClear style="width: 200px; margin-right: 10px" />
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <template v-if="$auth('other:add')">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="doAction('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown>
      </template>

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-table
        v-if="$auth('other:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="$auth('other:view')">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
          <template>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit-salary', record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
              <a type="primary">删除</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import { bonus_getDepartmentByType } from '@/api/bonus_management'
import { softHard_list, softHard_del } from '@/api/bonus_management'
import AddForm from './module/Formadd'

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
    dataIndex: 'deptName',
    key: 'deptName',
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    align: 'center',
    title: '提成',
    dataIndex: 'percentageRetio',
    key: 'percentageRetio',
  },
  {
    align: 'center',
    title: '提成产品',
    dataIndex: 'productText',
    key: 'productText',
  },
  {
    align: 'center',
    title: '备注',
    key: 'remarks',
    dataIndex: 'remarks',
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
    AddForm,
  },
  data() {
    return {
      visible: false,
      depList: [],
      queryParam: { current: 1 },
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
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
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-Hardware') {
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
      that.searchAction()
      bonus_getDepartmentByType({ type: 4 }).then((res) => (this.depList = res.data))
    },

    // 删除
    confirmDelete(record) {
      let that = this
      softHard_del({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      that.loading = true
      softHard_list(_searchParam)
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
