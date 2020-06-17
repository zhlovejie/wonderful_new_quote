<template>
  <!-- 加班设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
          <a-button type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
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
        <div slot="tmp111111" slot-scope="text, record, index">
          <span>按审批时长计算</span>
        </div>

        <div slot="exchangeType" slot-scope="text, record, index">
          <span>{{getExchangeType(text)}}</span>
        </div>

        <div slot="overWorkCaculatorType" slot-scope="text, record, index">
          <span>{{getOverWorkCaculatorType(text)}}</span>
        </div>
        
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del',record)">
            <a type="primary" href="javascript:;">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction({current:1})" />
  </div>
</template>

<script>
import {overworkRuleList , overworkRuleDel} from '@/api/attendanceManagement'
import AddForm from './AddForm'
import moment from 'moment'
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
    title: '规则名称',
    dataIndex: 'ruleName'
  },
  {
    align: 'center',
    title: '计算方式',
    scopedSlots: { customRender: 'tmp111111' }
  },
  {
    align: 'center',
    title: '计为调休规则',
    dataIndex: 'exchangeType',
    scopedSlots: { customRender: 'exchangeType' }
  },
  {
    align: 'center',
    title: '最小加班单位',
    dataIndex: 'overWorkCaculatorType',
    scopedSlots: { customRender: 'overWorkCaculatorType' }
  },
  {
    align: 'center',
    title: '限制时间(天)',
    dataIndex: 'limitTime'
  },
  {
    align: 'center',
    title: '加班餐补(h)',
    dataIndex: 'overWorkLunchHours'
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
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'shift-rule-list',
  components: {
    AddForm
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
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
        if (to.name === 'attendance-rules-setting-over-time-rule') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      overworkRuleList(_searchParam)
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
    doAction(actionType, record) {
      let that = this
      if(['add','edit'].includes(actionType)){
        that.$refs.addForm.query(actionType,record)
      }else if(actionType === 'del'){
        overworkRuleDel({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    getExchangeType(type){
      return {1:'调休0.5小时',2:'调休1小时',3:'调休1.5小时'}[type] || '未知'
    },

    getOverWorkCaculatorType(type){
      return {1:'按半小时加班',2:'按小时加班',3:'按半天加班',4:'按天加班'}[type] || '未知'
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
