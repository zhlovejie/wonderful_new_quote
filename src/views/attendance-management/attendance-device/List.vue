<template>
  <!-- 考勤设备 -->
  <div class="wdf-custom-wrapper" id="attendance-over-time-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="设备名称" v-model="searchParam.name" allowClear style="width:200px;" />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="主板号"
            v-model="searchParam.mainboardNum"
            allowClear
            style="width:200px;"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="设备位置"
            v-model="searchParam.address"
            allowClear
            style="width:200px;"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
      </a-form>
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
        <!-- 操作 -->
        <span slot="action" slot-scope="text,record">
          <template v-if="$auth('depCustomer:edit') && record.perfectState != 6">
            <a @click="handleEdit(record)">修改</a>
          </template>
        </span>
      </a-table>
    </div>
    <EditForm ref="editForm" @finish="finish"/>
  </div>
</template>

<script>
import { getDeviceInfoList} from '@/api/attendanceManagement'
import EditForm from './modules/editForm'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '设备名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    align: 'center',
    title: '主板号',
    dataIndex: 'mainboardNum',
    key: 'mainboardNum'
  },
  {
    align: 'center',
    title: '设备位置',
    dataIndex: 'address'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'attendance-device',
  components: {
    // 组件
    EditForm
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam: {},
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attendance-device') {
          this.init()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getDeviceInfoList(_searchParam)
        .then(res => {
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
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    // 修改
    handleEdit(record) {
      this.$refs.editForm.query(record)
    },
    finish(){
      this.init()
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
