<template>
  <a-modal title="查看公告/通知" v-model="visible" :footer="null" :maskClosable="false">
    <a-spin :spinning="spinning">
    <h2 style="text-align:center;">{{detail.title}}</h2>
    <p>{{detail.content}}</p>
    <p style="text-align:right;color:#aaa;">创建时间：{{detail.createdTime || record.createdTime}}</p>
    </a-spin>
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
      record:{},
      spinning:false
    }
  },
  methods:{
    query (record) {
      this.visible = true
      this.record = {...(record || {})}
      this.$nextTick(() =>{
        this.detail = {}
        this.fetchData()
      })
    },
    fetchData(){
      let that = this
      that.spinning = true
      NoticeDetails({id: that.record.id}).then(res => {
        that.spinning = false
        that.detail = Object.assign({},res.data)
      }).catch(err =>{
        that.spinning = false
        that.visible = false
        that.$message.error(`错误信息：${err.message}，请联系管理员`)
      })
    }
  }
}
</script>
<style scoped>

</style>