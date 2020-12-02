<template>
  <!-- 客户预收款合同列表-->
  <a-modal
    title="客户预收款合同列表"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="null"
  >
  <a-card :bordered="false" class="_sales_top_wrapper">
    <a-row>
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-form layout="inline">
          <a-form-item>
            <a-input placeholder="合同编号" v-model="contractNum" allowClear style="width:200px;" />
          </a-form-item>
          
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="download" @click="actionHandler('download')">下载</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange" 
          :scroll="{ y: 500 }"
          size="middle" 
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="contractAmount" slot-scope="text">
            <span>{{text | moneyFormatNumber}}</span>
          </div>
          <div slot="shouldAmount" slot-scope="text,record">
            <a href="javascript:void(0);" @click="actionHandler('shouldAmount',record)">{{text | moneyFormatNumber}}</a>
          </div>
          <div slot="recivevAmount" slot-scope="text,record">
            <a href="javascript:void(0);" @click="actionHandler('recivevAmount',record)">{{text | moneyFormatNumber}}</a>
          </div>
          <div slot="minAmount" slot-scope="text">
            <span style="color:red;">{{text | moneyFormatNumber}}</span>
          </div>
        </a-table>
      </a-col>
      
    </a-row>
    <RecivevAmountForm ref="recivevAmountForm" />
    <ShouldAmountForm ref="shouldAmountForm" />
  </a-card>
  </a-modal>
</template>

<script>
import { pageListReportPrepareMoneyContract, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'

import RecivevAmountForm from './RecivevAmount'
import ShouldAmountForm from './ShouldAmount'

let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '合同编号',
    dataIndex: 'contractNum',
  },
  {
    title: '总计(元)',
    dataIndex: 'contractAmount',
    scopedSlots: { customRender: 'contractAmount' }
  },
  {
    title: '应收金额(元)',
    dataIndex: 'shouldAmount',
    scopedSlots: { customRender: 'shouldAmount' }
  },
  {
    title: '实收金额(元)',
    dataIndex: 'recivevAmount',
    scopedSlots: { customRender: 'recivevAmount' }
  },
  {
    title: '欠款(元)',
    dataIndex: 'minAmount',
    scopedSlots: { customRender: 'minAmount' }
  }
]

export default {
  name: 'AdvancePaymentChart-ContractView',
  components:{
    RecivevAmountForm,ShouldAmountForm
  },
  data() {
    return {
      pageTitle: '客户预收款单合同列表',
      columns: columns,
      contractNum:undefined,
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize:10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },

      loading: false,
      visible:false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      record:{}
    }
  },
  computed: {
    searchParam() {
      return {
        customerId:this.record.customerId,
        staticsDate:this.record.staticsDate
      }
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let queue = []
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      that.loading = true
      pageListReportPrepareMoneyContract(_searchParam)
        .then((res) => {
          that.loading = false
          let data = res.data
          try {
            that.dataSource = data.records.map((item, index) => {
              item.key = uuid()
              item.staticsDate = item.staticsDate ? item.staticsDate.slice(0, 10) : '-'
              return item
            })
          } catch (e) {
            console.log(e)
            that.dataSource = []
          }
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = data.total || 0
          pagination.current = data.current || 1
          that.pagination = pagination

        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if(+pager.pageSize !== +pager._prePageSize){ //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = {...this.pagination,...pager}
      this.searchAction()
    },
    
    query(type,record={}){
      this.visible = true
      this.record = {...record}
      this.$nextTick(() => this.searchAction())
    },
    handleSubmit(){
      this.handleCancel()
    },
    handleCancel(){
      this.visible = false
    },
    actionHandler(type,record) {
      if (type === 'search') {
        this.searchAction({current:1})
      } else if (type === 'download') {
        this.downloadAction()
      } else if(type === 'shouldAmount'){
        this.$refs.shouldAmountForm.query(type,{...record,staticsDate:this.record.staticsDate})
        return
      } else if(type === 'recivevAmount'){
        this.$refs.recivevAmountForm.query(type,{...record,staticsDate:this.record.staticsDate})
        return
      }
    },
    downloadAction() {
      let that = this
      exportExcelDatas(10, this.searchParam)
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
    }
  },
}
</script>

<style scoped>
.chart-wrapper {
  padding: 0 0 0 0;
}
.chart-wrapper .chart-title {
  text-align: center;
  font-size: 22px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}

._sales_top_wrapper >>> .department-sum-item {
  color: red;
  font-weight: bold;
}

._sales_top_wrapper >>> .ant-table-header{
  overflow-y: auto !important;
}
._sales_top_wrapper >>> .ant-table-body{
  overflow-y: auto !important;
}
</style>