<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="null"
  >

  <a-spin :spinning="spinning">
    <table class="custom-table custom-table-border">
      <tr>
        <th>部门</th>
        <th>岗位</th>
        <th>原参照工资(元)</th>
        <th>现参照工资(元)</th>
        <th>修改人</th>
        <th>修改时间</th>
      </tr>
      <template v-if="dataSource.length > 0">
        <tr v-for="item in dataSource" :key="item.id">
          <td>{{item.departmentName}}</td>
          <td>{{item.stationName}}</td>
          <td>{{item.oldSalary | moneyFormatNumber}}</td>
          <td>{{item.newSalary | moneyFormatNumber}}</td>
          <td>{{item.createdName}}</td>
          <td>{{item.createdTime}}</td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td colspan="6">无记录</td>
        </tr>
      </template>
      
    </table>
  </a-spin>
  </a-modal>
</template>

<script>
import { 
  oaSalaryInfoStationStationStandardChangList
} from '@/api/salaryManagement'

export default {
  name:'RecordForm',
  components:{},
  data(){
    return {
      dataSource:[],
      visible:false,
      spinning:false
    }
  },
  computed:{
    modalTitle(){
      return '修改记录'
    }
  },
  methods:{
    handleCancel(){
      this.$nextTick(() =>this.visible = false)
    },
    async query(type,record){
      let that = this
      that.visible = true
      that.spinning = true
      //填充数据
      oaSalaryInfoStationStationStandardChangList({departmentId:record.departmentId})
      .then(res =>{
        that.spinning = false
        that.dataSource = res.data.records
      })
      .catch(err => {
        console.log(err)
        that.spinning = false
      })
    }
  }
}
</script>

<style scoped>

.custom-table-border th,.custom-table-border td{
  padding: 5px 10px;
}

.add-form-wrapper >>> .custom-table{
  margin-bottom: 0;
}
.custom-table >>> .custom-table{
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