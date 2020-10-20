<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-input placeholder="名称" v-model="queryParam.name" allowClear style="width: 200px; margin-right: 10px" />
      <a-button style="margin-left: 10px" type="primary" @click="searchAction()">查询</a-button>
      <template v-if="$auth('Distribution:add')">
        <a-button style="float: right" type="primary" icon="plus" @click="handleAdd('add', null)">新增</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
        v-if="$auth('Distribution:list')"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="action" slot-scope="text, record">
          <a @click="AddRule('add', record)">添加规则</a>
          <a-divider type="vertical" />
          <a @click="RuleDetails(record)">规则明细</a>
          <template>
            <a-divider type="vertical" />
            <a @click="handleAdd('edit-salary', record)">修改</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" @click="delete_list(record.id)">删除</a>
          </template>
        </span>
      </a-table>
      <AddForm ref="addForm" @finish="searchAction()" />
      <AppFrom ref="appFrom" />
    </a-layout>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getDevisionList, getStationList } from '@/api/systemSetting'
import { salary_base_sale_List, salary_Sale_RemoveSalaryBaseSaler } from '@/api/bonus_management'
import AddForm from './module/Formadd'
import AppFrom from './module/AppFrom'

const columns = [
  {
    dataIndex: 'order',
    title: '序号',
    key: 'order',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '适用岗位',
    dataIndex: 'stationNames',
    key: 'stationNames',
    align: 'center',
  },
  {
    title: '奖金名称',
    dataIndex: 'bounsDicNames',
    key: 'bounsDicNames',
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]
export default {
  name: 'RoleManagement',
  components: {
    AddForm,
    AppFrom,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      columns,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      pagination1: {},
      queryParam: {
        current: 1,
      },
      hiddenBoolean: false,

      selectedRowKeys: [],
      selectedRows: [],
      //   postSelectDataSource: [], //岗位
      //   // 部门列表
      //   departmentList: [],
      //   // 角色列表
      //   roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-base-sale-rules') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment: moment,

    init() {
      let that = this
      //   getDevisionList().then((res) => {
      //     this.departmentList = res.data
      //   })
      this.searchAction()
    },
    // depChangeHandler(dep_id) {
    //   let that = this
    //   that.postSelectDataSource = []
    //   return getStationList({ id: dep_id }).then((res) => {
    //     that.postSelectDataSource = res.data
    //   })
    // },
    searchAction(opt) {
      let that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      salary_base_sale_List(_searchParam)
        .then((res) => {
          that.loading = false
          this.queryParam.accountDate = ''
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
    delete_list(id) {
      let that = this
      salary_Sale_RemoveSalaryBaseSaler(`id=${id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          that.$message.error(res.msg)
        }
      })
    },
    //新增 修改
    handleAdd(type, record) {
      this.$refs.addForm.query(type, record)
    },
    AddRule(type, record) {
      this.$refs.appFrom.query(type, record)
    },
    //规则明细
    RuleDetails(record) {
      this.$router.push({ name: 'salary-base-sale-module', params: { id: record.id } })
      // this.$refs.ruleDetails.query(type, record)
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.left-tree {
  display: flex;
}

.treewrap {
  margin-right: 24px;
}

.righttab {
  width: 100%;
}
</style>
