<template>
  <div class="__fac_info_wrapper__">
    <h2>委外成品物料信息{{material.order}}</h2>
    <a-table
      :columns="columns.material"
      :dataSource="[material]"
      :pagination="false"
      size="small"
    >
      <div slot="needDate" slot-scope="text, record, index">
        <span>{{ moment(record.needDate).format('YYYY-MM-DD') }}</span>
      </div>
    
    </a-table>

    <h2>选择委外工序</h2>
    <a-table
      size="small"
      :columns="columns.craftBoList"
      :dataSource="material.craftBoList"
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
      :dataSource="material.parameterBoList"
      :pagination="false"
      :rowSelection="{ onChange: parameterBoListRowSelectionChangeHnadler, selectedRowKeys: parameterBoListSelectedRowKeys }"
    >
      <div slot="action" slot-scope="text, record, index">
        <a target="_blank" :href="record.fileUrl" style="margin:0 10px;">预览</a>
        <a-divider type="vertical" />
        <a v-download="record.fileUrl">下载</a>
      </div>
    </a-table>

    <h2>选择所需原料信息</h2>
    <table class="custom-table custom-table-border">
      <tr>
        <td>序号</td>
        <td>原料代码</td>
        <td>原料名称</td>
        <td>规格型号</td>
        <td>单位</td>
        <td>单个加工原料量</td>
        <td>所需原料总量</td>
        <td>操作</td>
      </tr>
      <tr v-for="(item,idx) in material.sourceBoList" :key="item.key">
        <td>{{ idx + 1 }}</td>
        <td>
          <template v-if="item.isNative">
            {{item.materialCode}}
          </template>
          <template v-else>
            <MaterialFuzzySearch style="width:180px;" :materialType="2" @change="record => handlerMaterialChange(record, item)" />
          </template>
        </td>
        <td>{{item.materialName}}</td>
        <td>
          <a-popover title="规格型号" v-if="item.specification">
              <template slot="content">
                <p style="width:350px;">{{ item.specification }}</p>
              </template>
              <a-button size="small">
                查看
              </a-button>
            </a-popover>
        </td>
        <td>{{ item.subUnit }}</td>
        <td>
          <a-input-number
            v-model="item.needCount"
            :min="0"
            :step="1"
            :precision="0"
          />
        </td>
        <td>{{ Number(item.needCount * material.processCount) || 0 }}</td>
        <td>
          <a v-if="!item.isNative" href="javascript:void(0);" @click="handleMaterialAction('delete', item)" >删除</a>
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
      dataIndex: 'needDate',
      scopedSlots: { customRender: 'needDate' }
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
      craftBoListSelectedRowKeys:[],
      craftBoListSelectedRows:[],
      parameterBoListSelectedRowKeys:[],
      parameterBoListSelectedRows:[]
    }
  },
  watch:{
    sourceBoList:{
      handler(value){
        this.$emit('change',{
          ...this.material,
          sourceBoList:[...value]
        })
      },
      deep:true,
      immediate:true
    }
  },
  methods: {
    moment,
    craftBoListRowSelectionChangeHnadler(selectedRowKeys, selectedRows){
      this.craftBoListSelectedRowKeys = selectedRowKeys
      this.craftBoListSelectedRows = selectedRows

      let craftBoList = this.material.craftBoList
      
    },
    parameterBoListRowSelectionChangeHnadler(selectedRowKeys, selectedRows){
      this.parameterBoListSelectedRowKeys = selectedRowKeys
      this.parameterBoListSelectedRows = selectedRows

      
    },
    handleMaterialAction(type, item) {
      const that = this
      let sourceBoList = [...that.sourceBoList]
      if(type === 'add'){
        sourceBoList.push({
          key:that.$uuid(),
          materialId:'',
          materialCode:'',
          materialName:'',
          specification:'',
          subUnit:'',
          needCount:0,
          isNative:false
        })
        that.sourceBoList = sourceBoList
      }else if(type === 'delete'){
        that.sourceBoList = sourceBoList.filter(p => p.key !== item.key)
      }

      that.$emit('change',{
        ...that.material,
        sourceBoList:[...that.sourceBoList]
      })
    },
    handlerMaterialChange(record, item) {
      const that = this
      let sourceBoList = [...that.sourceBoList]
      let target = sourceBoList.find(m => m.key === item.key)
      if (target) {
        target.materialId = record.materialId
        target.materialName = record.materialName
        target.materialCode = record.materialCode
        target.subUnit = record.materialUnit
        target.specification = record.modelType
        target.type = record.type || 1
        that.sourceBoList = sourceBoList
        that.$emit('change',{
          ...that.material,
          sourceBoList:[...that.sourceBoList]
        })
      }
    },
    validate_self(){
      const that = this
      if(that.craftBoListSelectedRows.length === 0){
        that.$message.info('请选择委外工序')
        return false
      }
      if(that.parameterBoListSelectedRows.length === 0){
        that.$message.info('请选择委外工艺参数')
        return false
      }

      for(let i=0,len = that.sourceBoList.length;i<len;i++){
        let item = that.sourceBoList[i]
        if(!item.materialCode){
          that.$message.info('请选择原料代码')
          return false
        }
        if(!item.needCount){
          that.$message.info('请输入单个加工原料量')
          return false
        }
      }
      return true
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        if (that.validate_self()) {
          resolve({
            code: 0,
            result: {
              craftBoList: [...that.craftBoListSelectedRows],
              parameterBoList:[...that.parameterBoListSelectedRows],
              sourceBoList:[...that.sourceBoList],
            }
          })
        } else {
          resolve({code: 500,result: {} })
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
