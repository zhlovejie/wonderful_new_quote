<template>
  <!-- 调休规则设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-button
        v-if="dataSource.length === 0"
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        >新增</a-button
      >
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
        <div slot="negative" slot-scope="text, record, index">
          <span>{{ { 1: '是', 2: '否' }[text] }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit', record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del', record)">
            <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('record', record)">调休超时记录</a>
        </div>
      </a-table>
    </div>

    <AddRuleForm ref="addForm" @finish="searchAction()" />
    <RestTimeoutList ref="restTimeoutList" @finish="searchAction()" />
  </div>
</template>

<script>
import { attenceRestRuleDetail, attenceRestRuleDelete } from '@/api/attendanceManagement'
import AddRuleForm from './AddRuleForm'
import RestTimeoutList from './RestTimeoutList'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '是否可以为负数',
    dataIndex: 'negative',
    scopedSlots: { customRender: 'negative' },
  },
  {
    align: 'center',
    title: '允许负小时数',
    dataIndex: 'negativeHours',
  },
  {
    align: 'center',
    title: '抵扣时限（多少天内可以抵消）',
    dataIndex: 'timeLimit',
  },
  {
    align: 'center',
    title: '创建人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'attenceRestRule',
  components: {
    AddRuleForm,
    RestTimeoutList,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      return {}
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-rules-setting-rest-timeout') {
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
    searchAction(opt = {}) {
      let that = this
      that.loading = true
      attenceRestRuleDetail()
        .then((res) => {
          that.loading = false
          let result = typeof res.data === 'object' && 'id' in res.data ? [res.data] : []
          that.dataSource = result.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = 0
          pagination.current = 1
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'add' || actionType === 'edit') {
        that.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        console.log(record)
        attenceRestRuleDelete(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            if (+res.code === 200) {
              that.searchAction()
            }
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'record') {
        that.$refs.restTimeoutList.query(actionType, record)
        return
      } else {
        that.$message.info('功能尚未实现！')
        return
      }
    },
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper {
  overflow: hidden;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
