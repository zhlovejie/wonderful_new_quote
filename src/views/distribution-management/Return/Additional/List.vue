<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-input style="width: 150px" placeholder="物流单号" allowClear v-model="queryParam.logisticsOrderNo" />
        </a-form-item>
        <a-form-item>
          <a-input
            style="width: 150px"
            placeholder="驾驶员姓名/手机号"
            allowClear
            v-model="queryParam.fullNameAndTelephone"
          />
        </a-form-item>
        <a-form-item>
          <a-range-picker @change="dateChange" allowClear style="width: 400px; margin-right: 10px" />
        </a-form-item>
        <a-form-item v-if="queryParam.type === '2'">
          <a-select v-model="queryParam.status" allowClear style="width: 150px" placeholder="报价类型">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">异常</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="1" @change="paramClick">
            <a-tab-pane key="1" forceRender>
              <span slot="tab"> 未回访 </span>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab"> 已回访 </span>
            </a-tab-pane>
          </a-tabs>
        </div>
        <a-table
          v-if="queryParam.type === '1'"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="date" slot-scope="text, record, index">
            <span>{{ record.date.slice(0, 10) }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="applyFor('offer', record)">物流详情</a>
            </template>
          </span>
        </a-table>
        <a-table
          v-if="queryParam.type === '2'"
          :columns="columns1"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="date" slot-scope="text, record, index">
            <span>{{ record.date.slice(0, 10) }}</span>
          </div>

          <span slot="status" slot-scope="text, record">
            <span> {{ { 1: '正常', 2: '异常' }[text] || '未知' }}</span>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a class="ant-dropdown-link" @click="returnV(record.logisticsInformationId)">回访记录</a>
            </template>
          </span>
        </a-table>
      </a-col>
    </a-row>

    <ReturnVisit ref="returnVisit" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import ReturnVisit from './returnVisit'
import { listLogisticsReturnVisitRecordDetail } from '@/api/distribution-management'
// 表头
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '日期',
    key: 'date',
    scopedSlots: { customRender: 'date' },
  },
  {
    title: '物流单号',
    dataIndex: 'logisticsOrderNo',
    width: 140,
  },
  {
    title: '车牌号',
    dataIndex: 'licensePlateNumber',
    width: 140,
  },
  {
    title: '驾驶员姓名',
    dataIndex: 'fullName',
  },
  {
    title: '驾驶员手机号',
    dataIndex: 'telephone',
  },
  {
    title: '物流费',
    dataIndex: 'logisticsPrice',
  },
  {
    title: '操作',
    dataIndex: 'id',
    scopedSlots: { customRender: 'action' },
  },
]
const columns1 = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '日期',
    key: 'date',
    scopedSlots: { customRender: 'date' },
  },
  {
    title: '物流单号',
    dataIndex: 'logisticsOrderNo',
    width: 140,
  },
  {
    title: '车牌号',
    dataIndex: 'licensePlateNumber',
    width: 140,
  },
  {
    title: '驾驶员姓名',
    dataIndex: 'fullName',
  },
  {
    title: '驾驶员手机号',
    dataIndex: 'telephone',
  },
  {
    title: '物流费',
    dataIndex: 'logisticsPrice',
  },
  {
    title: '回访人',
    dataIndex: 'revisiterId',
  },
  {
    title: '回访状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '操作',
    dataIndex: 'id',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'ReceiptList',
  components: {
    STable,
    ReturnVisit,
  },
  data() {
    return {
      columns,
      columns1,
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        type: '1',
      },
      personincharge: [],
      Totalmessages: {},
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      customerName: '',
      saleCustomers: [],
      approveStatus: 0,
      audit: false,
      showFlag: true,
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('开始加载数据', JSON.stringify(this.queryParam))
        return listLogisticsReturnVisitRecordDetail(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      dataSource: [],
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'distribution_management_Additional') {
          this.searchAction()
        }
      },
      immediate: true,
    },
  },
  methods: {
    returnV(id) {
      this.$refs.returnVisit.init(id)
    },
    dateChange(date, dateString) {
      this.$set(this.queryParam, 'startDate', dateString[0])
      this.$set(this.queryParam, 'endDate', dateString[1])
    },
    searchAction(opt) {
      let that = this

      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      listLogisticsReturnVisitRecordDetail(_searchParam)
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
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    paramClick(key) {
      if (key !== '0') {
        this.queryParam = { ...this.queryParam, type: key }
      } else {
        this.queryParam = { ...this.queryParam, type: null }
      }

      this.searchAction()
    },
    applyFor(type, record) {
      this.$refs.formadd.query(type, record)
    },
  },
}
</script>

<style scoped>
.top-ation .a-input {
  width: 150px;
  margin: 0 5px 5px 0;
}

.a-select {
  margin-right: 5px;
}

.a-button {
  margin-right: 5px;
}

.fl-r {
  float: right;
}

.develop-wrap {
  background-color: #fff;
  padding: 12px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
