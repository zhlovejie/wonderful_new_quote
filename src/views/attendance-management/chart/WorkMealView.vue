<template>
  <a-modal
    title="工作餐详情"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :maskClosable="false"
  >
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
    >
      
      <div slot="customerName" slot-scope="text, record" style="width: 400px;word-break: break-all;">
        {{text}}
      </div>
    </a-table>
  </a-modal>
</template>
<script>
import {getCustomerLunchById} from '@/api/attendanceManagement'

const columns = [
  {
    align: 'center',
    title: '销售',
    dataIndex:'salerUserName',
    width:'120px'
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex:'customerName',
    scopedSlots: { customRender: 'customerName' }
  },{
    align: 'center',
    title: '份数',
    dataIndex:'num',
    width:'80px'
  },
]
export default {
  name:'work-meal-view-form',
  data(){
    return {
      visible:false,
      record:{},
      loading:false,
      columns,
      dataSource:[]
    }
  },
  methods:{
    query(type,record){
      let that = this
      that.record = Object.assign({},record || {})
      that.visible = true
      that.dataSource = []
      that.initWorkMeal()
    },
    initWorkMeal(){
      let that = this
      that.loading = true
      return getCustomerLunchById({orderLunchId:that.record.id }).then(res =>{
        that.loading = false
        that.dataSource = res.data
      }).catch(err =>{
        that.loading = false
        console.log(err)
      })
    },
    handleSubmit(){
      this.handleCancel()
    },
    handleCancel(){
      this.visible = false
    },
  }
}
</script>