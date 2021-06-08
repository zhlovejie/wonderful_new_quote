<template>
  <!-- 设备列表 -->
  <div class="product-process-management_workshop-management">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="设备名称/设备编号模糊查询"
            v-model="searchParam.numORName"
            allowClear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="设备型号" v-model="searchParam.devType" allowClear style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="设备负责人" v-model="searchParam.devChargeName" allowClear style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="状态" v-model="searchParam.status" allowClear style="width: 180px">
            <a-select-option :value="1">在库</a-select-option>
            <a-select-option :value="2">保修中</a-select-option>
            <a-select-option :value="3">报废</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </div>
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
        <div slot="status" slot-scope="text, record, index">
          <span>{{ text === 1 ? '正常' : text === 2 ? '保修中' : '报废' }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit', record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="doAction('del', record)">
            <a type="primary">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm key="k1" ref="addForm" @finish="searchAction" />
  </div>
</template>

<script>
import AddForm from './modules/AddForm'
import { pageDevelopmentCraftDev } from '@/api/ProcessManagement'
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
    title: '设备编号',
    dataIndex: 'devNum',
  },
  {
    align: 'center',
    title: '设备名称',
    dataIndex: 'devName',
  },
  {
    align: 'center',
    title: '设备型号',
    dataIndex: 'devType',
  },
  {
    align: 'center',
    title: '设备负责人',
    dataIndex: 'devChargeName',
  },
  {
    align: 'center',
    title: '安装位置',
    dataIndex: 'installPosition',
  },

  {
    align: 'center',
    title: '设备状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'product-process-management_equipment-management_list',
  components: {
    AddForm,
  },

  data() {
    return {
      columns: columns,
      dataSource: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      searchParam: {},
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'product-process-management_equipment-management_list') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      const that = this
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      pageDevelopmentCraftDev(_searchParam)
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

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit'].includes(actionType)) {
        this.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        getDetailDelete({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      } else {
        that.$message.info(`未知指令：${actionType}`)
      }
    },
  },
}
</script>
<style scoped>
.product-process-management_workshop-management {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>