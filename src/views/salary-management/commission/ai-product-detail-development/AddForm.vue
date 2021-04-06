<template>
  <a-modal :title="modalTitle" :width="1000" :visible="visible"  @cancel="handleCancel" :footer="null" :maskClosable="false">
    <a-spin :spinning="spinning">
      <h3>{{title}}</h3>
      <table class="custom-table custom-table-border">
        <thead>
        <tr>
          <th>序号</th>
          <th>合同编号</th>
          <th>合同总金额</th>
          <th>应发产品提成金额</th>
          <th>回款额(元)</th>
          <th>差额(元)</th>
          <th>实发提成(元)</th>
        </tr>
        </thead>
        <tbody>
          <template v-if="dataSource.detailList.length > 0">
            <tr v-for="(item,idx) in dataSource.detailList" :key="idx">
              <td>{{idx + 1}}</td>
              <td>{{item.contractNum}}</td>
              <td>{{item.contractAmount | moneyFormatNumber}}</td>
              <td>{{item.shouldAmount | moneyFormatNumber}}</td>
              <td>{{item.receiveAmount | moneyFormatNumber}}</td>
              <td>{{item.subAmount | moneyFormatNumber}}</td>
              <td>{{item.percentageAmount | moneyFormatNumber}}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="7">暂无数据</td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr >
            <td colspan="2">合计</td>
            <td>{{dataSource.allContractAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allShouldAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allReceiveAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allSubAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allPercentageAmount | moneyFormatNumber}}</td>
          </tr>
        </tfoot>
      </table>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  developmentRealityPercentageHisDetail
} from '@/api/commissionDetail'

export default {
  name:"",
  data(){
    return {
      modalTitle:'提成明细',
      visible:false,
      spinning:false,
      dataSource:{
        allContractAmount:0,
        allShouldAmount:0,
        allReceiveAmount:0,
        allSubAmount:0,
        allPercentageAmount:0,
        detailList:[]
      },
      title:''
    }
  },
  methods:{
    init(opt){
      const that = this
      that.spinning = true
      developmentRealityPercentageHisDetail(opt).then(res => {
        that.spinning = false
        that.dataSource = res.data
      }).catch(err => {
        that.spinning = false
        that.$message.error(err.message)
      })
    },
    query(type,record){
      this.visible = true

      let {departmentId,staticsDate} = record

      this.title = `${staticsDate.slice(0,7)}月【${record.departmentName}】提成明细`
      this.$nextTick(() => {
        this.init({departmentId,staticsDate:staticsDate.slice(0,7)})
      })
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
  line-height: 40px;
}
.custom-table-border tfoot{
  font-weight: bold;
  color: red;
}
</style>
