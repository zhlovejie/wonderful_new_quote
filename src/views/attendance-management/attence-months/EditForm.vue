<template>
  <a-modal
    title="处理异常"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <table class="custom-table custom-table-border">
      <tr>
        <th>序号</th>
        <th>状态</th>
        <th>时长</th>
        <th>处理</th>
        <th>输入时长</th>
        <th>原因</th>
        <th>操作</th>
      </tr>
      <tr v-for="(item,idx) in exceptionList" :key="item._key">
        <td >
          {{idx + 1}}
        </td>
        <td>
          {{ {'1':'上班缺卡','2':'下班缺卡','3':'迟到','4':'早退','5':'加班','6':'请假'}[item.type] }}
        </td>
        <td>
          {{item.hours}}
        </td>
        <td>
          <a-radio-group v-if="!item.isDone" :options="plainOptions" :value="item.modifyType" @change="(event) =>{ eleChange('modifyType',item._key,event.target.value) }" />
          <span v-else>{{{'1':'修改时长','2':'标记正常'}[item.modifyType]}}</span>
        </td>
        <td>
          <a-input-number
            style="width:80px;"
            :min="0"
            :step="1"
            :precision="1" 
            :value="item.newHours" 
            v-if="!item.isDone"
            @change="(val) => eleChange('newHours',item._key,val)"
          />
          <span v-else>{{item.newHours}}</span>
        </td>
        <td>
          <a-textarea 
            style="width:150px;" 
            placeholder="出差备注" 
            :rows="1" 
            :value="item.modifyReason" 
            v-if="!item.isDone"
            @change="(event) => eleChange('modifyReason',item._key,event.target.value)" 
          />
          <span v-else>{{item.modifyReason}}</span>
        </td>
        <td>
          <a-button v-if="!item.isDone" type="primary" @click="doAction(item._key)">提交</a-button>
          <span v-else>已处理</span>
        </td>
      </tr>
    </table>
  </a-modal>
</template>

<script>
import {attenceMonthStatiticsChangeAdd } from '@/api/attendanceManagement'

let uuid = () =>Math.random().toString(32).slice(-10)
export default {
  name:'edit-form',
  data(){
    return {
      visible:false,
      plainOptions:[
        { label:'修改时长',value:'1' },
        { label:'标记正常',value:'2' }
      ],
      record:{},
      exceptionList:[]
    }
  },
  methods:{
    query(record){
      let that = this
      that.visible = true
      that.record = record || {}
      that.exceptionList = record.monthExceptionList.map(item => Object.assign({},item,{_key:uuid()}))
    },
    handleOk(){
      this.handleCancel()
    },
    handleCancel(){
      this.visible = false
      this.$emit('finish')
    },
    eleChange(k,key,val){
      console.log(arguments)
      let exceptionList = [...this.exceptionList]
      let target = exceptionList.find(item => item._key === key)
      if(target){
        target[k] = val
        this.exceptionList = exceptionList
      }
    },
    doAction(key){
      let that = this
      let exceptionList = [...that.exceptionList]
      let target = exceptionList.find(item => item._key === key)
      if(target){
        let item = Object.assign({},target)
        item.oldHours = item.hours
        item.serviceType = item.type
        item.statiticsId = item.id

        delete item.hours
        delete item.type
        delete item.id
        attenceMonthStatiticsChangeAdd(item).then(res =>{
          console.log(res)
          that.$message.info(res.msg)
          if(res.code === 200){
            target.isDone = true
            that.exceptionList = exceptionList
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
</style>