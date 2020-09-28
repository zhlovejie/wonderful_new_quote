<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-input
        placeholder="产品名称"
        v-model="queryParam.productName"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-button style="margin-left: 10px" type="primary" @click="searchAction">查询</a-button>
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
    <!-- <Occupancy ref="occupancy" /> -->
  </a-card>
</template>

<script>
// import { getDevisionList, getStationList } from '../../../../api/systemSetting'
// import { electricity_List, listRoom, electricityDelete } from '@/api/humanResources'
import { oaSalaryInfo_list } from '@/api/bonus_management'
import AddForm from './module/Formadd'
// import Occupancy from './module/Occupancy'

export default {
  name: 'RoleManagement',
  components: {
    AddForm,
    // Occupancy,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      queryParam: {},
      //   postSelectDataSource: [], //
      recordResult: {},
      queryRecord: {},
      pagination: {
        current: 1,
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
          title: '释放周期',
          dataIndex: 'emptyBed',
          key: 'emptyBed',
        },
        {
          align: 'center',
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
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
      let _searchParam = Object.assign(
        { socialSecurityId: that.recordId },
        { ...this.queryParam },
        { ...this.pagination }
      )
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
      // console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
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
      electricityDelete({ id: record.id }).then((res) => {
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
