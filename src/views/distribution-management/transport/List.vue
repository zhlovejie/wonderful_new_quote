<template>
  <a-card :bordered="false">
    <!-- 我方货物运输记录 -->
    <div class="top-ation" style="margin-bottom: 20px">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-input style="width: 150px" placeholder="姓名" allowClear v-model="queryParam.userName" />
        </a-form-item>
        <a-form-item>
          <a-input style="width: 150px" placeholder="电话" allowClear v-model="queryParam.phone" />
        </a-form-item>
        <a-form-item>
          <a-input style="width: 150px" placeholder="目的地" allowClear v-model="queryParam.address" />
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.vehicleTypeId" allowClear style="width: 150px" placeholder="车辆类型">
            <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker @change="dateChange" allowClear style="width: 400px; margin-right: 10px" />
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="searchCheck">查询</a-button>
          </template>
        </a-form-item>
        <a-form-item style="float: right">
          <template>
            <a-button type="primary" icon="plus" @click="applyFor('add', null)">新增</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys"
          @expand="expandHandler"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="address" slot-scope="text, record, index">
            <span>{{ text }}{{ record.addressDetail }}</span>
          </div>

          <div slot="dates" slot-scope="text, record, index">
            <span>{{ record.createdTime.slice(0, 10) }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="delete_list(record.id)">删除</a>
            </template>
          </span>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.logisticsProductTransportMaterials"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>

            <div slot="specification" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <FormAdd ref="formadd" @finish="searchAction"></FormAdd>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import FormAdd from './AddForm'

import { getDictionaryList } from '@/api/workBox'
import { transportPage, listInformationdelete } from '@/api/distribution-management'
const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '物流单号',
    dataIndex: 'logisticsOrderNo',
    key: 'logisticsOrderNo',
    width: 200,
  },
  {
    align: 'center',
    title: '承运方',
    dataIndex: 'carrier',
    key: 'carrier',
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'count',
    key: 'count',
  },
  {
    align: 'center',
    title: '方数',
    dataIndex: 'squareNum',
    key: 'squareNum',
  },
]
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
    key: 'dates',
    scopedSlots: { customRender: 'dates' },
  },
  {
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    title: '电话',
    dataIndex: 'phone',
  },
  {
    title: '车辆类型',
    dataIndex: 'vehicleTypeName',
    width: 130,
  },
  {
    title: '运输费（元）',
    dataIndex: 'price',
    width: 140,
  },
  {
    title: '目的地',
    dataIndex: 'address',
    scopedSlots: { customRender: 'address' },
    width: 140,
  },

  {
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
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
    FormAdd,
  },
  data() {
    return {
      columns,
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        status: '1',
        myTask: 0,
      },
      assetTypeList: [],
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

      innerColumns: innerColumns,
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('开始加载数据', JSON.stringify(this.queryParam))
        return transportPage(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],

      dataSource: [],
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
      isExpanded: false, //是否展开列表子数据
      expandedRowKeys: [],
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'distribution_transport') {
          this.searchAction()
          getDictionaryList({ parentId: '543' }).then((res) => {
            this.assetTypeList = res.data
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    delete_list(id) {
      let that = this
      listInformationdelete({ id: id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          that.$message.error(res.msg)
        }
      })
    },
    searchCheck() {
      this.isExpanded = true
      this.searchAction()
    },
    // this.isExpanded = true
    dateChange(date, dateString) {
      // this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'startDate', dateString[0])
      this.$set(this.queryParam, 'endDate', dateString[1])
    },
    searchAction(opt) {
      let that = this

      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      transportPage(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          that.expandedRowKeys = that.isExpanded ? that.dataSource.map((item) => item.key) : []

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
      // taskDocumentStatusNum(_searchParam).then((res) => {
      //   this.Totalmessages = res.data
      // })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    paramClick(key) {
      if (key !== '0') {
        this.queryParam = { ...this.queryParam, status: key }
      } else {
        this.queryParam = { ...this.queryParam, status: null }
      }

      this.searchAction()
    },
    applyFor(type, record) {
      this.$refs.formadd.query(type, record)
    },
    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
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
