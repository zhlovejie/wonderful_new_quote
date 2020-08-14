<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
      <a-select
        style="width:200px; margin-right: 10px;"
        v-model="queryParam.departmentId"
        @change=" depChangeHandler"
        placeholder="请选择部门"
      >
        <a-select-option
          v-for="item in departmentList"
          :key="item.id"
          :value="item.id"
        >{{ item.departmentName }}</a-select-option>
      </a-select>
      <a-select placeholder="选择岗位" v-model="stationId" :allowClear="true" style="width: 200px">
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>
      <a-button style="margin-left:10px;" type="primary" @click="searchAction">查询</a-button>
      <template v-if="$auth('role:add')">
        <a-button style="float:right;" type="primary" icon="plus" @click="handle('add',null)">新增</a-button>
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
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handle('edit',record)">查看</a>
            </template>
            <template v-if="+record.createdId  === +userInfo.id">
              <a-divider type="vertical" />
              <a @click="handle('view',record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否删除"
                ok-text="是"
                cancel-text="否"
                @confirm="deleteRoleInfo(record)"
              >
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-layout-content>
    </a-layout>
    <!-- <AddForm ref="addForm" @finish="searchAction()" /> -->
  </a-card>
</template>

<script>
import { getDevisionList, getStationList } from '../../../../api/systemSetting'
import { contractAgreement_List } from '@/api/humanResources'
// import AddForm from './module/AddForm'

export default {
  name: 'RoleManagement',
  components: {
    // AddForm,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      queryParam: {},
      postSelectDataSource: [], //
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
          title: '部门',
          key: 'departmentName',
          dataIndex: 'departmentName',
        },
        {
          align: 'center',
          title: '岗位',
          dataIndex: 'stationName',
          key: 'stationName',
        },
        {
          align: 'center',
          title: '提交人',
          dataIndex: 'createdUserName',
          key: 'createdUserName',
        },
        {
          align: 'center',
          title: '提交时间',
          key: 'createdTime',
          dataIndex: 'createdTime',
        },
        {
          align: 'center',
          title: '修改时间',
          key: 'modifyTime',
          dataIndex: 'modifyTime',
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

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_allocation') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
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
      contractAgreement_List(_searchParam)
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
      //   this.$refs.table && this.$refs.table.refresh(true)
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchActionsee()
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },

    handle(type, record) {
      //   this.$refs.addForm.query(type, record)
    },
    // 删除
    deleteRoleInfo(record) {
      let that = this
      postAllocation_Remove({ departmentId: record.departmentId, stationId: record.stationId }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
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
