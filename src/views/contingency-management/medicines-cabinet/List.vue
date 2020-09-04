<!-- 1.药品柜 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width:150px;"
        :allowClear="true"
        placeholder="名称"
        v-model="searchParam.equipmentName"
      />
      <a-input
        style="width:150px;"
        :allowClear="true"
        placeholder="主板号"
        v-model="searchParam.medicineName"
      />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
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
        <div slot="status" slot-scope="text">
          {{+text === 1 ? '正常' : '缺货'}}
        </div>
        <div slot="goodsRecord" slot-scope="text, record, index">
          <a type="primary" @click="doAction('goodsRecord',record)">查看</a>
        </div>
        <div slot="aisleCase" slot-scope="text, record, index">
          <a type="primary" @click="doAction('aisleCase',record)">查看</a>
        </div>
      </a-table>
    </div>
    <RecordForm ref="recordForm" />
  </div>
</template>
<script>
import { emergencyMedicineCabinetList } from '@/api/contingencyManagement'
import RecordForm from './RecordForm'
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
    title: '设备名称',
    dataIndex: 'equipmentName',
  },
  {
    align: 'center',
    title: '型号',
    dataIndex: 'typeName',
  },
  {
    align: 'center',
    title: '主板号',
    dataIndex: 'mainboardNum',
  },
  {
    align: 'center',
    title: 'SIM卡号',
    dataIndex: 'simCardNum',
  },
  {
    align: 'center',
    title: '位置',
    dataIndex: 'location',
  },
  {
    align: 'center',
    title: '是否缺货',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '补货记录',
    key:'goodsRecord',
    dataIndex: 'goodsRecord',
    scopedSlots: { customRender: 'goodsRecord' },
  },
  {
    align: 'center',
    title: '货道情况',
    key:'aisleCase',
    dataIndex: 'aisleCase',
    scopedSlots: { customRender: 'aisleCase' }
  }
]

export default {
  name: 'contingency-management-medicines-cabinet',
  components: {
    RecordForm
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
        if (to.name === 'contingency-management-medicines-cabinet') {
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
      emergencyMedicineCabinetList(_searchParam)
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
    doAction(type,record){
      this.$refs.recordForm.query(type,record)
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