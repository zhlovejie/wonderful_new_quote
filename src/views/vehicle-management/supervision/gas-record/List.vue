<!-- 加油记录 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width:200px;"
        :allowClear="true"
        placeholder="车牌号模糊查询"
        v-model="searchParam.carCode"
      />
      <a-input
        style="width:200px;"
        :allowClear="true"
        placeholder="油卡名称模糊查询"
        v-model="searchParam.cardName"
      />
      <a-range-picker
        v-model="sDate"
        :placeholder="['加油开始日期','加油结束日期']"
        @change="rangePickerChange"
        style="width:280px;"
        :allowClear="true"
      />

      <a-button class="a-button" type="primary" icon="search" @click="() => searchAction({current:1})">查询</a-button>
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

        <div slot="amount" slot-scope="text, record, index">
          {{text | moneyFormatNumber}}
        </div>
        <div slot="price" slot-scope="text, record, index">
          {{text | moneyFormatNumber}}
        </div>
        <div slot="paperUrl" slot-scope="text, record, index">
          <a v-if="record.paperUrl" :href="record.paperUrl" target="_blank">查看</a>
          <span v-else>无</span>
        </div>
        <div slot="status" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('auth',record)">{{ +text === 1 ? '已认证' :'待认证'}}</a>
        </div>
      </a-table>
    </div>
    <a-modal
      title="认证信息"
      :width="650"
      :visible="visible"
      @cancel="visible = false"
      :maskClosable="false"
      :destroyOnClose="true"
      :footer="null"
    >
      <table class="custom-table custom-table-border">
          <tr>
            <td>认证人</td>
            <td>时间</td>
            <td>位置</td>
          </tr>
          <tr>
            <td>{{authInfo.followUserName}}</td>
            <td>{{authInfo.authenticateTime}}</td>
            <td>{{authInfo.authenticatePosition}}</td>
          </tr>
      </table>
    </a-modal>
  </div>
</template>
<script>
import {
  carOilingList
} from '@/api/vehicleManagement'
//import AddForm from './AddForm'
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
    title: '车牌号',
    dataIndex: 'carCode'
  },
  {
    align: 'center',
    title: '油卡名',
    dataIndex: 'cardName'
  },
  {
    align: 'center',
    title: '油卡号',
    dataIndex: 'cardCode'
  },
  {
    align: 'center',
    title: '加油金额',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' },
  },
  {
    align: 'center',
    title: '油价',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' },
  },
  {
    align: 'center',
    title: '小票',
    dataIndex: 'paperUrl',
    scopedSlots: { customRender: 'paperUrl' },
  },
  {
    align: 'center',
    title: '加油状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '加油时间',
    dataIndex: 'oilDate',
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  }
]

export default {
  name: 'vehicle-management-supervision-gas-record',
  components: {
    //AddForm: AddForm,
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
      authInfo:{}
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'vehicle-management-supervision-gas-record') {
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
      carOilingList(_searchParam)
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
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.searchParam.beginDate = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endDate = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.beginDate = undefined
          this.searchParam.endDate = undefined
        }
      }
    },
    doAction(type,record){
      if(type === 'auth'){
        this.authInfo = {...record}
        this.visible = true
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