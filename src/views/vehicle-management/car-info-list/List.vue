<!-- 车辆信息 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width:250px;"
        :allowClear="true"
        placeholder="车辆名称，车牌号模糊查询"
        v-model="searchParam.carNameOrCode"
      />
      <a-input
        style="width:200px;"
        :allowClear="true"
        placeholder="发动机号模糊查询"
        v-model="searchParam.engineCode"
      />
      <a-select
        placeholder="车辆状态"
        v-model="searchParam.status"
        :allowClear="true"
        style="width: 200px "
      >
        <a-select-option :value="0">未使用</a-select-option>
        <a-select-option :value="1">使用中</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button 
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
        <div slot="fuelOilType" slot-scope="text">
          {{ {'1':'汽油','2':'柴油','3':'电'}[text] }}
        </div>
        <div slot="status" slot-scope="text">
          {{ {'0':'未使用','1':'使用中'}[text] }}
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <!-- <template v-if="$auth('contingency-management-medicines:edit')"> -->
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <!-- </template> -->

          <!-- <template v-if="$auth('contingency-management-medicines:del')"> -->
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a href="javascript:void(0);">删除</a>
          </a-popconfirm>
          <!-- </template> -->
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>
<script>
import {
  carInfoAddOrUpdate,
  carInfoList,
  carUserList,
  carInfoDel,
} from '@/api/vehicleManagement'
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
    title: '车辆名称',
    dataIndex: 'carName',
  },
  {
    align: 'center',
    title: '车牌号',
    dataIndex: 'carCode'
  },
  {
    align: 'center',
    title: '座位数',
    dataIndex: 'seatNum'
  },
  {
    align: 'center',
    title: '燃油类型',
    dataIndex: 'fuelOilType',
    scopedSlots: { customRender: 'fuelOilType' },
  },
  {
    align: 'center',
    title: '发动机号',
    dataIndex: 'engineCode',
  },
  {
    align: 'center',
    title: '购买时间',
    dataIndex: 'buyTime',
  },
  {
    align: 'center',
    title: '里程数(km)',
    dataIndex: 'mileageNum',
  },
  {
    align: 'center',
    title: '保养周期',
    dataIndex: 'careMile'
  },
  {
    align: 'center',
    title: '车辆状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '保管人',
    dataIndex: 'careUserName'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'vehicle-management-car-info-list',
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
        if (to.name === 'vehicle-management-car-info-list') {
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
      carInfoList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let {current,pages} = res.data
          if(current > pages){
            that.pagination = {...pagination,current:pages}
            that.searchAction()
          }
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
        carInfoDel({id:record.id})
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