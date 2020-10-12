<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <!-- <a-month-picker style="width:300px;" v-model="queryParam.Dates" /> -->
      <a-input
        placeholder="物流名称"
        v-model="queryParam.logisticsCompanyName"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-input
        placeholder="负责人"
        v-model="queryParam.personChargeName"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-input
        placeholder="负责人电话"
        v-model="queryParam.personChargeTelephone"
        allowClear
        style="width: 200px; margin-right: 10px"
      />

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
          <a @click="handleAdd('see', record)">查看</a>
          <template v-if="$auth('Distribution:add') && +record.createdId === +userInfo.id">
            <a-divider type="vertical" />
            <a @click="handleAdd('edit-salary', record)">修改</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" @click="delete_list(record.id)">删除</a>
          </template>
        </span>
      </a-table>

      <AddForm ref="addForm" @finish="searchAction()" />
    </a-layout>
  </a-card>
</template>

<script>
import moment from 'moment'
import { DistributionList, DistributionDelete } from '@/api/distribution-management'
import AddForm from './module/AddForm'

const columns = [
  {
    dataIndex: 'name',
    title: '序号',
    key: 'name',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '物流公司名称',
    dataIndex: 'logisticsCompanyName',
    key: 'logisticsCompanyName',
    align: 'center',
  },
  {
    title: '负责人',
    dataIndex: 'personChargeName',
    key: 'personChargeName',
    align: 'center',
  },
  {
    title: '负责人电话',
    dataIndex: 'personChargeTelephone',
    key: 'personChargeTelephone',
    align: 'center',
  },
  {
    title: '微信号',
    dataIndex: 'wechatNumber',
    key: 'wechatNumber',
    align: 'center',
  },
  {
    title: '公司地址',
    dataIndex: 'addressName',
    key: 'addressName',
    align: 'center',
  },
  {
    title: '提交人',
    dataIndex: 'createdName',
    key: 'createdName',
    align: 'center',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
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
    AddForm: AddForm,
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

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'distribution_Distribution') {
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
      this.searchAction()
    },
    check() {
      let that = this
      console.log(12312)
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      DistributionList(_searchParam)
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
      DistributionDelete({ id: id }).then((res) => {
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
