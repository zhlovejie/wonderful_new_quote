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
          @click="searchAction({iccId:iccid,current:1})"
        >查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button class="a-button" type="primary" @click="outPort">导出</a-button>
      </a-form-item>
    </a-form>
    <h3 style="font-weight:600">
      累计流量用量：
      <span>{{accrueUsedAmount}}MB</span> 
      当前流量用量：
      <span>{{usedAmount}}MB</span>
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
import {getSimInformationFlow,consumeDetailList, getSimInformationExportList} from '@/api/simCard'
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
  },
]
export default {
  data() {
    return {
      columns:columns,
      searchParam: {},
      sDate: [undefined, undefined],
      iccid:'',
      usedAmount:0,
      accrueUsedAmount:0,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
    }
  },
  methods: {
    transMb(kb){
      return kb/1024
    },
    init(iccid) {
      this.iccid=iccid

      this.searchParam = {
        iccId:iccid,current:1
      }

      this.searchAction()
      // 获取流量详情
      getSimInformationFlow({iccId:iccid}).then(res=>{
        if(res.code==200){
          // 当前
          this.usedAmount=(this.transMb(res.data.usedAmount)).toFixed(2)
          // 累计
          this.accrueUsedAmount=(this.transMb(res.data.accrueUsedAmount)).toFixed(2)
        }else{
          this.$message.warning(res.msg)
        }
      })
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
            item.usedAmount=item.usedAmount==0?0:(item.usedAmount/1024).toFixed(2)
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
    sDateChange(data,dataStr) {
      this.searchParam.beginDate=dataStr[0]
      this.searchParam.endDate=dataStr[1]
    },
    // 导出
    outPort() {
      const downListParams=Object.assign({}, { ...this.searchParam },{iccId:this.iccid})
       getSimInformationExportList(downListParams)
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
              a.download = '消费详情.xls'
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