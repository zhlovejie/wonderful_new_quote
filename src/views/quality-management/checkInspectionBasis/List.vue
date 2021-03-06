<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              placeholder="检验依据模糊查询"
              v-model="queryParam.inspectionBasis"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-select
              placeholder="检验等级"
              style="width: 150px"
              allowClear
              v-model="queryParam.inspectionGrade"
            >
              <a-select-option :value="0">正常</a-select-option>
              <a-select-option :value="1">加严</a-select-option>
              <a-select-option :value="2">放宽</a-select-option>
            </a-select>
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
          <div slot="inspectionGrade" slot-scope="text, record, index" >{{ {0:'正常',1:'加严',2:'放宽'}[text] }} </div>
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
      <AddForm ref="addForm" :key="normalAddFormKeyCount" @ok="() => search()" />
    </a-spin>
  </a-card>
</template>

<script>

import {
  checkInspectionBasisDelete,
  checkInspectionBasisDetail,
  checkInspectionBasisAddOrUpdate,
  checkInspectionBasisPage
} from '@/api/qualityManagement'
import AddForm from './AddForm.vue'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:80
  },
  {
    title: '检验依据',
    dataIndex: 'inspectionBasis'
  },
  {
    title: '检验等级',
    dataIndex: 'inspectionGrade',
    scopedSlots: { customRender: 'inspectionGrade' },
  },
  {
    title: '备注',
    dataIndex: 'remarks',
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
  name:'quality-management_standard_inspection-basis',
  components: {
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
        if (to.name === 'quality-management_standard_inspection-basis') {
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
      checkInspectionBasisPage(_searchParam)
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
      if(['add','view','edit'].includes(type)){
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.addForm.query(type,record)
        })
        return
      }else if(type === 'del'){
        checkInspectionBasisDelete({id:record.id}).then(res => {
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
