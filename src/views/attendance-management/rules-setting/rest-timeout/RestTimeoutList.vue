<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <div class="container-list-wrapper">
      <div class="search-wrapper">
        <a-input placeholder="用户名模糊查询" :allowClear="true" v-model="searchParam.userName" style="width: 200px" />

        <a-select placeholder="是否完结" :allowClear="true" v-model="searchParam.isFinish" style="width: 120px">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="2">否</a-select-option>
        </a-select>

        <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
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
          <div slot="deductWages" slot-scope="text, record, index">
            <span>{{ text | moneyFormatNumber }}</span>
          </div>
          <div slot="isFinish" slot-scope="text, record, index">
            <a-popconfirm v-if="+text === 2" title="是否执行完结操作？" @confirm="doAction('over', record)">
              <a>
                <span>未完结</span>
              </a>
            </a-popconfirm>
            <span v-else>已完结</span>
          </div>

          <div class="action-btns" slot="action" slot-scope="text, record">
            <a v-if="+record.isFinish === 2" type="primary" @click="doAction('update', record)">修改</a>
          </div>
        </a-table>
      </div>
      <AddForm ref="addForm" @finish="searchAction()" />
    </div>
  </a-modal>
</template>
<script>
import { attenceRestTimeoutPageList, attenceRestTimeoutUpdate } from '@/api/attendanceManagement'

import AddForm from './AddRestTimeoutForm'

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
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '超出小时数',
    dataIndex: 'exceedHours',
  },
  {
    align: 'center',
    title: ' 扣除工资',
    dataIndex: 'deductWages',
    scopedSlots: { customRender: 'deductWages' },
  },
  {
    align: 'center',
    title: ' 是否完结',
    dataIndex: 'isFinish',
    scopedSlots: { customRender: 'isFinish' },
  },
  {
    align: 'center',
    title: ' 提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'attendance-rules-setting-rest-timeout',
  components: {
    AddForm,
  },
  data() {
    return {
      modalTitle: '调休超时记录列表',
      visible: false,
      record: {},
      searchParam: {},
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
    }
  },
  methods: {
    init() {
      let that = this
      that.searchAction()
    },
    query(type, record = {}) {
      let that = this
      that.visible = true
      that.record = { ...record }
      that.$nextTick(() => {
        that.init()
      })
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.searchParam }, paginationParam)
      that.loading = true
      attenceRestTimeoutPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.effective = `${item.effectiveStart} ~ ${item.effectiveEnd}`
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
            that.searchAction()
          }
        })
        .catch((err) => (that.loading = false))
    },
    handleCancel() {
      this.visible = false
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },

    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(type, record) {
      let that = this
      if (type === 'over') {
        attenceRestTimeoutUpdate({ ...record, isFinish: 1 })
          .then((res) => {
            that.$message.info(res.msg)
            if (+res.code === 200) {
              that.searchAction()
            }
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else {
        that.$refs.addForm.query(type, record)
      }
    },
  },
}
</script>
<style scoped>
.container-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.container-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
