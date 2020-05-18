<!-- 消费管理 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-month-picker v-model="searchParam.startMonth" />
      <span>~</span>
      <a-month-picker v-model="searchParam.endMonth" />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button
        class="a-button"
        type="primary"
        icon="download"
        @click="doAction('download',null)"
      >下载人员表</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">{{ index + 1 }}</div>
        <div slot="id" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('detail',record)">查看</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('upload',record)">上传</a>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script>

import {
  comManageSpendDetailPage,
  comManageSpendDetailExportExcel
} from '@/api/communicationManagement'

const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '月份',
    dataIndex: 'month'
  },
  {
    align: 'center',
    title: '总套餐费用',
    dataIndex: 'totalPackage'
  },
  {
    align: 'center',
    title: '本月总消费',
    dataIndex: 'totalSpend'
  },
  {
    align: 'center',
    title: '本月总充值',
    dataIndex: 'totalRecharge'
  },
  {
    align: 'center',
    title: '消费详情',
    dataIndex: ' id',
    scopedSlots: { customRender: 'id' }
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'communication-management-consume',
  components: {
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam: {},
      visible: false,
      exportFilePath: comManageSpendDetailExportExcel()
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'communication-management-consume') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      comManageSpendDetailPage(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
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
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if (type === 'download') {
        let eleA = document.createElement('a')
        eleA.href = that.exportFilePath
        eleA.target = '_blank'
        eleA.click()
        return
      }
      if(type === 'detail'){
        
      }
    }
  }
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