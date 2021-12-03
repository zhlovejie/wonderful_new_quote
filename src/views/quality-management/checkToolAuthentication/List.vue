<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              placeholder="检验工具模糊查询"
              v-model="queryParam.parameterTermName"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="工具编号模糊查询"
              v-model="queryParam.code"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-select
              placeholder="工具状态"
              style="width: 150px"
              allowClear
              v-model="queryParam.type"
            >
              <a-select-option :value="0">正常</a-select-option>
              <a-select-option :value="1">损坏</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select
              placeholder="认证处"
              style="width: 150px"
              allowClear
              v-model="queryParam.authenticationOffice"
            >
              <a-select-option :value="0">质监局</a-select-option>
              <a-select-option :value="1">万德福</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select
              placeholder="最后一次认证结果"
              style="width: 150px"
              allowClear
              v-model="queryParam.authenticationResult"
            >
              <a-select-option :value="0">合格</a-select-option>
              <a-select-option :value="1">不合格</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              icon="search"
              @click="search({ current: 1 })"
            >查询</a-button>
          </a-form-item>
          <a-form-item >
              <a-button type="primary" @click="doAction('add', null)">新增</a-button>
            </a-form-item>
        </a-form>
      </div>

      <a-tabs
        :activeKey="activeKey"
        :defaultActiveKey="activeKey"
        @change="tabChange"
      >
        <a-tab-pane
          tab="待认证"
          :key="0"
        />

        <a-tab-pane
          tab="已认证"
          :key="1"
        />

        <a-tab-pane
          tab="全部"
          :key="2"
        />
      </a-tabs>
      <div class="main-wrapper">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            {{index + 1}}
          </div>
          <div slot="type" slot-scope="text, record, index" >{{ {0:'正常',1:'损坏'}[text] }} </div>
          <div slot="authenticationOffice" slot-scope="text, record, index" >{{ {0:'质监局',1:'万德福'}[text] }} </div>
          <div slot="authenticationResult" slot-scope="text, record, index" >{{ {0:'合格',1:'不合格'}[text] }} </div>
          <div slot="authenticationType" slot-scope="text, record, index" >{{ {0:'待认证',1:'已认证'}[text] }} </div>
          <div
            slot="action"
            slot-scope="text, record, index"
          >
            <a @click="doAction('view',record)">查看</a>
            <a-divider type="vertical" />
            <a @click="doAction('edit',record)">修改</a>
            <template v-if="+activeKey === 0 && +record.type === 0">
              <a-divider type="vertical" />
              <a @click="doAction('auth',record)">认证</a>
            </template>
            <template v-else>
              <a-divider type="vertical" />
              <a @click="doAction('authRecord',record)">认证记录</a>
            </template>
          </div>
        </a-table>
      </div>
      <AddForm ref="addForm" @finish="() => search()" />
      <AuthRecordList ref="authRecordList" />
    </a-spin>
  </a-card>
</template>

<script>

import {
  checkToolAuthentication,
  checkToolAuthenticationPage
} from '@/api/qualityManagement'
import AuthRecordList from './AuthRecordList'
import AddForm from './AddForm.vue'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:80
  },
  {
    title: '检验工具',
    dataIndex: 'parameterTermName'
  },
  {
    title: '工具编号',
    dataIndex: 'code'
  },
  {
    title: '工具状态',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' },
  },
  {
    title: '认证状态',
    dataIndex: 'authenticationType',
    scopedSlots: { customRender: 'authenticationType' },
  },
  {
    title: '认证周期(月)',
    dataIndex: 'authenticationCycle'
  },
  {
    title: '认证处',
    dataIndex: 'authenticationOffice',
    scopedSlots: { customRender: 'authenticationOffice' },
  },
  {
    title: '最近一次认证结果',
    dataIndex: 'authenticationResult',
    scopedSlots: { customRender: 'authenticationResult' },
  },
  {
    title: '最近一次认证日期',
    dataIndex: 'latelyAuthenticationDate'
  },
  {
    title: '下一次认证日期',
    dataIndex: 'nextAuthenticationDate'
  },
  {
    title: '操作人',
    dataIndex: 'createdName'
  },
  {
    title: '操作时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'quality-management_tool-authentication',
  components: {
    AuthRecordList,
    AddForm
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      activeKey:1,
      queryParam: {
        authenticationType:this.activeKey
      },
      columns,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      spinning: false,
      normalAddFormKeyCount: 1,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'quality-management_tool-authentication') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const that = this
      that.tabChange(that.activeKey)
    },
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }

      let {date} = that.queryParam
      let dateParams = {...that.queryParam}
      const _searchParam = Object.assign({}, dateParams, paginationParam, params)
      that.loading = true
      checkToolAuthenticationPage(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.exceptionDate = String(item.exceptionDate).slice(0,10)
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => {
          that.loading = false
          console.log(err)
        })
    },

    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },

    tabChange(key){
      this.activeKey = +key
      this.queryParam = {
        ...this.queryParam,
        authenticationType:this.activeKey
      }
      this.search()
    },
    doAction(type,record){
      const that = this
      if(['add','view','edit','auth'].includes(type)){
        that.$refs.addForm.query(type,record)
        return
      }else if(type === 'authRecord'){
        that.$refs.authRecordList.query(record)
        return
      }
    },
  }
}
</script>
<style scoped>
.__table-footer-action-wrapper > *{
  margin-right: 10px;
}
</style>
