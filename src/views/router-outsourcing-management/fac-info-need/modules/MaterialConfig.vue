<template>
  <div class="__fac_info_wrapper__">
    <h2>委外成品物料信息{{material.order}}</h2>
    <a-table
      :columns="columns.material"
      :dataSource="[material]"
      :pagination="false"
      size="small"
    >
    </a-table>

    <h2>选择委外工序</h2>
    <a-table
      size="small"
      :columns="columns.craftBoList"
      :dataSource="craftBoList"
      :pagination="false"
      :rowSelection="{ onChange: craftBoListRowSelectionChangeHnadler, selectedRowKeys: craftBoListSelectedRowKeys }"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
    </a-table>

    <h2>选择委外工艺参数</h2>
    <a-table
      size="small"
      :columns="columns.parameterBoList"
      :dataSource="parameterBoList"
      :pagination="false"
      :rowSelection="{ onChange: parameterBoListRowSelectionChangeHnadler, selectedRowKeys: parameterBoListSelectedRowKeys }"
    >
      <div slot="action" slot-scope="text, record, index">
        <a target="_blank" :href="item.fileUrl" style="margin:0 10px;">预览</a>
        <a-divider type="vertical" />
        <a v-download="item.fileUrl">下载</a>
      </div>
    </a-table>

    <h2>选择所需原料信息</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>原料名称</td>
        <td>原料代码</td>
        <td>规格型号</td>
        <td>单位</td>
        <td>单个加工原料量</td>
        <td>操作</td>
      </tr>
      <tr v-for="(item,idx) in sourceBoList" :key="item.key">
        <td>{{ idx + 1 }}</td>
        <td>{{item.materialName}}</td>
        <td>{{item.materialCode}}</td>
        <td>{{item.specification}}</td>
        <td>{{ item.subUnit }}</td>
        <td>
          <a-input-number
            v-model="item.needCount"
            :min="0"
            :step="1"
            :precision="0"
          />
        </td>
        <td>
          <a href="javascript:void(0);" @click="handleMaterialAction('delete', item)" >删除</a>
        </td>
      </tr>
    </table>
    <a-button 
      style="width: 100%" 
      type="dashed" 
      icon="plus" 
      @click="handleMaterialAction('add', null)" 
    >添加</a-button>
  </div>
</template>

<script>
import {
  getCraftFile,
  listMaterialFormChildDetail,
  
} from '@/api/outsourcingManagement'
import moment from 'moment'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'

const columns = {
  material:[
    {
      align: 'center',
      title: '序号',
      scopedSlots: { customRender: 'order' }
    },
    {
      align: 'center',
      title: '委外加工需求单号',
      dataIndex: 'applyNo'
    },
    {
      align: 'center',
      title: '物料代码',
      dataIndex: 'materialCode'
    },
    {
      align: 'center',
      title: '物料名称',
      dataIndex: 'materialName'
    },
    {
      align: 'center',
      title: '规格型号',
      dataIndex: 'specification'
    },
    {
      align: 'center',
      title: '单位',
      dataIndex: 'subUnit'
    },
    {
      align: 'center',
      title: '关联生产任务单',
      dataIndex: 'productTaskNo'
    },
    {
      align: 'center',
      title: '需求日期',
      dataIndex: 'needDate'
    },
    {
      align: 'center',
      title: '加工数量',
      dataIndex: 'processCount'
    }
  ],
  craftBoList:[
    {
      align: 'center',
      title: '序号',
      scopedSlots: { customRender: 'order' }
    },
    {
      align: 'center',
      title: '工作中心部门',
      dataIndex: 'workshopName'
    },
    {
      align: 'center',
      title: '工序名',
      dataIndex: 'processName'
    },
    {
      align: 'center',
      title: '工序代码',
      dataIndex: 'processCode'
    },
    {
      align: 'center',
      title: '时长(秒)',
      dataIndex: 'duration'
    },
    {
      align: 'center',
      title: '人工费(元)',
      dataIndex: 'personCost'
    }
  ],
  parameterBoList:[
    {
      align: 'center',
      title: '属性',
      dataIndex: 'propertiesDicName'
    },
    {
      align: 'center',
      title: '文件名称',
      dataIndex: 'fileName'
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
}

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
      columns,
      craftBoList: [],
      parameterBoList:[],
      sourceBoList:[],

      craftBoListSelectedRowKeys:[],
      parameterBoListSelectedRowKeys:[]
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
    moment,
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

        that.parameterBoList = __parameterBoList
        
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
            needCount:item.materialNum || 0
          }
        })
      })
    },
    craftBoListRowSelectionChangeHnadler(rows){
      this.craftBoListSelectedRowKeys = rows
    },
    parameterBoListRowSelectionChangeHnadler(rows){
      this.parameterBoListSelectedRowKeys = rows
    },
    handleAction(type, item) {
      const that = this
      let sourceBoList = [...that.sourceBoList]
      if(type === 'add'){
        sourceBoList.push({
          key:that.$uuid(),
          materialId:item.materialId,
          materialCode:item.materialCode,
          materialName:item.materialName,
          specification:item.modelType,
          subUnit:item.materialUnit,
          needCount:item.materialNum || 0
        })
        that.sourceBoList = sourceBoList
      }else if(type === 'delete'){
        that.sourceBoList = sourceBoList.filter(p => p.key !== item.key)
      }
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
