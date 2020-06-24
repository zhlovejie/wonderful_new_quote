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
        <div
          slot="holidayUnitType"
          slot-scope="text, record, index"
        >{{{1:'按天请假',3:'按小时请假'}[text] || '未知'}}</div>

        <div
          slot="holidayCaculatorType"
          slot-scope="text, record, index"
        >{{{1:'按工作日计算时长',2:'按自然日计算时长'}[text] || '未知'}}</div>

        <div slot="userRemain" slot-scope="text, record, index">{{{0:'不启用',1:'启用'}[text] || '未知'}}</div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
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
import { holidayRuleList, holidayRuleDel, holidayRuleDetail, holidayRuleAddAndUpdate } from '@/api/attendanceManagement'
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
    title: '假期名称',
    dataIndex: 'holidayName'
  },
  {
    align: 'center',
    title: '请假单位',
    dataIndex: 'holidayUnitType',
    scopedSlots: { customRender: 'holidayUnitType' }
  },
  {
    align: 'center',
    title: '计算请假时长方式',
    dataIndex: 'holidayCaculatorType',
    scopedSlots: { customRender: 'holidayCaculatorType' }
  },
  {
    align: 'center',
    title: '是否启用假期余额',
    dataIndex: 'userRemain',
    scopedSlots: { customRender: 'userRemain' }
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
  name: 'vacation-rule-list',
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
      loading: false
    }
  },
  computed: {
    searchParam() {
      return {}
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attendance-rules-setting-vacation-rule') {
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
      holidayRuleList(_searchParam)
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
      if (['add', 'edit', 'view'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        holidayRuleDel({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    getExchangeType(type) {
      return { 1: '调休0.5小时', 2: '调休1小时', 3: '调休1.5小时' }[type] || '未知'
    },

    getOverWorkCaculatorType(type) {
      return { 1: '按半小时加班', 2: '按小时加班', 3: '按半天加班', 4: '按天加班' }[type] || '未知'
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
