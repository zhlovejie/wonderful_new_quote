<template>
  <!-- 销售部收款分析表 -->
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker style="width: 200px" v-model="queryParam.receiptDate" />
      <a-select
        style="width: 200px; margin-left: 10px; margin-right: 10px"
        placeholder="选择部门"
        :allowClear="true"
        v-model="queryParam.depId"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>

      <a-input
        style="width: 200px; margin-right: 10px"
        v-model="queryParam.userName"
        placeholder="姓名模糊查询"
        :allowClear="true"
      />
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-alert :message="receiptAmount" type="info" style="float: left; width: 200px; margin: 5px 5px" />
      <a-alert :message="refundAmount" type="info" style="float: left; width: 200px; margin: 5px 5px" />
      <a-alert :message="receivableAmount" type="info" style="float: left; width: 200px; margin: 5px 5px" />

      <a-table
        v-if="$auth('commissionBonus:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script>
import { receiptAnalyse_list, bonus_getDepartmentByType, receiptAnalyse_getSumAmount } from '@/api/bonus_management'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },

  {
    align: 'center',
    title: '日期',
    dataIndex: 'receiptDate',
    key: 'receiptDate',
  },

  {
    align: 'center',
    title: '部门',
    dataIndex: 'depName',
    key: 'depName',
  },
  {
    align: 'center',
    title: '销售经理',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    align: 'center',
    title: '合同编号',
    dataIndex: 'contractNum',
    key: 'contractNum',
  },
  {
    align: 'center',
    title: '合同运费',
    dataIndex: 'freightCharge',
    key: 'freightCharge',
  },
  {
    align: 'center',
    title: '合同运费差额',
    dataIndex: 'freightChargeSub',
    key: 'freightChargeSub',
  },
  {
    align: 'center',
    title: '收款',
    dataIndex: 'receiptAmount',
    key: 'receiptAmount',
  },
  {
    align: 'center',
    title: '退款',
    dataIndex: 'refundAmount',
    key: 'refundAmount',
  },
  {
    align: 'center',
    title: '回款额',
    key: 'receivableAmount',
    dataIndex: 'receivableAmount',
  },
]

export default {
  name: 'NoticeList',
  components: {},
  data() {
    return {
      depList: [],
      queryParam: { current: 1 },
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      receiptAmount: '',
      refundAmount: '',
      receivableAmount: '',
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'collection') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    disabledDate(current) {
      return current && current > moment().subtract(30, 'days')
    },
    init() {
      let that = this
      that.searchAction()
      bonus_getDepartmentByType({ type: 1 }).then((res) => (this.depList = res.data))
    },
    searchAction(opt) {
      let that = this
      if (that.queryParam.receiptDate) {
        let date = moment(that.queryParam.receiptDate).format('YYYY-MM')
        that.queryParam.receiptDate = date
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      that.loading = true
      receiptAnalyse_getSumAmount(_searchParam).then((res) => {
        if (res.data) {
          this.receiptAmount = `总收款: ${res.data.receiptAmount}`
          this.refundAmount = `本期退款: ${res.data.refundAmount}`
          this.receivableAmount = `总回款额: ${res.data.receivableAmount}`
        } else {
          this.receiptAmount = `总收款: 0`
          this.refundAmount = `本期退款: 0`
          this.receivableAmount = `总回款额: 0`
        }
      })
      receiptAnalyse_list(_searchParam)
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
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
