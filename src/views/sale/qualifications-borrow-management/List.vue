<template>
  <!-- 资质借用管理 -->
  <div class="container-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="客户名称模糊查询"
        :allowClear="true"
        v-model="searchParam.customerName"
        style="width: 200px"
      />
      <a-select
        optionFilterProp="children"
        showSearch
        :allowClear="true"
        :filterOption="filterSalersOption"
        placeholder="请选择销售人员"
        style="width: 200px"
        v-model="searchParam.salesmanId"
      >
        <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
          item.salesmanName
        }}</a-select-option>
      </a-select>

      <a-select
        placeholder="类型"
        :allowClear="true"
        v-model="searchParam.type"
        style="width: 160px"
      >
        <a-select-option :value="1">项目投标</a-select-option>
        <a-select-option :value="2">项目经营</a-select-option>
      </a-select>

      <a-select
        placeholder="合同属性"
        :allowClear="true"
        v-model="searchParam.contractProperty"
        style="width: 160px"
      >
        <a-select-option :value="1">经销商合同</a-select-option>
        <a-select-option :value="2">代理商合同</a-select-option>
        <a-select-option :value="3">战略合作协议</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button 
        v-if="$auth('qualifications-borrow-management-list:add')"
        class="a-button" 
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

        <div slot="contractProperty" slot-scope="text, record, index">
          <span>{{getContractPropertyText(text)}}</span>
        </div>
        <div slot="type" slot-scope="text, record, index">
          <span>{{getTypeText(text)}}</span>
        </div>
        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStatusText(text) }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <template v-if="+record.status < 6">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('do', record)">处理</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import {
  borrowPageList,
  borrowDetail
} from '@/api/qualificationsBorrowManagement'

import { getListSaleContractUser } from '@/api/contractListManagement'
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
    title: '销售负责人',
    dataIndex: 'salesmanName',
  },
  {
    align: 'center',
    title: '类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    align: 'center',
    title: '合同属性',
    dataIndex: 'contractProperty',
    scopedSlots: { customRender: 'contractProperty' }
  },
  {
    align: 'center',
    title: '项目状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: ' 提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: ' 提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  },
]
export default {
  name: 'qualifications-borrow-management-list',
  components: {
     AddForm
  },
  data() {
    return {
      searchParam: {},
      columns: columns,
      dataSource: [],
      saleUser: [],
      pagination1: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'qualifications-borrow-management-list') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    async init() {
      let that = this
      await getListSaleContractUser().then((res) => (that.saleUser = res.data))
      await that.searchAction()

      //新增完 [代签销售合同]后，显示 之前的步骤状态
      // let {borrowId,action} = that.$route.params
      // if(borrowId && action){
      //   let res = await borrowDetail({ id: borrowId }).then((res) => res.data)
      //   that.doAction( ['see','view'].includes(action) ? 'view' : 'do',res)
      //   return
      // }
      // let {_viewPos} = that.$route.params
      // console.log(that.$route.params)
      // if(_viewPos){
      //   //debugger
      //   let {step,type,record} = _viewPos
      //   that.doAction( ['see','view'].includes(type) ? 'view' : 'do',{...record,__step:step})
      // }
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.searchParam }, paginationParam)
      that.loading = true
      return borrowPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.effective = `${item.effectiveStart} ~ ${item.effectiveEnd}`
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
      let that = this
      that.$refs.addForm.query(type, record)
    },
    approvalPreview(record) {
      //this.$refs.approveInfoCard.init(record.instanceId)
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getTypeText(type){
      return {1:'项目投标',2:'项目经营'}[type] || '未知'
    },
    getContractPropertyText(type){
      return {1:'经销商合同',2:'代理商合同',3:'战略合作协议'}[type] || '未知'
    },
    getStatusText(type){
      return {1:'签订合同',2:'签订借用协议',3:'代签购货合同',4:'销售合同',5:'外包协议',6:'完结'}[type] || '未知'
    }
  }
}
</script>
<style scoped>
.container-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.container-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
