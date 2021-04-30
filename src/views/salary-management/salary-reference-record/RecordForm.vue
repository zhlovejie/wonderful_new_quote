<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-select
      placeholder="选择岗位"
      v-model="searchParam.stationId"
      :allowClear="true"
      showSearch
      optionFilterProp="children"
      style="width: 200px; margin-bottom: 20px; margin-right: 10px"
    >
      <a-select-option v-for="item in postList" :key="item.id" :value="item.id">{{ item.stationName }}</a-select-option>
    </a-select>
    <a-select
      placeholder="工资类别"
      v-model="searchParam.salaryType"
      :allowClear="true"
      style="width: 200px; margin-right: 10px"
    >
      <a-select-option :value="0">基本工资</a-select-option>
      <a-select-option :value="1">岗位工资</a-select-option>
    </a-select>
    <a-input
      placeholder="修改人姓名"
      v-model="searchParam.userName"
      allowClear
      style="width: 200px; margin-right: 10px"
    />
    <a-range-picker
      v-model="sDate"
      :placeholder="['开始日期', '结束日期']"
      @change="rangePickerChange"
      style="width: 280px; margin-right: 10px"
      :allowClear="true"
    />

    <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
    <a-spin :spinning="spinning">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="spinning"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="salaryType" slot-scope="text, record, index">
          <span>{{ text === 0 ? '基本工资' : '岗位工资' }}</span>
        </div>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getStationList, //获取所有岗位
} from '@/api/systemSetting'
import { oaSalaryInfoStationStationStandardChangList } from '@/api/salaryManagement'
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
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName',
  },

  {
    align: 'center',
    title: '工资类别',
    dataIndex: 'salaryType',
    key: 'salaryType',
    scopedSlots: { customRender: 'salaryType' },
  },
  {
    align: 'center',
    title: '原参照工资(元)',
    dataIndex: 'oldSalary',
    key: 'oldSalary',
  },
  {
    align: 'center',
    title: '现参照工资(元)',
    dataIndex: 'newSalary',
    key: 'newSalary',
  },
  {
    align: 'center',
    title: '修改人',
    dataIndex: 'createdName',
    key: 'createdName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
]

export default {
  name: 'RecordForm',
  components: {},
  data() {
    return {
      columns: columns,
      sDate: [undefined, undefined],
      searchParam: {},
      departmentId: '',
      pagination: {},
      postList: [],
      dataSource: [],
      visible: false,
      spinning: false,
    }
  },
  computed: {
    modalTitle() {
      return '修改记录'
    },
  },
  methods: {
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
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
    query(type, record) {
      let that = this
      that.visible = true
      that.searchParam = {}
      that.sDate = []
      that.departmentId = record.departmentId
      getStationList({ id: record.departmentId }).then((res) => (that.postList = res.data))
      that.searchAction()
    },

    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign(
        { departmentId: that.departmentId },
        { ...this.searchParam },
        { ...this.pagination },
        opt
      )
      console.log('执行搜索...', _searchParam)
      that.spinning = true
      oaSalaryInfoStationStationStandardChangList(_searchParam)
        .then((res) => {
          that.spinning = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
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
      this.searchAction({ current: pagination.current })
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>