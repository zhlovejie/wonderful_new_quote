<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker style="width: 200px" v-model="queryParam.month" />
      <a-select
        style="width: 200px; margin-left: 10px; margin-right: 10px"
        placeholder="选择部门"
        :allowClear="true"
        v-model="queryParam.departmentId"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
      <a-select
        placeholder="审核状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" :key="0" />
        <a-tab-pane tab="待我审批" :key="1" />
        <a-tab-pane tab="我已审批" :key="2" />
      </a-tabs>
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
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>

        <div slot="allAmount" slot-scope="text, record, index">
          <span>{{ text | moneyFormatNumber }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template v-if="record.status === 1">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('reback', record)">撤回</a>
            </template>

            <template v-if="record.status === 3 || record.status === 4">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('del', record)">删除</a>
            </template>
          </template>

          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('approval', record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="finishedHandler" />
  </div>
</template>
<script>

import {
  departmentList //所有部门
} from '@/api/systemSetting'
import {
  approvalSalaryMonthInstanceApply,
  exportSalaryExcel,
  getOaSalarySalerBounsApplyDetail,
  getOaSalarySalerBounsApplyPageList,
  removeSalarySalerBounsApply,
  withdrawSalarySalerBounsApply
} from '@/api/commissionDetail'

import AddForm from './module/AddForm'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
  },

  {
    title: '日期',
    dataIndex: 'month'
  },

  {
    title: '总提成(元)',
    dataIndex: 'allAmount',
    scopedSlots: { customRender: 'allAmount' }
  },

  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },

  {
    title: '提交人',
    dataIndex: 'createdUserName'
  },
  {
    title: '提交人时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  },
]

export default {
  name: 'sale-commission',
  components: {
    AddForm
  },
  data() {
    return {
      activeKey:0,
      depList: [],
      queryParam: {},
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
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'sale-commission') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init(){
      const that = this
      departmentList().then(res => that.depList = res.data)
      that.searchAction()
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '未通过',
        4: '已撤回',
        5: '已完结',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    searchAction(opt) {
      let that = this
      let month = undefined
      if (that.queryParam.month) {
        month = moment(that.queryParam.month).format('YYYY-MM')
      }
      let _searchParam = Object.assign({}, { ...that.queryParam ,month}, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      getOaSalarySalerBounsApplyPageList(_searchParam)
        .then((res) => {
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
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },

    doAction(type, record) {
      const that = this
      if(type === 'view'){
        that.$refs.addForm.query(type,record)
      }else if(type === 'del'){
        removeSalarySalerBounsApply(`id=${record.id}`).then(res =>{
          res.code === 200 && that.searchAction()
          that.$message.info(res.msg)
        }).catch(err => that.$message.error(err.message))
      }else if(type === 'reback'){
        withdrawSalarySalerBounsApply(`id=${record.id}`).then(res =>{
          res.code === 200 && that.searchAction()
          that.$message.info(res.msg)
        }).catch(err => that.$message.error(err.message))
      }else if(type === 'approval'){
        that.$refs.addForm.query(type,record)
      }else{
        return
      }
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.searchAction({ current: 1})
    },
    finishedHandler(){
      this.searchAction()
    }
  }
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
