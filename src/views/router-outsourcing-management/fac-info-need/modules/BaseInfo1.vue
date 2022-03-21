<template>
  <div class="__fac_info_wrapper__">
    <a-spin :spinning="spinning">
      <h3>委外加工申请人信息</h3>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="申请人" prop="applyUserId">
          <template v-if="canEdit">
            <DepartmentUserCascade 
              allowClear 
              :info.sync="form.applyUser" 
              style="width:100%;" 
              @change="handleDepartmentUserCascadeChange"
            />
          </template>
          <template v-else>
            <span>{{form.applyDepartmentName}}/{{form.applyUserName}}</span>
          </template>
          
        </a-form-model-item>
        <a-form-model-item label="申请原因" prop="reason">
          <a-input v-if="canEdit" v-model="form.reason" />
          <span v-else>{{form.reason}}</span>
        </a-form-model-item>
        <a-form-model-item label="生产车间" prop="workDepartmentId">
          <template v-if="canEdit">
            <DepartmentSelect @change="handleDepartmentSelectChange" :depId="form.workDepartmentId" />
          </template>
          <template v-else>
            <span>{{form.workDepartmentName}}</span>
          </template>
        </a-form-model-item>

        <a-form-model-item label="关联生产任务单">
          <a-select 
            v-if="canEdit"
            style="width: 100%" 
            v-model="form.productTaskId" 
            placeholder="关联生产任务单"
            @change="handleProductTaskChange"
          >
            <a-select-option v-for="item in productTaskList" :key="item.id">{{item.no}}</a-select-option>
          </a-select>
          <span v-else>
            -
          </span>
        </a-form-model-item>
        <a-form-model-item label="需求日期" prop="needDate">
          <a-date-picker v-if="canEdit" v-model="form.needDate" format="YYYY-MM-DD" style="width:100%;" />
          <span v-else>
            {{material.needDate}}
          </span>
        </a-form-model-item>
      </a-form-model>

      <div class="__fac_info_wrapper__item">
      <h3>委外成品物料信息</h3>
      <a-table
        :columns="columns.material"
        :dataSource="[material]"
        :pagination="false"
        size="small"
      >
        <div slot="needDate" slot-scope="text, record, index">
          <span>{{ moment(record.needDate).format('YYYY-MM-DD') }}</span>
        </div>
        <div slot="applyCode" slot-scope="text, record, index">
          <span>{{ form.applyCode }}</span>
        </div>
        
      </a-table>

      <h3>选择委外工序</h3>
      <a-table
        size="small"
        :columns="columns.craftBoList"
        :dataSource="material.craftBoList"
        :pagination="false"
        :rowSelection="canEdit ? { onChange: craftBoListRowSelectionChangeHnadler, selectedRowKeys: craftBoListSelectedRowKeys } : null"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>

      <h3>选择委外工艺参数</h3>
      <a-table
        size="small"
        :columns="columns.parameterBoList"
        :dataSource="material.parameterBoList"
        :pagination="false"
        :rowSelection="canEdit ? { onChange: parameterBoListRowSelectionChangeHnadler, selectedRowKeys: parameterBoListSelectedRowKeys } : null"
      >
        <div slot="action" slot-scope="text, record, index">
          <a target="_blank" :href="record.fileUrl" style="margin:0 10px;">预览</a>
          <a-divider type="vertical" />
          <a v-download="record.fileUrl">下载</a>
        </div>
      </a-table>

      <h3>选择所需原料信息</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td>序号</td>
          <td>原料代码</td>
          <td>原料名称</td>
          <td>规格型号</td>
          <td>单位</td>
          <td>单个加工原料量</td>
          <td>所需原料总量</td>
          <td v-if="canEdit">操作</td>
        </tr>
        <tr v-for="(item,idx) in sourceBoList" :key="item.key">
          <td>{{ idx + 1 }}</td>
          <td>
            <template v-if="item.isNative">
              {{item.materialCode}}
            </template>
            <template v-else>
              <MaterialFuzzySearch :materialInfo="{materialCode:item.materialCode}" v-if="canEdit" style="width:180px;" :materialType="2" @change="record => handlerMaterialChange(record, item)" />
              <span v-else>{{item.materialCode}}</span>
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
              v-if="canEdit"
              v-model="item.needCount"
              :min="0"
              :step="1"
              :precision="0"
            />
            <span v-else>{{item.needCount}}</span>
          </td>
          <td>{{ Number(item.needCount * material.processCount) || 0 }}</td>
          <td v-if="canEdit">
            <a v-if="!item.isNative" href="javascript:void(0);" @click="handleMaterialAction('delete', item)" >删除</a>
          </td>
        </tr>
      </table>
      <a-button 
        v-if="canEdit"
        style="width: 100%" 
        type="dashed" 
        icon="plus" 
        @click="handleMaterialAction('add', null)" 
      >添加</a-button>
    </div>
    </a-spin>
  </div>
