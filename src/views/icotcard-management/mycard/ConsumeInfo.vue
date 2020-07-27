<template>
  <div>
    <a-form layout="inline">
      <a-form-item label="使用日期">
        <a-range-picker
          v-model="sDate"
          @change="sDateChange"
          style="width:260px;"
          :allowClear="true"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          class="a-button"
          type="primary"
          icon="search"
          @click="searchAction({current:1})"
        >查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" @click="outPort">导出</a-button>
      </a-form-item>
    </a-form>
    <h3 style="font-weight:600">
      累计流量用量：
      <span>200.00MB</span> 当前流量用量：
      <span>23.00MB</span>
    </h3>
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
</template>

<script>
import {getSimInformationExportList, consumeDetailList} from '@/api/simCard'

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
    title: 'iccid',
    dataIndex: 'iccid'
  },
  {
    align: 'center',
    title: '使用日期',
    dataIndex: 'usedDate'
  },
  {
    align: 'center',
    title: '流量用量（MB）',
    dataIndex: 'usedAmount'
  }
]
export default {
  data() {
    return {
      searchParam: {},
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1
      },
      iccid:'',
      loading: false,
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  methods: {
    init(iccid) {
      this.iccid=iccid
      this.searchAction({iccid})
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = false
      consumeDetailList(_searchParam)
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
    sDateChange() {},
    outPort() {},
    handleTableChange() {}
  }
}
</script>

<style>
</style>