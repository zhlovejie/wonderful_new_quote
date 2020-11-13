<template>
  <a-modal title="查看信息" v-model="visible" :footer="null" :maskClosable="false">
    <h2 style="text-align:center;">{{detail.title}}</h2>
    <p>{{detail.content}}</p>
    <p style="text-align:right;color:#aaa;">创建时间：{{detail.createdTime || record.createdTime}}</p>
  </a-modal>
</template>
<script>
import { NoticeDetails} from '@/api/humanResources'
export default {
  name:'NoticeView',
  data(){
    return {
      visible:false,
      detail:{},
      record:{}
    }
  },
  methods:{
    query (record) {
      this.visible = true
      this.record = {...(record || {})}
      NoticeDetails({id: record.id}).then(res => this.detail = Object.assign({},res.data))
    }
  }
}
</script>
<style scoped>

</style>