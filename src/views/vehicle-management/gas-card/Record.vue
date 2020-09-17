
<template>
  <!-- 充值记录 -->
  <a-modal title="充值记录" v-model="priewVisible" :width="800" :footer="null" :maskClosable="false">
    <div class="search-options">
      <a-input style="width:180px;margin-right:10px;" placeholder="充值人模糊查询" v-model="searchParam.investUserName" :allowClear="true"/>
      <a-range-picker v-model="sDate" @change="rangePickerChange" style="width:220px;margin-right:10px;" :allowClear="true"/>
      <a-button  type="primary" icon="search" @click="searchAction" style="margin-right:10px;">查询</a-button>
      <a-button  type="primary" icon="download" @click="downloadAction">下载</a-button>
    </div>

    <h3 style="margin:10px 0">总充值：{{rechargeInfo.totalChargeAmount | moneyFormatNumber}} &nbsp;&nbsp; 余额：{{rechargeInfo.cardRemain | moneyFormatNumber}}</h3>
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text,record,index">
        <span>{{ index+1 }}</span>
      </div>
      <div slot="investAmount" slot-scope="text,record">
        {{ text | moneyFormatNumber}}
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { carOilInvestList, carOilInvestExport, carOilInvestAmount } from '@/api/vehicleManagement'
import moment from 'moment'
let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '卡名',
    dataIndex: 'cardName'
  },
  {
    align: 'center',
    title: '充值金额',
    dataIndex: 'investAmount',
    scopedSlots: { customRender: 'investAmount' }
  },
  {
    align: 'center',
    title: '充值人',
    dataIndex: 'createdName'
  },{
    align: 'center',
    title: '充值时间',
    dataIndex: 'createdTime'
  }
]

export default {
  name:'CustomerList',
  data(){
    return {
      columns,
      loading:false,
      pagination: {
        current:1
      },
      priewVisible:false,
      sDate:[undefined,undefined],
      searchParam:{},
      rechargeInfo:{
        totalChargeAmount:0,
        cardRemain:0
      },
      dataSource:[]
    }
  },
  methods:{
    moment,
    query(type,record){
      let that = this
      that.priewVisible = true
      that.searchParam = {...that.searchParam,carOilId:record.id}
      carOilInvestAmount({carOilId:record.id}).then(res => {
        that.rechargeInfo = res.data || {}
      })

      that.searchAction()
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    //点击查询
    searchAction(){ 
      const that = this
      that.loading = true
      let _param = Object.assign({},that.pagination,that.searchParam)
      console.log(_param)
      return carOilInvestList(_param).then((res) => {
        that.dataSource = res.data.records.map((item,index) =>{
          item.key = index + 1
          return item
        })
        that.loading = false
        const pagination = { ...that.pagination }
        pagination.total = res.data.total || 0
        this.pagination = pagination
        return res.data
      }).catch(error => {
        console.error(error)
        that.loading = false
      })
    },
    rangePickerChange(arrMoment,arrStrs){
      if(Array.isArray(arrMoment)){
        if(arrMoment.length === 2){
          this.searchParam.beginDate = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endDate = arrMoment[1].format('YYYY-MM-DD')
        }else{
          this.searchParam.beginDate = undefined
          this.searchParam.endDate = undefined
        }
      }
    },
    downloadAction(){
      let searchParam = Object.assign({},this.searchParam)
      let param = []
      for(let [k,v] of Object.entries(searchParam)){
        param.push(`${k}=${encodeURIComponent(v)}`)
      }
      param.push(`Authorization=${this.$store.getters.token}`)
      window.location.href = `${carOilInvestExport()}?${param.join('&')}`
    }
  }
}
</script>

<style scoped>
  .search-options {
    display: flex
  }
  .search-options .main-items{
    flex: 1;
  }
</style>