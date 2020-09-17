<!-- 车辆问题上报记录 -->
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
        placeholder="报修人员模糊查询"
        v-model="searchParam.createdName"
      />
      
      <a-select
        placeholder="状态"
        v-model="searchParam.status"
        :allowClear="true"
        style="width: 150px"
      >
        <a-select-option :value="1">待处理</a-select-option>
        <a-select-option :value="2">处理中</a-select-option>
        <a-select-option :value="3">已驳回</a-select-option>
        <a-select-option :value="4">已完结</a-select-option>
      </a-select>

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
        <div slot="status" slot-scope="text, record">
          <a
            href="javascript:void(0);"
            @click="approvalPreview(record)"
          >{{ {1:'待处理',2:'处理中',3:'已驳回',4:'已完结'}[text] }}</a>
        </div>
      </a-table>
    </div>

    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import { carQuestionReportList} from '@/api/vehicleManagement'
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
    dataIndex: 'carCode',
  },
  {
    align: 'center',
    title: '车辆名称',
    dataIndex: 'carName',
  },
  {
    align: 'center',
    title: '报修项目',
    dataIndex: 'repairItem',
  },
  {
    align: 'center',
    title: '故障描述',
    dataIndex: 'quesDesc'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '报修人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
]

export default {
  name: 'vehicle-management-supervision-issues-record',
  components: {
    ApproveInfo
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {
        searchStatus: 0,
      },
      visible: false,
      bindEnterFn: null,
      planList: [],
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'vehicle-management-supervision-issues-record') {
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
      carQuestionReportList(_searchParam)
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
          this.searchParam.beginTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.beginTime = undefined
          this.searchParam.endTime = undefined
        }
      }
    },
    doAction(type, record) {
      let that = this
      if (type === 'fix-desc') {
        carMaintenancePlanList({ applyId: record.id }).then((res) => {
          that.planList = res.data
        })
        this.visible = true
        return
      } else if (type === 'evidence') {
        carMaintenanceEvidenceList({ applyId: record.id }).then((res) => {
          console.log(res)
          if (res && Array.isArray(res.data) && res.data.length > 0) {
            let imgList = res.data.map((item) => decodeURIComponent(item.url))
            that.$refs.imgViewList.show(imgList)
          } else {
            that.$message.info('未上传凭证')
          }
        })
      }
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
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