</template>

<script>
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import moment from 'moment'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'
import {
  getCraftFile,
  listMaterialFormChildDetail
} from '@/api/outsourcingManagement'
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
      dataIndex: 'applyCode',
      scopedSlots: { customRender: 'applyCode' }
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
  name: 'baseInfo1',
  components: {
    DepartmentUserCascade,
    DepartmentSelect,
    MaterialFuzzySearch
  },
  inject:['addForm'],
  data() {
    return {
      spinning:false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      form: {},
      rules: {
        applyUserId: [{ required: true, message: '请选择申请人', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入申请委外加工具体原因', trigger: 'blur' }],
        workDepartmentId: [{ required: true, message: '请选择生产车间', trigger: 'change' }],
        needDate: [{ required: true, message: '请选择需求日期', trigger: 'change' }]
      },
      productTaskList:[
        {
          id:1,
          no:'rwd-001'
        },
        {
          id:2,
          no:'rwd-002'
        }
      ],
      
      columns,
      craftBoListSelectedRowKeys:[],
      craftBoListSelectedRows:[],
      parameterBoListSelectedRowKeys:[],
      parameterBoListSelectedRows:[],
      sourceBoList:[],

      material:{}
    }
  },
  computed:{
    canEdit(){
      return this.addForm.isAdd || this.addForm.isEdit
    }
  },
  async mounted(){
    const that = this
    let detail = that.$_.cloneDeep(that.addForm.detail || {}) 
    let needDate = that.moment(detail.materialVo.needDate)
    that.form = {
      ...detail,
      applyUser:{
        userId:detail.applyUserId,
        userName:detail.applyUserName,
        depId:detail.applyDepartmentId,
        depName:detail.applyDepartmentName
      },
      needDate
    }
    that.spinning = true
    that.material = await that.fetchMaterialInfo(detail.materialVo)
    that.spinning = false
    that.sourceBoList = that.material.sourceVoList
  },
  methods: {
    moment,
    handleDepartmentUserCascadeChange(applyUser){
      this.form = {
        ...this.form,
        applyUserId:applyUser.userId,
        applyUserName:applyUser.userName,
        applyDepartmentId:applyUser.depId,
        applyDepartmentName:applyUser.depName
      }
    },
    handleDepartmentSelectChange(item) {
      this.form = {
        ...this.form,
        workDepartmentId: item.id,
        workDepartmentName: item.departmentName
      }
    },
    handleProductTaskChange(id){
      let target = this.productTaskList.find(item => item.id === id)
      this.form = {
        ...this.form,
        productTaskId: id,
        productTaskNo: target.no
      }
    },
    async validate() {
      const that = this

      let result = await new Promise(resolve => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              code: 0,
              result: {
                ...that.form
              }
            })
          } else {
            resolve({
              code: 500,
              result: {}
            })
          }
        })
      })
      let result_materialInfo = await that.validate_material()

      if(result.code === 0 && result_materialInfo.code === 0){
        return {
          code:0,
          result:{
            ...result.result,
            materialBo:result_materialInfo.result
          }
        }
      }else{
        return {
          code:500,
          result:{}
        }
      }
    },
    craftBoListRowSelectionChangeHnadler(selectedRowKeys, selectedRows){
      this.craftBoListSelectedRowKeys = selectedRowKeys
      this.craftBoListSelectedRows = selectedRows
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
    validate_material() {
      const that = this
      return new Promise(resolve => {
        if (that.validate_self()) {
          resolve({
            code: 0,
            result: {
              ...that.material,
              craftBoList: [...that.craftBoListSelectedRows],
              parameterBoList:[...that.parameterBoListSelectedRows],
              sourceBoList:[...that.sourceBoList],
            }
          })
        } else {
          resolve({code: 500,result: {} })
        }
      })
    },
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
</style>
