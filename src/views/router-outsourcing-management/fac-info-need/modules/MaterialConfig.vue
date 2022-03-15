<template>
  <div class="__fac_info_wrapper__">
    <h2>委外成品物料信息</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>委外加工需求单号</td>
        <td>物料代码</td>
        <td>物料名称</td>
        <td>规格型号</td>
        <td>单位</td>
        <td>关联生产任务单</td>
        <td>需求日期</td>
        <td>加工数量</td>
      </tr>
      <tr >
        <td>{{ material.idx + 1 }}</td>
        <td>{{material.applyNo}}</td>
        <td>{{material.materialCode}}</td>
        <td>{{ material.materialName }}</td>
        <td>{{material.specification}}</td>
        <td>{{ material.subUnit }}</td>
        <td>{{ material.productTaskNo }}</td>
        <td>{{ material.needDate }}</td>
        <td>{{ material.processCount }}</td>
      </tr>
    </table>

    <h2>选择委外工序</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>工作中心部门</td>
        <td>工序名</td>
        <td>工序代码</td>
        <td>时长(秒)</td>
        <td>人工费(元)</td>
        <td>参考工费(元)</td>
      </tr>
      <tr v-for="(item,idx) in craftBoList" :key="item.key">
        <td>{{ idx + 1 }}</td>
        <td>{{item.workshopName}}</td>
        <td>{{item.processName}}</td>
        <td>{{ item.processCode }}</td>
        <td>{{item.duration}}</td>
        <td>{{ item.personCost }}</td>
        <td>{{ item.personCost }}</td>
      </tr>
    </table>

    <h2>选择委外工艺参数</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>属性</td>
        <td>文件名称</td>
        <td>操作</td>
      </tr>
      <tr v-for="(item,idx) in parameterBoList" :key="item.key">
        <td>{{ idx + 1 }}</td>
        <td>{{item.propertiesDicName}}</td>
        <td>{{item.fileName}}</td>
        <td>
          <a target="_blank" :href="item.fileUrl" style="margin:0 10px;">预览</a>
          <a v-download="item.fileUrl">下载</a>
        </td>
      </tr>
    </table>

    <h2>选择所需原料信息</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>原料名称</td>
        <td>原料代码</td>
        <td>规格型号</td>
        <td>单位</td>
        <td>单个加工原料量</td>
        <td>所需原料总量</td>
      </tr>
      <tr v-for="item in sourceBoList" :key="item.key">
        <td>{{ idx + 1 }}</td>
        <td>{{item.materialName}}</td>
        <td>{{item.materialCode}}</td>
        <td>{{item.specification}}</td>
        <td>{{ item.subUnit }}</td>
        <td>{{ item.needCount }}</td>
        <td>{{ item.needCount }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import {
  getCraftFile,
  listMaterialFormChildDetail,
  
} from '@/api/outsourcingManagement'
import moment from 'moment'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'
export default {
  name: 'materialConfig',
  components: {
    MaterialFuzzySearch
  },
  props:{
    material:{
      type:Object,
      default:() => {}
    }
  },
  data() {
    return {
      craftBoList: [],
      parameterBoList:[],
      sourceBoList:[]
    }
  },
  watch:{
    material:{
      handler(val){
        if(val && val.materialId && val.type){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods: {
    init(){
      const that = this
      getCraftFile({
        materialId:that.material.materialId,
        materialType:that.material.type
      }).then(res => {
        let {fileVoList,routeDetailVo} = res.data
        let {picFiles,processes,rangeProcesses} = routeDetailVo
        that.craftBoList = processes.map(item => {
          item.key = that.$uuid()
          return item
        })
        that.parameterBoList = picFiles.map(item => {
          item.key = that.$uuid()
          return item
        })
        console.log(res)
      })

      listMaterialFormChildDetail({
        materialId:that.material.materialId,
        type:that.material.type
      }).then(res => {
        that.sourceBoList = res.data.map(item => {
          return {
            key:that.$uuid(),
            materialId:item.materialId,
            materialCode:item.materialCode,
            materialName:item.materialName,
            specification:item.modelType,
            subUnit:item.materialUnit,
            needCount:item.materialNum
          }
        })
      })
    },
    handleAction(type, item) {
      const that = this
      
    },
    handlerMaterialChange(record, item) {
      const that = this
      let materialBoList = [...that.materialBoList]
      let target = materialBoList.find(m => m.key === item.key)
      if (target) {
        target.materialId = record.materialId
        target.materialName = record.materialName
        target.materialCode = record.materialCode
        target.subUnit = record.materialUnit
        target.specification = record.modelType
        target.type = record.type || 1
        that.materialBoList = materialBoList
      }
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if (that.materialBoList.length > 0) {
          resolve({
            code: 0,
            result: {
              materialBoList: [...that.materialBoList]
            }
          })
        } else {
          that.$message.warning('请添加物料')
          resolve({
            code: 500,
            result: {}
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
.steps-action >>> .ant-btn {
  margin: 0 5px;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
</style>
