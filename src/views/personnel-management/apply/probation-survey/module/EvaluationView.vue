<template>
  <a-modal 
    title="试用期考评" 
    v-model="visible" 
    @cancel="handleCancel"
    :footer="null" 
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
    <table class="custom-table custom-table-border">
      <tr>
        <td>考评人</td>
        <td>{{dataSource.userName}} ({{dataSource.departmentName}} - {{dataSource.stationName}})</td>
      </tr>
      <tr>
        <td>提交时间</td>
        <td>{{dataSource.evaluationTime || ''}}</td>
      </tr>
      <tr>
        <td>评语</td>
        <td>{{dataSource.comment || '' }}</td>
      </tr>
      <tr>
        <td>结果</td>
        <td>{{parseInt(dataSource.result,10) === 1 ? '通过' : '不通过'}}</td>
      </tr>
    </table>
    </a-spin>
  </a-modal>
</template>
<script>
import { getProbationEvaluationByProbationSurveyId } from '@/api/personnelManagement'
export default {
  name:'EvaluationView',
  data(){
    return {
      visible:false,
      spinning:false,
      dataSource:{}
    }
  },
  mounted(){
    
  },
  methods:{
    query (record) {
      this.visible = true
      getProbationEvaluationByProbationSurveyId({probationSurveyId: record.id})
      .then(res => {
        console.log(res)
        this.dataSource = res.data
      })
      .catch(error => {
        console.error(error)
      })
    },
    handleCancel(){
      this.dataSource = {}
      this.$nextTick(() =>this.visible = false)
    }
  }
}
</script>
<style scoped>

</style>