<template>
  <!-- 我的资产 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="资产名称"
        v-model="searchParam.name"
        :allowClear="true"
        style="width:200px;"
      />
      <a-input
        placeholder="资产代码"
        v-model="searchParam.code"
        :allowClear="true"
        style="width:200px;"
      />
      <a-select
        placeholder="选择资产类型"
        v-model="searchParam.typeDicId"
        :allowClear="true"
        style="width:200px;"
      >
        <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{item.text}}</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
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
          <template v-if="+record.status === 2">
            <a @click="doAction('fix',record)">报修</a>
          </template>

          <template v-if="+record.status === 3">
            <a-popconfirm title="是否要执行验收操作？" @confirm="doAction('accept',record)">
              <a>确认验收</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
      <FixForm ref="fixForm" @finish="searchAction()" />
    </div>
  </div>
</template>

<script>
import { oaAssertsInfoMyAssertsList,oaAssertsInfoConfirmRecieve } from '@/api/assetManagement'
import { getDictionaryList } from '@/api/workBox'
import FixForm from '../management/FixForm'
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
  },
]

export default {
  name: 'asset-management-mine',
  components: {FixForm},
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
        if (to.name === 'asset-management-mine') {
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
      oaAssertsInfoMyAssertsList(_searchParam)
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
    doAction(actionType, record) {
      let that = this
      if(actionType === 'fix'){
        that.$refs.fixForm.query('add',record)
        return
      }
      if(actionType === 'accept'){
        oaAssertsInfoConfirmRecieve(`assertId=${record.id}`).then(res =>{
          console.log(res)
          that.$message.info(res.msg)
          if(res.code === 200){
            that.searchAction()
          }
        })
        return
      }
      // if (actionType === 'edit' || actionType === 'add') {
      //   this.$refs.addForm.query(actionType, record)
      // } else if (actionType === 'del') {
      //   caringSettingDel(`id=${record.id}`)
      //     .then((res) => {
      //       that.$message.info(res.msg)
      //       that.searchAction()
      //     })
      //     .catch((err) => {
      //       that.$message.info(`错误：${err.message}`)
      //     })
      // } else {
      //   this.$message.info('功能尚未实现！')
      // }
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
