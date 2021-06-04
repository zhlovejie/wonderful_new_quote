<template>
  <div class="material-rule-management-library-normal-baseData-wrapper">
    <!-- 基本资料 -->
    <BaseInnerData ref="baseInnerData" />
    <!-- 基本资料 END-->

    <!-- 图纸数据 -->
    <DrawData ref="drawData" />
    <!-- 图纸数据 END-->

    <!-- 图形数据 -->
    <GraphicData ref="graphicData" />
    <!-- 采购资料 END-->
  </div>
</template>
<script>

import BaseInnerData from './BaseInnerData'
import DrawData from './DrawData'
import GraphicData from './GraphicData'

export default {
  name:"material-rule-management-library-normal-baseData",
  inject: ['normalAddForm'],
  components:{
    BaseInnerData,
    DrawData,
    GraphicData
  },
  data(){
    return {
      refs:['baseInnerData','drawData','graphicData']
    }
  },
  methods:{
    async validate(){
      const that = this
      let commonData = await that.$refs.baseInnerData.validate()
      let graphicData = await that.$refs.graphicData.validate()
      if(commonData && graphicData){
        that.normalAddForm.submitParams.materialDiagram = graphicData
        for(let key in commonData){
          if(commonData.hasOwnProperty(key)){
            that.normalAddForm.submitParams[key] = commonData[key]
          }
        }
        return true
      }
      return false
    },
    fillData(){
      const that = this
      ['baseInnerData','drawData','graphicData'].map(s => {
        let _c = that.$refs[s]
        _c && _c.fillData &&_c.fillData()
      })
    }
  }
}
</script>
<style scoped>

</style>
