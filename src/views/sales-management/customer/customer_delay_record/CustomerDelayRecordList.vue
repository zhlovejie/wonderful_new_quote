<template>
  <!-- 面试记录 -->
  <div class="customer_delay_record-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="客户名称模糊查询" v-model="customer_name" allowClear style="width: 200px;"/>

      <a-select
        placeholder="选择销售"
        :allowClear="true"
        v-model="userId"
        style="width: 200px;"
        showSearch
        :filterOption="filterCustomerOption"
      >
        <a-select-option
          v-for="item in saleUserSelectDataSource"
          :value="item.userId"
          :key="item.userId"
        >{{ item.salesmanName }}
        </a-select-option>
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
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()"/>
  </div>
</template>
<script>
  import { getAllSalesman } from '@/api/customer/salesman'
  import { listCustomerDelayRecord } from '@/api/customer/saleCustomerDelayRecord'
  import AddForm from './modules/AddCustomerDelayRecord'

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
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      scopedSlots: { customRender: 'customerName' }
    },
    {
      align: 'center',
      title: '对应销售',
      key: 'saleUserName',
      dataIndex: 'saleUserName',
      scopedSlots: { customRender: 'saleUserName' }
    },
    {
      align: 'center',
      title: '联系倒计时',
      dataIndex: 'linkCountDown',
      key: 'linkCountDown',
      scopedSlots: { customRender: 'linkCountDown' }
    },
    {
      align: 'center',
      title: '延时天数',
      dataIndex: 'delayDayNum',
      key: 'delayDayNum',
      scopedSlots: { customRender: 'delayDayNum' }
    },
    {
      align: 'center',
      title: '备注信息',
      dataIndex: 'remark',
      key: 'remark',
      scopedSlots: { customRender: 'remark' }
    },
    {
      align: 'center',
      title: '提交人',
      dataIndex: 'createdUserName',
      key: 'createdUserName',
      scopedSlots: { customRender: 'createdUserName' }
    },
    {
      align: 'center',
      title: '提交时间',
      key: 'createdTime',
      dataIndex: 'createdTime',
      scopedSlots: { customRender: 'createdTime' }
    }
  ]

  export default {
    name: 'customer_delay_record',
    components: {
      AddForm,
    },
    data () {
      return {
        activeKey: 0,
        userId: undefined,
        customer_name: undefined,
        saleUserSelectDataSource: [],
        columns: columns,
        dataSource: [],
        pagination: {
          current: 1
        },
        loading: false
      }
    },
    computed: {
      searchParam () {
        return {
          customerName: this.customer_name,
          saleUserId: this.userId
        }
      }
    },
    watch: {
      '$route': {
        handler: function (to, from) {
          if (to.name === 'customer_delay_record') {
            this.init()
          }
        },
        immediate: true
      }
    },
    methods: {
      init () {
        let that = this
        getAllSalesman().then(res => that.saleUserSelectDataSource = res.data)
        this.searchAction()
      },
      searchAction (opt) {
        let that = this
        let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
        console.log('执行搜索...', _searchParam)
        that.loading = true
        listCustomerDelayRecord(_searchParam).then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        }).catch(err => that.loading = false)
      },
      doAction(type,record) {
        let that = this
        that.$refs.addForm.query(type, record)
      },
      // 分页
      handleTableChange (pagination, filters, sorter) {
        console.log(pagination, filters, sorter)
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.searchAction({ current: pagination.current })
      },

      filterCustomerOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  }
</script>
<style scoped>
  .customer_delay_record-list-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }

  .customer_delay_record-list-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }

  .main-wrapper {
    margin-top: 20px;
  }
</style>
