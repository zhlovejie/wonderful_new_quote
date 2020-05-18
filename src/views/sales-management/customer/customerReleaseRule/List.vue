<template>
  <!-- 客户释放设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-button v-if="dataSource.length === 0" style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
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

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>

<script>
import {
  customerReleaseRuleDetail,
  customerReleaseRuleDelete,
  customerReleaseRuleAddOrUpdate
} from '@/api/customerReleaseRule'
import AddForm from './AddForm'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '规则名称',
    dataIndex: 'roleName'
  },
  {
    align: 'center',
    title: '设定时间(月)',
    dataIndex: 'periodMonth'
  },
  {
    align: 'center',
    title: '金额设置(元)',
    dataIndex: 'roleMoney'
  },
  {
    align: 'center',
    title: '开启时间',
    dataIndex: 'startTime'
  },
  {
    align: 'center',
    title: '结束时间',
    dataIndex: 'endTime'
  },
  {
    align: 'center',
    title: '原销售提取限制(天)',
    dataIndex: 'intervalTime'
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
  name: 'customerReleaseRule',
  components: {
    AddForm: AddForm
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false
    }
  },
  computed: {
    searchParam() {
      return {
        
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'customerReleaseRule') {
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
    searchAction(opt = {}) {
      let that = this
      //let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      //console.log('执行搜索...', _searchParam)
      that.loading = true
      customerReleaseRuleDetail()
        .then(res => {
          that.loading = false
          let result = res.data = res.data ? [res.data] : []
          that.dataSource = result.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total =  0
          pagination.current = 1
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
    doAction(actionType, record) {
      let that = this
     if(actionType === 'add' || actionType === 'edit'){
        that.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        console.log(record)
        customerReleaseRuleDelete(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }  else {
        this.$message.info('功能尚未实现！')
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
.wdf-custom-wrapper .search-wrapper{
  overflow: hidden;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
