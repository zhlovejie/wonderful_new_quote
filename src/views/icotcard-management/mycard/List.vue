<!-- 我的卡片管理 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="卡号模糊查询" style="width: 160px" v-model="searchParam.cardNum" />

      <!-- <a-select
        placeholder="卡状态" 
        @change="postChangeHandler"
        v-model="searchParam.stationId"
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select> -->

      <a-input placeholder="所属机构模糊查询" style="width: 160px" v-model="searchParam.belondCompany" />
      <a-input placeholder="主板号模糊查询" style="width: 160px" v-model="searchParam.beloneDevice" />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button class="a-button" type="primary" icon="search" @click="advancedFilter">高级筛选</a-button>
      <a-button
        class="a-button"
        type="primary"
        icon="download"
        @click="doAction('download',null)"
      >下载</a-button>
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
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a href="javascript:void(0);">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AdvancedForm ref="advancedForm" />
  </div>
</template>
<script>
// import {
//   departmentList, //所有部门
//   getStationList, //获取部门下面的岗位
//   getUserByStation //获取岗位下人员
// } from '@/api/systemSetting'
// import {
//   comManageMobileManagePage,
//   comManageMobileManageExportExcel,
//   comManageMobileManageDelete
// } from '@/api/communicationManagement'
import AdvancedForm from './advancedForm'
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
    title: '卡号',
    dataIndex: 'cardNum'
  },
  {
    align: 'center',
    title: 'iccid',
    dataIndex: 'iccid'
  },
  {
    align: 'center',
    title: '卡状态',
    dataIndex: 'cardState'
  },
  {
    align: 'center',
    title: '活动状态',
    dataIndex: 'activityState'
  },
  {
    align: 'center',
    title: '运营商',
    dataIndex: 'service',
  },
  {
    align: 'center',
    title: '发卡日期',
    dataIndex: 'startDate',
  },
  {
    align: 'center',
    title: '激活日期',
    dataIndex: 'usedDate',
  },
  {
    align: 'center',
    title: '服务期止',
    dataIndex: 'endDate'
  },
  {
    align: 'center',
    title: '所属机构',
    dataIndex: 'belondCompany'
  },
  {
    align: 'center',
    title: '所属设备',
    dataIndex: 'beloneDevice',
    // scopedSlots: { customRender: 'remarks' }
  },
  {
    align: 'center',
    title: '出厂日期',
    dataIndex:'outDate',
  },
  {
    align:'center',
    title:'SIM卡有限期',
    dataIndex:'simLife'
  }
]

export default {
  name: 'communication-management-phone-number',
  components: {
    AdvancedForm
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
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'icotcard-management-mycard') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = false
      // comManageMobileManagePage(_searchParam)
      //   .then(res => {
      //     that.loading = false
      //     that.dataSource = res.data.records.map((item, index) => {
      //       item.key = index + 1
      //       return item
      //     })
      //     //设置数据总条数
      //     const pagination = { ...that.pagination }
      //     pagination.total = res.data.total
      //     that.pagination = pagination
      //   })
      //   .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    // 高级筛选
    advancedFilter(){
      this.$refs.advancedForm.showAdvancedForm()
    },
    postChangeHandler(stationId){
      this.personSelectDataSource = []
      // getUserByStation({ stationId: stationId }).then(res => (this.personSelectDataSource = res.data))
    },
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