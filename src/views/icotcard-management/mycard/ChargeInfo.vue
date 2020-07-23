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
    title: '卡号',
    dataIndex: 'cardNum'
  },
  {
    align: 'center',
    title: '运营商',
    dataIndex: 'beginDate'
  },
  {
    align: 'center',
    title: '扣费周期',
    dataIndex: 'endDate'
  },
  {
    align: 'center',
    title: '流量用量（MB）',
    dataIndex: 'endDate'
  },
  {
    align: 'center',
    title: '套餐外流量（MB）',
    dataIndex: 'endDate'
  },
    {
    align: 'center',
    title: '总金额',
    dataIndex: 'endDate'
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
      loading: false,
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  methods: {
    sDateChange() {},
    outPort() {},
    handleTableChange() {}
  }
}
</script>

<style>
</style>