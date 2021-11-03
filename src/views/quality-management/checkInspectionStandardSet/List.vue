<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              placeholder="物料代码模糊查询"
              v-model="queryParam.materialCode"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="物料名称模糊查询"
              v-model="queryParam.materialName"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              icon="search"
              @click="search({ current: 1 })"
            >查询</a-button>
          </a-form-item>
          <a-form-item  style="float:right;">
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
          tab="待制定"
          :key="0"
        />

        <a-tab-pane
          tab="已制定"
          :key="1"
        />

        <a-tab-pane
          tab="待审批"
          :key="2"
        />
        <a-tab-pane
          tab="已审批"
          :key="3"
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
          <div slot="materialSource" slot-scope="text, record, index" >
            {{ {1:'自制',3:'委外',2:'外购',4:'标准件'}[text] }}
          </div>
          <div
            slot="action"
            slot-scope="text, record, index"
          >
            <a @click="doAction('view',record)">查看</a>
            <a-divider type="vertical" />
            <a @click="doAction('edit',record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
              <a type="primary" href="javascript:;">删除</a>
            </a-popconfirm>
          </div>
        </a-table>
      </div>
      <AddForm ref="addForm" @finish="() => search()" />
    </a-spin>
  </a-card>
</template>

<script>

import {

  checkInspectionStandardSetDelete,
  checkInspectionStandardSetDetail,
  checkInspectionStandardSetPage,
  checkInspectionStandardSetRevocation,
  checkInspectionStandardSetAddOrUpdate,
  checkInspectionStandardSetApproval
} from '@/api/qualityManagement'
import AddForm from './AddForm.vue'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:80
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    width:250
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    width:300
  },
  {
    title: '规格型号',
    dataIndex: 'specification',
    width:400
  },
  {
    title: '物料来源',
    dataIndex: 'materialSource',
    scopedSlots: { customRender: 'materialSource' },
  },
  {
    title: '创建人',
    dataIndex: 'createdName'
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'quality-management_standard_inspection-standard-set',
  components: {
    AddForm
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      activeKey:0,
      queryParam: {
        searchStatus:0
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
        if (to.name === 'quality-management_standard_inspection-standard-set') {
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
      checkInspectionStandardSetPage(_searchParam)
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
        searchStatus:this.activeKey
      }
      this.search()
    },
    doAction(type,record){
      const that = this
      if(['add','view','edit'].includes(type)){
        that.$refs.addForm.query(type,record)
        return
      }else if(type === 'del'){
        checkInspectionStandardSetDelete({id:record.id}).then(res => {
          if(res.code === 200){
            that.search()
          }else{
            that.$message.error(res.msg)
            return
          }
        }).catch(err => {
          that.$message.error(err.message)
        })
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
