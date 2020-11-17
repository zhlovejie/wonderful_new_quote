<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="产品代码"
        allowClear
        v-model="queryParam.productCode"
      />
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="产品名称"
        allowClear
        v-model="queryParam.productName"
      />
      <a-select
        placeholder="产品状态"
        v-model="queryParam.productType"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="-1">全部</a-select-option>
        <a-select-option :value="0">常规产品</a-select-option>
        <a-select-option :value="1">非常规产品</a-select-option>
      </a-select>
      <a-button style="margin-left: 10px" type="primary" @click="searchAction({ current: 1 })">查询</a-button>
      <template v-if="$auth('electricity:add')">
        <a-button style="float: right" type="primary" icon="plus" @click="handle('add', null)">新增</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <a-table
          :columns="columns"
          :data-source="this.dataSource"
          :pagination="pagination"
          @change="handleTableChange"
          v-if="$auth('electricity:list')"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="emptyBed" slot-scope="text, record, index">
            <span>月度</span>
          </div>
          <div slot="productType" slot-scope="text, record, index">
            <template v-if="record.productType == 0">
              <span>常规产品</span>
            </template>
            <template v-else>
              <span>非常规产品</span>
            </template>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('electricity:add') && +record.createdId">
              <a @click="handle('edit-salary', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否删除" ok-text="是" cancel-text="否" @confirm="deleteRoleInfo(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-layout-content>
    </a-layout>
    <AddForm ref="addForm" @finish="init()" />
  </a-card>
</template>

<script>
import { oaSalaryInfo_list, oaSalaryInfo_delete } from '@/api/bonus_management'
import AddForm from './module/Formadd'

export default {
  name: 'RoleManagement',
  components: {
    AddForm,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      queryParam: { current: 1 },
      recordResult: {},
      queryRecord: {},
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          align: 'center',
          title: '产品代码',
          key: 'productCode',
          dataIndex: 'productCode',
        },
        {
          align: 'center',
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName',
        },
        {
          align: 'center',
          title: '类型',
          dataIndex: 'productType',
          key: 'productType',
          scopedSlots: { customRender: 'productType' },
        },
        {
          align: 'center',
          title: '释放周期',
          dataIndex: 'emptyBed',
          key: 'emptyBed',
          scopedSlots: { customRender: 'emptyBed' },
        },
        {
          align: 'center',
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //列表数据
      dataSource: [],
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'bonusRules_research') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.searchAction()
    },
    // 获取列表
    searchAction() {
      let that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 })
      oaSalaryInfo_list(_searchParam)
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

      this.searchActionsee()
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },
    //打开入住情况
    Occupancys() {
      console.log(12312)
      this.$refs.occupancy.query()
    },
    handle(type, record) {
      this.$refs.addForm.query(type, record)
    },
    // 删除
    deleteRoleInfo(record) {
      let that = this
      oaSalaryInfo_delete(`id=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
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
