<template>
  <a-modal :title="modalTitle" :width="1150" :visible="visible"  @cancel="handleCancel" :footer="null" :maskClosable="false">
    <a-spin :spinning="spinning">
      <h3>{{title}}</h3>
      <table class="custom-table custom-table-border">
        <thead>
        <tr>
          <th>序号</th>
          <th>合同编号</th>
          <th>原合同总金额</th>
          <th>原应发总提成金额</th>
          <th>现合同总金额</th>
          <th>现应发总提成金额</th>
          <th>已发提成(元)</th>
          <th>应发提成(元)</th>
          <th>差额(元)</th>
        </tr>
        </thead>
        <tbody>
          <template v-if="dataSource.difHisList.length > 0">
            <tr v-for="(item,idx) in dataSource.difHisList" :key="idx">
              <td>{{idx + 1}}</td>
              <td>{{item.contractNum}}</td>
              <td>{{item.oldContractAmount | moneyFormatNumber}}</td>
              <td>{{item.oldContractShouldPercentageAmountBigDecimal | moneyFormatNumber}}</td>
              <td>{{item.newContractAmount | moneyFormatNumber}}</td>
              <td>{{item.newContractShouldPercentageAmountBigDecimal | moneyFormatNumber}}</td>
              <td>{{item.alreadyAmountBigDecimal | moneyFormatNumber}}</td>
              <td>{{item.shouldAmountBigDecimal | moneyFormatNumber}}</td>
              <td>{{item.subAmountBigDecimal | moneyFormatNumber}}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="9">暂无数据</td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr >
            <td colspan="2">合计</td>
            <td>{{dataSource.allOldContractAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allOldContractShouldPercentageAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allNewContractAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allNewContractShouldPercentageAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allAlreadyAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allShouldAmount | moneyFormatNumber}}</td>
            <td>{{dataSource.allSubAmount | moneyFormatNumber}}</td>
          </tr>
        </tfoot>
      </table>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  percentageDifHisDetail
} from '@/api/commissionDetail'

export default {
  name:"",
  data(){
    return {
      modalTitle:'差额记录',
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
      percentageDifHisDetail(opt).then(res => {
        that.spinning = false
        that.dataSource = res.data
      }).catch(err => {
        that.spinning = false
        that.$message.error(err.message)
      })
    },
    query(type,record){
      this.visible = true

      let {userId,staticsDate} = record

      this.title = `${staticsDate.slice(0,7)}月【${record.departmentName} ${record.stationName} ${record.userName}】差额记录`
      this.$nextTick(() => {
        this.init({userId,staticsDate:staticsDate.slice(0,7)})
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
