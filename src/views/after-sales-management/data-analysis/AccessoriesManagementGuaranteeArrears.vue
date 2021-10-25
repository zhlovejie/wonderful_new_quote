<template>
  <a-card :bordered="false">
    <a-form layout="inline">
      <a-form-item>
        <a-button-group>
          <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 4 }" @click="simpleSearch(4)"
            >全部</a-button
          >
        </a-button-group>
      </a-form-item>
      <a-form-item>
        <a-range-picker v-model="sDate" :allowClear="true" />
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" icon="download" @click="actionHandler('download')">下载</a-button>
      </a-form-item>
    </a-form>

    <h1>合计(元)：{{totalMoney}}</h1>
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
      <div slot="money" slot-scope="text, record, index">
        <span>{{ record.money | moneyFormatNumber }}</span>
      </div>

      <a-table
        slot="expandedRowRender"
        slot-scope="record, index, indent, expanded"
        :columns="innerColumns"
        :dataSource="record.managementList"
        :pagination="false"
        size="small"
      >
        <div slot="paymentType" slot-scope="text, record, index">
          <span>{{ {0:'完结付款',1:'先付款',2:'免付款'}[text] }}</span>
        </div>
        <div slot="isPayment" slot-scope="text, record, index">
          <span>{{ {0:'未付款',1:'已付款'}[text] }}</span>
        </div>
      </a-table>


    </a-table>
  </a-card>
</template>

<script>
import {
  accessoriesManagementGuaranteeArrears,
  accessoriesManagementTotalAmount,
  exportExcelDatas
} from '@/api/after-sales-management-custom'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '销售人员',
    dataIndex: 'userName'
  },
  {
    title: '担保金额(元)',
    dataIndex: 'money',
    scopedSlots: { customRender: 'money' },
  }
]

const innerColumns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '配件清单编号',
    dataIndex: 'accessoriesNum',
  },
  {
    title: '任务单编号',
    dataIndex: 'taskDocumentNum',
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    title: '机构名称',
    dataIndex: 'orgName',
  },
  {
    title: '付款方式',
    dataIndex: 'paymentType',
    scopedSlots: { customRender: 'paymentType' },
  },
  {
    title: '是否付款',
    dataIndex: 'isPayment',
    scopedSlots: { customRender: 'isPayment' },
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
  }
]


export default {
  name: 'AccessoriesManagementGuaranteeArrears  ',
  data() {
    return {
      pageTitle: '销售担保欠款',
      columns,
      innerColumns,
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      stageTimeType: undefined,
      totalMoney:0
    }
  },
  computed: {
    searchParam() {
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        beginTime:startTime,
        endTime:endTime,
        dayWeekMonth: this.stageTimeType,
      }
    },
  },
  created(){
    this.init()
  },
  methods: {
    moment: moment,
    init() {
      this.searchAction()
    },
    async searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      await accessoriesManagementGuaranteeArrears(_searchParam)
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

      await accessoriesManagementTotalAmount(_searchParam).then(res => {
        console.log(res)
        that.totalMoney = res.data
      }).catch(err => {
        console.log(err)
        that.totalMoney = 0
      })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    simpleSearch(type) {
      this.stageTimeType = type
      this.searchAction()
    },
    actionHandler(type) {
      if (type === 'search') {
        this.searchAction()
      } else if (type === 'download') {
        this.downloadAction()
      }
    },
    downloadAction() {
      let that = this
      exportExcelDatas(2, this.searchParam)
        .then((res) => {
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `${that.pageTitle}.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => {
          that.$message.info(`请求出错：${err.message}`)
        })
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  padding: 50px 0 0 0;
}
.chart-wrapper .chart-title {
  text-align: center;
  font-size: 22px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

