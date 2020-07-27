<template>
  <div>
    <a-form layout="inline">
      <a-form-item label="使用日期">
        <a-range-picker
          :value="sDate"
          format="YYYY-MM"
          :mode="['month', 'month']"
          @panelChange="panelChange"
          style="width:260px;"
          :allowClear="true"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          class="a-button"
          type="primary"
          icon="search"
          @click="searchAction({iccId:iccid,current:1})"
        >查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" @click="outPort">导出</a-button>
      </a-form-item>
    </a-form>
    <h3 style="font-weight:600">
      当前余额：
      <span>{{balance}}元</span>
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
import {getDeductionDetailExportList, getDeductionDetailList} from '@/api/simCard'

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
    title: '运营商',
    dataIndex: 'operatortype'
  },
  {
    align: 'center',
    title: '扣费周期',
    dataIndex: 'deductionDate'
  },
  {
    align: 'center',
    title: '流量用量（MB）',
    dataIndex: 'usedAmount'
  },
  {
    align: 'center',
    title: '套餐外流量（MB）',
    dataIndex: 'outPackage'
  },
  {
    align: 'center',
    title: '总金额',
    dataIndex: 'cardaccount'
  },
]
export default {
  data() {
    return {
      columns:columns,
      searchParam: {},
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1
      },
      iccid:'',
      loading: false,
      balance:0,
    }
  },
  methods: {
    init(iccid) {
      this.iccid=iccid
      this.searchAction({iccId:iccid})
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = false
      getDeductionDetailList(_searchParam)
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
          // 余额
          let resultAccount=0
          res.data.records.forEach(item=>{
            resultAccount=resultAccount+item.cardaccount
          })
          this.balance=resultAccount
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({iccId:this.iccid})
    },
    panelChange(arrMoment){
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.sDate=arrMoment
          this.searchParam.beginDate = arrMoment[0].format('YYYY-MM')
          this.searchParam.endDate = arrMoment[1].format('YYYY-MM')
        } else {
          this.searchParam.beginDate = undefined
          this.searchParam.endDate = undefined
        }
      }
    },
    // 导出
     outPort() {
      const downListParams=Object.assign({}, { ...this.searchParam },{iccId:this.iccid})
       getDeductionDetailExportList(downListParams)
        .then(res => {
          this.loading = false
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            //const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '扣费详情.xls'
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function(e) {
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
        .catch(err => (this.loading = false))
    },
  }
}
</script>

<style>
</style>