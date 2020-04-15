<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="order-search-wrapper">
      <a-form >
        <a-row :gutter="24">
          <a-col :span="7">
            <a-form-item label="订单编号">
              <a-input v-model.trim="queryParam.orderNum" placeholder="根据订单编号模糊查询" />
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="合同编号">
              <a-input v-model.trim="queryParam.contractNum" placeholder="根据合同编号模糊查询" />
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <CustomerSelect
              ref="customerSelect"
              :options="customerSelectOptions"
              @selected="handleCustomerSelected"
              @inputClear="handleCustomerClear"
            />
          </a-col>
          <a-col :span="3">
            <template v-if="$auth('order:list')">
              <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </a-form-item>
            </template>
          </a-col>
          <a-col :span="7">
            <a-form-item label="销售人员">
              <a-select
                showSearch
                optionFilterProp="children"
                :filterOption="filterCustomerOption"
                v-model.trim="queryParam.saleUserId"
                placeholder="请选择销售人员"
                default-value="0"
              >
                <a-select-option :value="0">请选择</a-select-option>
                <a-select-option
                  v-for="sale in sales"
                  :key="sale.index"
                  :value="sale.userId"
                >{{ sale.salesmanName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="14">
            <a-form-item label="创建时间">
              <a-range-picker style="width:calc(100% - 12px);" @change="onPickerChange"/>
            </a-form-item>
          </a-col>
        </a-row>
        
        
        
        
              <!--              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>-->
      </a-form>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('order:edit')">
              <a @click="handleEdit(record)">编辑</a>
            </template>
            <template v-if="$auth('order:one')">
              <a-divider type="vertical" />
              <a @click="query(record)">查看</a>
              <a-divider type="vertical" />
              <a target="_blank" :href="record.orderUrl">下载</a>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
  </a-card>
</template>
<script>
import { getOrderList, getAllContractSalesman } from '@api/order'
import { STable } from '@/components'
import orderModule from './modules/orderModule'
import system from '@/config/defaultSettings'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '订单编号',
    key: 'orderNum',
    dataIndex: 'orderNum'
  },
  {
    align: 'center',
    title: '合同编号',
    dataIndex: 'contractNum',
    key: 'contractNum'
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
    scopedSlots: { customRender: 'customerId' }
  },
  {
    align: 'center',
    title: '对应销售',
    dataIndex: 'saleUserName',
    key: 'saleUserId'
  },
  {
    align: 'center',
    title: '预定最近交货日期',
    dataIndex: 'latelyDeliveryDate',
    key: 'latelyDeliveryDate'
  },
  {
    align: 'center',
    title: '创建人',
    key: 'createdName',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '创建时间',
    key: 'orderCreatedTime',
    dataIndex: 'orderCreatedTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'Order',
  components: {
    // 组件
    STable,
    system,
    CustomerSelect
  },
  data() {
    return {
      queryParam: {},
      customers: [],
      sales: [],
      selectedRowKeys: [],
      selectedRows: [],
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        this.$set(this.queryParam, 'approvalStatus', 2)
        return getOrderList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
          .catch(error => {
            this.loading = false
            console.error(error)
          })
      },
      customerSelectOptions:{
        wrapperStyle:{},
        formLayout:'inline',
        formItemLayout:{
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired:false,
        inputAllowClear:true
      }
    }
  },
  mounted(){
    let that = this
    Promise.all([
      getAllContractSalesman().then(res => {
        that.sales = res.data
      })
    ])
  },
  watch: {
    $route(to, from) {
      if (from.fullPath === '/sale/order/modules') {
        this.$refs.table.refresh(true)
      }
    }
  },
  methods: {
    // 编辑
    handleEdit(record) {
      this.$router.push({ name: 'orderModule', params: { contractId: record.id, show: false } })
    },
    // 查看
    query(record) {
      this.$router.push({ name: 'orderModule', params: { contractId: record.id, show: true } })
    },
    // 下载
    handleDownload(record) {
      var link = document.createElement('a')
      link.href = system.baseURL + '/sale-contract/orderDownload?id=' + record.id
      link.download = 'lslsls'
      // 此写法兼容可火狐浏览器
      document.body.appendChild(link)
      var evt = document.createEvent('MouseEvents')
      evt.initEvent('click', false, false)
      link.dispatchEvent(evt)
      document.body.removeChild(link)
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    handleEditOk() {
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    filterCustomerOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleCustomerSelected(item){
      this.queryParam.customerId = item.id
    },
    handleCustomerClear(){
      'customerId' in this.queryParam && delete this.queryParam.customerId
    },
    onPickerChange(arrMoment,arrStr){
      //debugger
      //arrMoment  2个moment对象  
      //arrStr  2个 YYYY-MM-DD 字符串
      this.queryParam.startTime = arrStr[0].length > 0 ? `${arrStr[0]} 00:00:00` : ''
      this.queryParam.endTime   = arrStr[1].length > 0 ? `${arrStr[1]} 23:59:59` : ''

      //this.queryParam.startTime = arrMoment.length === 0 ? null : arrMoment[0].format('YYYY-MM-DD HH:mm:ss')
      //this.queryParam.endTime = arrMoment.length === 0 ? null : arrMoment[1].format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.order-search-wrapper >>> .ant-form-item {
  display: flex;
}

.order-search-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
