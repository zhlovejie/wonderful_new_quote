<template>
  <a-modal
    title="查看"
    :width="600"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :footer="null"
    v-model="visible">
    <div style="font-size: 14px;">
      <h3 style="width: 100%;text-align: center;font-size: 20px;color: #000;">参数查询</h3>
      <p style="white-space: normal;word-break: break-all;font-family: Consolas;">{{paramContent}}</p>
      <h3 v-show="showFlag" style="width: 100%;text-align: center;font-size: 20px;color: #000;">原始信息</h3>
      <p v-show="showFlag" style="white-space: normal;word-break: break-all;font-family: Consolas;">{{oldContent}}</p>
    </div>
  </a-modal>
</template>
<script>

export default {
  name: 'SysLogVue',
  data () {
    return {
      visible: false,
      paramContent:'',
      oldContent:'',
      showFlag:false,
      confirmLoading: false
    }
  },
  methods: {
    qure (prarm,oldInfo) {
      console.log('SysLogVue JSON: ' + prarm + '--oldInfo:' +oldInfo)
      this.visible = true
      this.paramContent = prarm
      this.oldContent = oldInfo
      if(oldInfo != '' && oldInfo != null){
        this.showFlag = true
      }else{
        this.showFlag = false
      }
    }

  }
}
</script>
