<template>
  <!-- 会议记录 -->
  <div class="meeting-records-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <div class="action-wrapper" style="float: right" v-if="dataSource.length === 0">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :loading="loading">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
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
import { delMeetingPenaltyRules, getMeetingPenaltyRulesPageList } from '@/api/meetingManagement'
import AddForm from './AddForm'
import moment from 'moment'
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
    title: '规则名称',
    dataIndex: 'ruleName',
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
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'meeting-penalty-rules',
  components: {
    AddForm,
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
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'meeting-penalty-rules') {
          this.init()
        }
      },
      immediate: true,
    },
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
      getMeetingPenaltyRulesPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.ruleName = '会议处罚规则'
            item.key = index + 1
            return item
          })
        })
        .catch((err) => (that.loading = false))
    },
    doAction(actionType, record) {
      const that = this
      if (actionType === 'del') {
        delMeetingPenaltyRules({ id: record.id }).then((res) => {
          if (+res.code === 200) {
            that.searchAction()
          }
          that.$message.info(res.msg)
        })
        return
      } else {
        that.$refs.addForm.query(actionType, record)
      }
    },
  },
}
</script>

<style scoped>
.meeting-records-wrapper {
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
