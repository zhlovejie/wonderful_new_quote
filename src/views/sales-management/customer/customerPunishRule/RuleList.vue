<template>
  <!-- 规则明细 -->
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="null"
  >
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
      <div slot="forfeit" slot-scope="text">
        <span>{{ text | moneyFormatNumber }}</span>
      </div>
      <div class="action-btns" slot="action" slot-scope="text, record">
        <a type="primary" @click="doAction('edit',record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
          <a>删除</a>
        </a-popconfirm>
      </div>
    </a-table>
    <AddForm ref="addForm" @finish="searchAction()" />
  </a-modal>
</template>

<script>
import {
  customerPunishDetailList,
  customerPunishDetailDelete
} from '@/api/customerReleaseRule'
import AddForm from './RuleForm'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '逾期天数(天)',
    dataIndex: 'overdueDay'
  },
  {
    align: 'center',
    title: '罚款(元)',
    dataIndex: 'forfeit',
    scopedSlots: { customRender: 'forfeit' }
  },
  {
    align: 'center',
    title: '处理',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'RuleList',
  components: {
    AddForm: AddForm
  },
  data() {
    return {
      modalTitle:'',
      visible:false,
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      record:{}
    }
  },
  computed: {
    searchParam() {
      return {
        
      }
    }
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      that.loading = true
      customerPunishDetailList({ruleId:that.record.id})
        .then(res => {
          that.loading = false
          let result = res.data || []
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
        customerPunishDetailDelete(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }
      else {
        this.$message.info('功能尚未实现！')
      }
    },
    async query(type, record={}) {
      let that = this
      that.actionType = type
      that.visible = true
      that.record = {...record}
      that.$nextTick(() => that.searchAction())
    },
    handleCancel(){
      this.visible = false
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
