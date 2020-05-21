<!-- 群主管理 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="群名称模糊查询" style="width: 160px" v-model="searchParam.groupName" :allowClear="true" />
      <a-input placeholder="群主模糊查询" style="width: 160px" v-model="searchParam.userName" :allowClear="true" />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button
        class="a-button"
        style="float:right;"
        type="primary"
        icon="plus"
        @click="doAction('add',null)"
      >新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">{{ index + 1 }}</div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('editRecord',record)">修改记录</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a href="javascript:void(0);">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
    <UpdateRecord ref="updateRecord" />
  </div>
</template>
<script>
import {
  comManageGroupPage,
  comManageGroupDelete
} from '@/api/communicationManagement'
import AddForm from './AddForm'
import UpdateRecord from './UpdateRecord'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '群名称',
    dataIndex: 'groupName'
  },
  {
    align: 'center',
    title: '群主',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'communication-management-group-leader',
  components: {
    AddForm: AddForm,
    UpdateRecord:UpdateRecord
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
      packageDetail: '',
      visible: false
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'communication-management-group-leader') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      comManageGroupPage(_searchParam)
        .then(res => {
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
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if (type === 'add' || type === 'edit' || type === 'view') {
        this.$refs.addForm.query(type, record)
        return
      }
      if(type === 'editRecord'){
        this.$refs.updateRecord.query(type,record)
        return
      }
      if (type === 'del') {
        comManageGroupDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
    }
  }
}
</script>
<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>