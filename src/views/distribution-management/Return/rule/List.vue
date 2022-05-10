<template>
  <!-- 回访规则 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-button
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        v-if="dataSource.length === 0"
        >新增</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :loading="loading">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template>
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
          <template>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit', record)">修改</a>
          </template>
          <template>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="doAction('del', record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import { recordRuleList, recordRuledelete } from '@/api/distribution-management'
import AddForm from './AddForm'
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
    title: '回访比例（%）',
    dataIndex: 'proportion',
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
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
  name: 'distribution_management_rule',
  components: {
    AddForm,
  },
  data() {
    return {
      depId: undefined,

      meetingTypesList: [],
      depList: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
        size: '10',
      },
      loading: false,
      bindEnterFn: null,
    }
  },
  computed: {
    searchParam() {
      return {
        departmentId: this.depId,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'distribution_management_rule') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
  methods: {
    init() {
      let that = this
      departmentList().then((res) => (that.depList = res.data))
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.size || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      recordRuleList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch((err) => (that.loading = false))
    },
    onShowSizeChangeHandler(current, pageSize) {
      let pagination = { ...this.pagination }
      pagination.current = current
      pagination.size = String(pageSize)
      this.pagination = pagination
      this.searchAction()
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'del') {
        //console.log(record)
        recordRuledelete({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      this.$refs.addForm.query(actionType, record)
    },
  },
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
