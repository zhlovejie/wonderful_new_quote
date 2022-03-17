<template>
  <div class="__fac_info_wrapper__">
    <a-spin :spinning="spinning">
      <div v-for="(item,idx) in materialBoList">
        <MaterialConfig :material.sync="materialBoList[idx]" @change="(val) => handleMaterialChange(val,item)" />
        <div>
          {{ JSON.stringify(materialBoList[idx],null,2) }}
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import {
  getCraftFile,
  listMaterialFormChildDetail
} from '@/api/outsourcingManagement'
import MaterialConfig from './MaterialConfig'
export default {
  name: 'bussessInfo',
  components: {MaterialConfig},
  props:['detail','fill','disabled'],
  data() {
    return {
      materialBoList:[],
      spinning:false
    }
  },
  async activated(){
    const that = this
    if(this.fill){
      try{
        let {materialBoList} = this.detail
        let _materialBoList = []
        let _count = -1
        that.spinning = true
        for(let item of materialBoList){
          let _newItem = await that.fetchMaterialInfo(item)
          _count ++
          _newItem.idx = _count
          _materialBoList.push(_newItem)
        }
        that.spinning = false
        that.materialBoList = _materialBoList
      }catch(err){
        console.error(err)
      }
    }
  },
  methods: {
    async fetchMaterialInfo(record){
      const that = this

      let result = await Promise.all([
        getCraftFile({
          materialId:record.materialId,
          materialType:record.type
        }).then(res => {
          let {fileVoList,routeDetailVo} = res.data
          let {picFiles,processes,rangeProcesses} = routeDetailVo
          let craftBoList = processes.map(item => {
            item.key = that.$uuid()
            return item
          })
  
          let __parameterBoList = []
          fileVoList.map(item => {
            if(Array.isArray(item.fileList)){
              item.fileList.map(file => {
                __parameterBoList.push({
                  ...item,
                  ...file
                })
              })
            }
          })
          return {
            parameterBoList:__parameterBoList,
            craftBoList:craftBoList
          }
        }).catch(err => {
          console.error(err)
          return {
            parameterBoList:[],
            craftBoList:[]
          }
        }),
        listMaterialFormChildDetail({
          materialId:record.materialId,
          type:record.type
        }).then(res => {
          return {
            sourceBoList:res.data.map(item => {
              return {
                key:that.$uuid(),
                materialId:item.materialId,
                materialCode:item.materialCode,
                materialName:item.materialName,
                specification:item.modelType,
                subUnit:item.materialUnit,
                needCount:item.materialNum || 0,
                isNative:true
              }
            })
          }
        }).catch(err => {
          console.error(err)
          return {sourceBoList:[]}
        })
      ])
      let obj = {}
      result.map(item => {
        obj = {...obj,...item}
      })
      return {...record,...obj}
    },


    handleMaterialChange(val,item){
      // const that = this
      // let materialBoList = [...that.materialBoList]

      // let idx = materialBoList.findIndex(p => p.key === item.key)
      // if(idx >= 0){
      //   materialBoList.splice(idx,1,{...val})
      //   that.materialBoList = materialBoList
      // }
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if(that.materialBoList.length === 0){
          that.$message.warning('请完善物料信息')
          resolve({code:500,result:{} })
          return
        }
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              code:0,
              result:{...that.materialBoList}
            })
          } else {
            resolve({
              code:500,
              result:{}
            })
          }
        });
      })
    }
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}

.__bussess_wrapper {
  position: relative;
  border: 2px dashed #1890ff;
  padding: 5px;
  margin-bottom: 20px;
}
.__bussess_wrapper .__item_action_del {
  position: absolute;
  top: -18px;
  right: -12px;
  z-index: 10001;
  font-size: 24px;
  color: #1890ff;
  background-color: #fff;
  cursor: pointer;
}
</style>
