<!-- 1.药品物资管理 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width:150px;"
        :allowClear="true"
        placeholder="药品名称"
        v-model="searchParam.medicineName"
      />
      <a-input
        style="width:150px;"
        :allowClear="true"
        placeholder="功效"
        v-model="searchParam.efficacy"
      />
      <a-range-picker 
        :placeholder="['到期日期','到期日期']"
        style="width:220px;"
        :allowClear="true"
        v-model="sDate"
        @change="rangePickerChange"
      />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button 
        v-if="$auth('contingency-management-medicines:add')"
        class="a-button"
        style="float:right;"
        type="primary"
        icon="plus"
        @click="doAction('add',null)" 
      >新增</a-button>
      
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
        <div slot="efficacy" slot-scope="text">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>

        <div slot="remark" slot-scope="text">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <template v-if="$auth('contingency-management-medicines:edit')">
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          </template>

          <template v-if="$auth('contingency-management-medicines:del')">
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a href="javascript:void(0);">删除</a>
          </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>
<script>
import {
  emergencyMedicineAddOrUpdate,
  emergencyMedicineDetail,
  emergencyMedicineList,
  emergencyMedicineReplenishmentList,
  emergencyMedicineDel,
} from '@/api/contingencyManagement'
import AddForm from './AddForm'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'medicineName',
  },
  {
    align: 'center',
    title: '功效',
    dataIndex: 'efficacy',
    scopedSlots: { customRender: 'efficacy' },
  },
  {
    align: 'center',
    title: '生产日期',
    dataIndex: 'productionDate',
  },
  {
    align: 'center',
    title: '保质期',
    dataIndex: 'shelfLife',
  },
  {
    align: 'center',
    title: '到期日期',
    dataIndex: 'expirationDate',
  },
  {
    align: 'center',
    title: '保管人',
    dataIndex: 'preserver',
  },
  {
    align: 'center',
    title: '保管人手机号',
    dataIndex: 'preserverMobile',
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' },
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'contingency-management-medicines',
  components: {
    AddForm: AddForm,
  },
  data() {
    return {
      sDate: [undefined, undefined],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {},
      visible: false,
      bindEnterFn: null,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'contingency-management-medicines') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
  methods: {
    moment,
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      emergencyMedicineList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            if(item.productionDate){
              item.productionDate = item.productionDate.slice(0,10)
            }
            if(item.expirationDate){
              item.expirationDate = item.expirationDate.slice(0,10)
            }
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
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
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if (type === 'add' || type === 'edit' || type === 'view') {
        this.$refs.addForm.query(type, record)
        return
      }
      if (type === 'del') {
        emergencyMedicineDel(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            if(+res.code === 200){
              that.searchAction()
            }
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
    },
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.searchParam.startTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.startTime = undefined
          this.searchParam.endTime = undefined
        }
      }
    },
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