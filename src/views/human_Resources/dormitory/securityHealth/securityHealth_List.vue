 <template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
      <a-select
        style="width:200px; margin-right: 10px;"
        v-model="queryParam.roomCode"
        placeholder="房间号"
      >
        <a-select-option
          v-for="item in departmentList"
          :key="item.id"
          :value="item.roomCode"
        >{{ item.roomCode }}</a-select-option>
      </a-select>
      <a-select
        placeholder="公告状态"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px;margin-right:10px;"
      >
        <a-select-option :value="0">待审批</a-select-option>
        <a-select-option :value="1">完结</a-select-option>
      </a-select>
      <a-range-picker @change="dateChange" style="width:400px ;margin-right:10px;" />
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
          <div slot="status" slot-scope="text, record, index">
            <template v-if="record.status===1">
              <span>完结</span>
            </template>
            <template v-else>
              <span>待处理</span>
            </template>
          </div>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="inspect('see' ,record)">查看</a>
            </template>
            <template v-if="+record.status===1">
              <a-divider type="vertical" />
              <a @click="inspect('edit-salary',record)">修改</a>
              <a-divider type="vertical" />
              <a @click="download(record)">下载</a>
            </template>
            <template v-if="+record.status===0">
              <a-divider type="vertical" />
              <a @click="inspect('handle',record)">处理</a>
            </template>
          </span>
        </a-table>
      </a-layout-content>
    </a-layout>
    <AddForm ref="addForm" @finish="searchAction()" />
    <Dormitory ref="dormitory" @finish="searchAction()" />
  </a-card>
</template>

<script>
import { securityHealth_List, listRoom } from '@/api/humanResources'
import systemConfig from '@/config/defaultSettings'
import AddForm from './module/FormAdd'
import Dormitory from './module/Dormitory'

export default {
  name: 'RoleManagement',
  components: {
    AddForm,
    Dormitory,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      system: systemConfig.baseURL + '/room/room-examine/download/roomExamineDownload',
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
          title: '房间号',
          key: 'roomCode',
          dataIndex: 'roomCode',
        },
        {
          align: 'center',
          title: '检查人',
          dataIndex: 'inspectName',
          key: 'inspectName',
        },
        {
          align: 'center',
          title: '检查时间',
          dataIndex: 'inspectTime',
          key: 'inspectTime',
        },
        {
          align: 'center',
          title: '状态',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          align: 'center',
          title: '提交人',
          key: 'createdName',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '提交时间',
          key: 'createdTime',
          dataIndex: 'createdTime',
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

      // 房间列表
      departmentList: [],
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_securityHealth') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      listRoom({}).then((res) => {
        this.departmentList = res.data
      })
      this.searchAction()
    },
    // 获取时间
    dateChange(date, dateString) {
      this.queryParam.startDate = dateString[0]
      this.queryParam.endDate = dateString[1]
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
      securityHealth_List(_searchParam)
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

    download(record) {
      window.location.href = this.system + `?id=${record.id}`
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },

    handle(type, record) {
      this.$refs.addForm.query(type, record)
    },
    inspect(type, record) {
      this.$refs.dormitory.query(type, record)
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
