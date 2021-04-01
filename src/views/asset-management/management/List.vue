<template>
  <!-- 资产管理 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="资产名称"
        v-model="searchParam.name"
        :allowClear="true"
        style="width:160px;"
      />
      <a-input
        placeholder="资产代码"
        v-model="searchParam.code"
        :allowClear="true"
        style="width:160px;"
      />
      <a-input
        placeholder="使用人"
        v-model="searchParam.userName"
        :allowClear="true"
        style="width:160px;"
      />
      <a-select
        placeholder="选择资产类型"
        v-model="searchParam.typeDicId"
        :allowClear="true"
        style="width:160px;"
      >
        <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{item.text}}</a-select-option>
      </a-select>

      <a-select
        placeholder="选择资产状态"
        v-model="searchParam.status"
        :allowClear="true"
        style="width:160px;"
      >
        <a-select-option :value="1">入库</a-select-option>
        <a-select-option :value="2">使用中</a-select-option>
        <a-select-option :value="3">报修中</a-select-option>
        <a-select-option :value="4">报废</a-select-option>
        <a-select-option :value="5">缺失</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
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
        <div slot="beyondType" slot-scope="text, record, index">
          {{ {1:'个人',2:'部门',3:'资产库'}[text] || '未知' }}
        </div>
        <div slot="status" slot-scope="text, record, index">
          {{ {1:'入库',2:'使用中',3:'报修中',4:'报废',5:'缺失'}[text] || '未知' }}
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+record.status === 1">
            <a type="primary" @click="doAction('get',record)">领取</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('fix',record)">报修</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要执行报废操作？" @confirm="doAction('over',record)">
              <a type="primary" >报废</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('get-record',record)">领取记录</a>
          </template>

          <template v-if="+record.status === 2">
            <a-popconfirm title="是否要执行归还操作？" @confirm="doAction('return',record)">
              <a type="primary" >归还</a>
            </a-popconfirm>

            <a-divider type="vertical" />
            <a type="primary" @click="doAction('fix',record)">报修</a>
            <!-- <a-divider type="vertical" />
            <a-popconfirm title="是否要执行报废操作？" @confirm="doAction('over',record)">
              <a type="primary" >报废</a>
            </a-popconfirm> -->
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('get-record',record)">领取记录</a>
          </template>

          <template v-if="+record.status === 3">
            <a-popconfirm title="是否要执行验收操作？" @confirm="doAction('accept',record)">
              <a type="primary" >确认验收</a>
            </a-popconfirm>
            <!-- <a-divider type="vertical" />
            <a-popconfirm title="是否要执行报废操作？" @confirm="doAction('over',record)">
              <a type="primary" >报废</a>
            </a-popconfirm> -->
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('get-record',record)">领取记录</a>
          </template>

          <template v-if="+record.status === 4">
            <a-popconfirm title="是否要执行入库操作？" @confirm="doAction('put',record)">
              <a type="primary" >入库</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要执行删除操作？" @confirm="doAction('del',record)">
              <a type="primary" >删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('get-record',record)">领取记录</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
    <GetForm ref="getForm" @finish="searchAction()" />
    <RecordForm ref="recordForm" />
    <FixForm ref="fixForm" @finish="searchAction()" />
  </div>
</template>

<script>
import {
  oaAssertsInfoMyAssertsAllList ,
  oaAssertsInfoAssertsReturn,

  oaAssertsInfoConfirmRecieve,
  oaAssertsInfoGiveUpAssert,
  oaAssertsInfoRemove,
  oaAssertsInfoStockInAssert
} from '@/api/assetManagement'
import { getDictionaryList } from '@/api/workBox'
import AddForm from './AddForm'
import GetForm from './GetForm'
import RecordForm from './RecordForm'
import FixForm from './FixForm'

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
    title: '资产类别',
    dataIndex: 'typeDicName',
  },
  {
    align: 'center',
    title: '资产名称',
    dataIndex: 'name',
  },
  {
    align: 'center',
    title: '资产编码',
    dataIndex: 'code',
  },
  {
    align: 'center',
    title: '资产归属',
    dataIndex: 'beyondType',
    scopedSlots: { customRender: 'beyondType' },
  },
  {
    align: 'center',
    title: '资产状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '使用人',
    dataIndex: 'cliamUserName',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'cliamDepartmentName',
  },
  {
    align: 'center',
    title: '领取时间',
    dataIndex: 'claimTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  }
]

export default {
  name: 'asset-management-management',
  components: {
    AddForm,
    GetForm,
    RecordForm,
    FixForm
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      assetTypeList: [],
      pagination: {
        current: 1,
      },
      searchParam:{},
      loading: false,
    }
  },
  computed: {

  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'asset-management-management') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      let task1 = getDictionaryList({ parentId: 532 }).then((res) => (that.assetTypeList = res.data))
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      oaAssertsInfoMyAssertsAllList(_searchParam)
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
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(type,record){
      let that = this
      if(type === 'add'){
        that.$refs.addForm.query(type,record)
        return
      }
      if(type === 'get'){
        that.$refs.getForm.query(type,record)
        return
      }
      if(type === 'return'){
        let {id,cliamId} = record
        oaAssertsInfoAssertsReturn({id,cliamId}).then(res =>{
          console.log(res)
          that.$message.info(res.msg)
          if(res.code === 200){
            that.searchAction()
          }
        })
        return
      }
      if(type === 'get-record'){
        that.$refs.recordForm.query(type,record)
        return
      }
      if(type === 'fix'){
        that.$refs.fixForm.query('add',record)
        return
      }

      if(['accept','over','del','put'].includes(type)){
        // debugger
        let api = {
          'accept':oaAssertsInfoConfirmRecieve,
          'over':oaAssertsInfoGiveUpAssert,
          'del':oaAssertsInfoRemove,
          'put':oaAssertsInfoStockInAssert
        }
        api[type](`assertsId=${record.id}`).then(res =>{
          //console.log(res)
          that.$message.info(res.msg)
          if(res.code === 200){
            that.searchAction()
          }
        })
        return
      }
    }
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
