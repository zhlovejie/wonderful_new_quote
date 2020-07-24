<!-- 我的卡片管理 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="卡号模糊查询" style="width: 160px" v-model="searchParam.cardNum" />

      <a-select
        placeholder="卡状态" 
        @change="postChangeHandler"
        v-model="searchParam.stationId"
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option value="正常">正常</a-select-option>
        <a-select-option value="未激活">未激活</a-select-option>
        <a-select-option value="停机">停机</a-select-option>
      </a-select>

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
    <br />
    <div style="float:right;margin-bottom:20px;">
      <a-button class="a-button" type="primary" @click="updateSimInfo" style="margin-right:10px;">更新SIM卡信息</a-button>
      <a-button class="a-button" type="primary" @click="inportInfo" style="margin-right:10px;">导入</a-button>
      <a-button class="a-button" type="primary" @click="addInfo">新增</a-button>
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
        <div slot="iccid" slot-scope="text, record">
          <a-button type="link" @click="showInfo(record)">{{text}}</a-button>
        </div>
      </a-table>
    </div>
    <AdvancedForm ref="advancedForm" />
    <AddForm ref="addForm"/>
    <Inport ref="inportInfo" />
    <Info ref='info' />
  </div>
</template>
<script>
import AdvancedForm from './AdvancedForm'
import AddForm from './AddForm'
import Info from './Info'
import Inport from './inport'

import {getSimInformationList} from '@/api/simCard'

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
    dataIndex: 'cardno',
    scopedSlots: { customRender: 'cardno' }
  },
  {
    align: 'center',
    title: 'iccid',
    dataIndex: 'iccid',
    scopedSlots: { customRender: 'iccid' }
  },
  {
    align: 'center',
    title: '卡状态',
    dataIndex: 'status',
  },
  {
    align: 'center',
    title: '活动状态',
    dataIndex: 'activestatus',
  },
  {
    align: 'center',
    title: '运营商',
    dataIndex: 'operatortype',
  },
  {
    align: 'center',
    title: '发卡日期',
    dataIndex: 'saledate',
  },
  {
    align: 'center',
    title: '激活日期',
    dataIndex: 'activationdate',
  },
  {
    align: 'center',
    title: '服务期止',
    dataIndex: 'validdate'
  },
  {
    align: 'center',
    title: '所属机构',
    dataIndex: 'orgName'
  },
  {
    align: 'center',
    title: '所属设备',
    dataIndex: 'manId',
  },
  {
    align: 'center',
    title: '出厂日期',
    dataIndex:'outDate',
  },
  {
    align:'center',
    title:'SIM卡有限期',
    dataIndex:'beOverdueTime'
  }
]

export default {
  name: 'icotcard-management-mycard',
  components: {
    AdvancedForm,
    AddForm,
    Info,
    Inport
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
      getSimInformationList(_searchParam)
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
    // 高级筛选
    advancedFilter(){
      this.$refs.advancedForm.showAdvancedForm()
    },
    postChangeHandler(stationId){
      this.personSelectDataSource = []
      // getUserByStation({ stationId: stationId }).then(res => (this.personSelectDataSource = res.data))
    },
    // 更新SIM卡
    updateSimInfo(){

    },
    // 导入
    inportInfo(){
      this.$refs.inportInfo.showInport()
    },
    // 新增
    addInfo(){
      this.$refs.addForm.showAddForm()
    },
    showInfo(record){
      this.$refs.info.showInfo(record.iccid)
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