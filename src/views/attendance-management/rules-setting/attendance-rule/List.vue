<template>
  <!-- 出勤规则设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="考勤组名称" v-model="searchParam.attanceName" allowClear style="width:150px;" />
        </a-form-item>
        <a-form-item>
          <a-select style="width: 150px" placeholder="考勤类型" v-model="searchParam.attanceType">
            <a-select-option :value="1">固定班制</a-select-option>
            <a-select-option :value="2">排班制</a-select-option>
            <a-select-option :value="3">自由工时</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select style="width: 150px" placeholder="时长处理" v-model="searchParam.isFreeType">
            <a-select-option :value="0">不计入调休</a-select-option>
            <a-select-option :value="1">计入调休</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
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
        <div slot="attanceType" slot-scope="text, record, index">
          <span>{{ +text === 1 ? '固定班制' : +text === 2 ? '排班制' : '自由工时' }}</span>
        </div>
        <div slot="workDays" slot-scope="text, record, index">
          <span>{{ workDaysFormat(text) }}</span>
        </div>
        <div slot="isFreeType" slot-scope="text, record, index">
          <span>{{ +text === 1 ? '计入调休' : '不计入调休' }}</span>
        </div>
        <div slot="caculatorHousType" slot-scope="text, record, index">
          <span>
            {{ 
              +record.attanceType === 3 
              ? (+record.caculatorHousType === 1 ? '按月' : +record.caculatorHousType === 2 ? '按周' :'按日') + ' 低于'+record.caculatorHous+'小时'
              : '-' 
            }}
          </span>
        </div>
        
        
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('paiban',record)">排班</a>
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
import {attenceDutyRuleList , attenceDutyRuleDel} from '@/api/attendanceManagement'
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
    title: '考勤组名称',
    dataIndex: 'attanceName'
  },
  {
    align: 'center',
    title: '考勤类型',
    dataIndex: 'attanceType',
    scopedSlots: { customRender: 'attanceType' }
  },
  {
    align: 'center',
    title: '班次',
    dataIndex: 'className'
  },
  {
    align: 'center',
    title: '工作日设置',
    dataIndex: 'workDays',
    scopedSlots: { customRender: 'workDays' }
  },
  {
    align: 'center',
    title: '时长处理',
    dataIndex: 'isFreeType',
    scopedSlots: { customRender: 'isFreeType' }
  },
  {
    align: 'center',
    title: '扣除规则',
    dataIndex: 'caculatorHousType',
    scopedSlots: { customRender: 'caculatorHousType' }
  },
  {
    align: 'center',
    title: '考勤组人员',
    dataIndex: 'attanceUsers'
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
  name: 'attendance-rule-list',
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
      searchParam:{}
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attendance-rules-setting-attendance-rule') {
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
      attenceDutyRuleList(_searchParam)
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
        attenceDutyRuleDel(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }else if(actionType === 'paiban'){
        return 
      }
    },
    workDaysFormat(strs){
      let w = ['','周一','周二','周三','周四','周五','周六','周日']
      let str = ''
      return strs.split(',').map(s =>w[s]).join(',')
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
