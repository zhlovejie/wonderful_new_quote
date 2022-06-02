<template>
  <div>
    <a-modal :title="modalTitle" :visible="visible" :footer="null" :width="1400" @cancel="handleCancel">
      <a-spin :spinning="spinning">
        <a-row v-if="isView && showCopy">
          <a-col :span="22"></a-col>
          <a-col :span="2">
            <a-button type="primary" @click="handlerCopy">复制检验标准</a-button>
          </a-col>
        </a-row>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <h3>物料基本信息</h3>
          <a-row>
            <a-col :span="16">
              <a-form-model-item prop="materialCode" label="物料编码">
                <a-select
                  v-if="isCopy && !isDisabled"
                  show-search
                  :value="record.materialCode"
                  placeholder="模糊搜索"
                  style="width: 100%"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                  @search="w => materialFuzzyAction(w, false)"
                  @change="materialFuzzyHandleChange"
                >
                  <a-spin v-if="materialFuzzySearch.fetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="item in materialFuzzySearch.list"
                    :key="item.__key"
                    :value="item.materialCodeFormat"
                  >
                    {{ item.materialCodeFormat }}
                  </a-select-option>
                </a-select>
                <span v-else>{{ record.materialCode }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="16">
              <!-- <p>物料名称：{{record.materialName}}</p> -->
              <a-form-model-item prop="materialCode" label="物料名称">
                {{ record.materialName }}
              </a-form-model-item>
            </a-col>
            <a-col :span="16">
              <!-- <p>规格型号：{{record.specification}}</p> -->
              <a-form-model-item prop="materialCode" label="规格型号">
                {{ record.specification }}
              </a-form-model-item>
            </a-col>
            <a-col :span="16">
              <!-- <p>物料来源：{{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[record.materialSource] }}</p> -->
              <a-form-model-item prop="materialCode" label="物料来源">
                {{ { 1: '自制', 2: '通用外购', 3: '委外加工', 4: '定制外购' }[record.materialSource] }}
              </a-form-model-item>
            </a-col>
          </a-row>

          <h3>检验标准明细</h3>
          <a-row>
            <a-col :span="16">
              <a-form-model-item label="检验类别" prop="inspectionStatus">
                <a-select :disabled="isDisabled" v-model="form.inspectionStatus" placeholder="检验类别">
                  <a-select-option :value="1">
                    来料检验
                  </a-select-option>
                  <a-select-option :value="2">
                    半成品检验
                  </a-select-option>
                  <a-select-option :value="3">
                    成品检验
                  </a-select-option>
                  <a-select-option :value="4">
                    退换货检验
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="16">
              <a-form-model-item label="是否检验" prop="inspectionType">
                <a-radio-group
                  :disabled="isDisabled"
                  v-model="form.inspectionType"
                  @change="handleInspectionTypeChange"
                >
                  <a-radio :value="1">
                    检验
                  </a-radio>
                  <a-radio :value="2">
                    免检
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>

            <a-col :span="16">
              <a-form-model-item
                label="检验方案"
                prop="inspectionSchemeId"
                :rules="{
                  required: +form.inspectionType === 1,
                  message: '请选择检验方案',
                  trigger: 'change'
                }"
              >
                <a-select
                  v-model="form.inspectionSchemeId"
                  placeholder="检验方案"
                  @change="handlerInspectionSchemeChange"
                  :disabled="isDisabled"
                >
                  <a-select-option v-for="item in inspectionSchemeList" :key="item.id">
                    {{ item.inspectionScheme }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <table class="custom-table custom-table-border">
            <thead>
              <tr>
                <th>检验项目</th>
                <th>检验要点标注</th>
                <th>检验工具</th>
                <th>检验方法</th>
                <th>检验频次</th>
                <th>附件/图纸/视频</th>
                <th>检验依据</th>
                <th>AQL值</th>
                <th>检验等级</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in checkInspectionStandardDetails" :key="item.key">
                <td>{{ item.projectName }}</td>
                <td>
                  <a-textarea
                    placeholder="检验要点标注"
                    style="width: 100%;"
                    allow-clear
                    autoSize
                    v-model="item.mainPoint"
                    :disabled="isDisabled"
                  />
                </td>
                <td>
                  <a-select
                    style="width: 100%;"
                    v-model="item.toolId"
                    :disabled="isDisabled"
                    @change="val => handlerSelectName(val, 'tool', item)"
                  >
                    <a-select-option v-for="item in toolList" :key="item.id">
                      {{ item.termName }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-select
                    style="width: 100%;"
                    v-model="item.methodId"
                    :disabled="isDisabled"
                    @change="val => handlerSelectName(val, 'method', item)"
                  >
                    <a-select-option v-for="item in methodList" :key="item.id">
                      {{ item.termName }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-select
                    style="width: 100%;"
                    v-model="item.frequencyId"
                    :disabled="isDisabled"
                    @change="val => handlerSelectName(val, 'frequency', item)"
                  >
                    <a-select-option v-for="item in frequencyList" :key="item.id">
                      {{ item.termName }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a @click="handlerUpload(item)" href="javascript:void(0);">{{ isDisabled ? '查看' : '上传' }}</a>
                </td>

                <td>{{ item.inspectionBasisName }}</td>
                <td>{{ item.parameterTermAqlName }}</td>
                <td>{{ { 0: '正常', 1: '加严', 2: '放宽' }[item.inspectionGrade] }}</td>
              </tr>
            </tbody>
          </table>

          <a-row>
            <a-col :span="16">
              <a-form-model-item
                prop="purchaseTestStandard"
                label="采购检验标准"
                :rules="{
                  required: true,
                  message: '请输入采购检验标准',
                  trigger: 'blur'
                }"
              >
                <a-textarea
                  :disabled="isDisabled"
                  placeholder="采购检验标准"
                  :rows="3"
                  v-model="form.purchaseTestStandard"
                />
              </a-form-model-item>
            </a-col>
          </a-row>

          <p style="text-align:center;">
            <template v-if="isAdd || isEdit">
              <a-button @click="handleCancel">取消</a-button>
              <a-button type="primary" @click="() => handleOk(0)" style="margin:0 10px;">保存为草稿</a-button>
              <a-button type="primary" @click="() => handleOk(1)">保持并提交审核</a-button>
            </template>

            <template v-if="isApproval">
              <a-button type="primary" @click="passAction">通过</a-button>
              <a-button @click="noPassAction" style="margin:0 10px;">不通过</a-button>
            </template>

            <template v-if="isView">
              <a-button type="primary" @click="handleCancel">关闭</a-button>
            </template>
          </p>
        </a-form-model>
      </a-spin>
    </a-modal>
    <UploadModel ref="uploadModel" @change="uploadModelChange" />
    <Approval ref="approval" @opinionChange="opinionChange" />
  </div>
</template>
<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList ,productMaterialInfoPageList} from '@/api/routineMaterial'

import {
  checkParameterTermList,
  checkInspectionSchemeSetList,
  checkInspectionSchemeSetDetail,

  checkInspectionStandardSetApproval,
  checkInspectionStandardSetDelete,
  checkInspectionStandardSetDetail,
  checkInspectionStandardSetRevocation,
  checkInspectionStandardSetAddOrUpdate
} from '@/api/qualityManagement'

import UploadModel from './UploadModel'
import Approval from './Approval'


export default {
  components:{
    UploadModel,
    Approval
  },
  props:{
    showCopy:{
      type:Boolean,
      default:() => true
    }
  },
  data() {
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction, 800)
    return {
      visible:false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {},
      rules: {
        inspectionStatus: [
          { required: true, message: '请选择检验类别', trigger: 'change' },
        ],
        inspectionType: [
          { required: true, message: '请选择是否检验', trigger: 'change' },
        ],
        // inspectionSchemeId: [
        //   { required: true, message: '请选择检验方案', trigger: 'change' },
        // ]
      },
      type:'add',
      record:{},

      inspectionSchemeList:[], //方案
      checkInspectionStandardDetails:[], //标准
      toolList:[],// 检验工具
      methodList:[],// 检验方法
      frequencyList:[], // 检验频次

      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      isCopy:false,
      spinning:false
    }
  },
  computed:{
    modalTitle(){
      let m = {
        'add':'制定',
        'edit':'制定',
        'view':'查看',
        'approval':'审批'
      }
      return `${m[this.type]}标准`
    },
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isView(){
      return this.type === 'view'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  methods: {
    handlerUpload(item){
      this.$refs.uploadModel.query(this.type,item,{
        file:item.annexUrl,
        image:item.bluepUrl,
        video:item.videoUrl
      })
    },
    uploadModelChange(record,{file,image,video}){
      const that = this
      let checkInspectionStandardDetails = [...that.checkInspectionStandardDetails]
      let target = checkInspectionStandardDetails.find(item => item.key === record.key)
      if(target){
        target.annexUrl = file
        target.bluepUrl = image
        target.videoUrl = video
        that.checkInspectionStandardDetails = checkInspectionStandardDetails
      }
    },

    fetchInspectionSchemeList(){
      const that = this
      return checkInspectionSchemeSetList().then(res => {
        that.inspectionSchemeList = res.data
      })
    },
    async query(type,record){
      const that = this
      that.type = type
      that.record = record
      that.visible = true
      that.isCopy = false
      that.checkInspectionStandardDetails = []
      that.form = {
        materialId:that.record.materialId
      }

      try{
        that.spinning = true
        await Promise.all([
          that.fetchInspectionSchemeList(),
          that.fetchParameterTermList('检验工具','toolList'),
          that.fetchParameterTermList('检验方法','methodList'),
          that.fetchParameterTermList('检验频次','frequencyList')
        ])
        that.spinning = false
      }catch(err){
        that.spinning = false
        that.$message.error(err.message)
      }

      if(that.isAdd){

      }else{
        that.spinning = true
        checkInspectionStandardSetDetail({id:record.id}).then(res => {
          that.spinning = false
          that.form = {
            ...that.form,
            ...res.data
          }

          that.checkInspectionStandardDetails = res.data.checkInspectionStandardDetailDetailVos.map(item => {
            item.key = that._uuid()
            return item
          })

        }).catch(err => {
          that.spinning = false
          that.$message.error(err.message)
        })
      }
    },
    validate(){
      const that = this
      let checkInspectionStandardDetails = [...that.checkInspectionStandardDetails]
      for(let i=0;i<checkInspectionStandardDetails.length;i++){
        let {mainPoint,toolId,methodId,frequencyId} = checkInspectionStandardDetails[i]
        // if(!mainPoint){
        //   that.$message.info('请完善检验要点标注信息')
        //   return false
        // }
        if(!toolId){
          that.$message.info('请选择检验工具')
          return false
        }
        if(!methodId){
          that.$message.info('请选择检验方法')
          return false
        }
        if(!frequencyId){
          that.$message.info('请选择检验频次')
          return false
        }
      }
      return true
    },
    handleOk(statusType) {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(!that.validate()){
            return
          }
          checkInspectionStandardSetAddOrUpdate({
            ...that.form,
            checkInspectionStandardDetails:that.checkInspectionStandardDetails,
            status:statusType
          }).then(res => {
            if(res.code === 200){
              that.$emit('ok')
              that.visible = false
            }
            that.$message.info(res.msg)
          }).catch(err => {
            that.$message.error(err.message)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleCancel(){
      this.visible = false
    },
    async fetchParameterTermList(termName,fieldName) {
      const that = this
      const id = await checkParameterTermList({ termName })
        .then(res => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data[0].id : null
        })
        .catch(err => {
          return null
        })

      const list = await checkParameterTermList({ parentId: id })
        .then(res => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data : []
        })
        .catch(err => {
          return []
        })
      that.[fieldName] = list
    },
    handlerInspectionSchemeChange(val){
      const that = this
      if(!val){
        that.form = {
          ...that.form,
          inspectionSchemeId:undefined,
          inspectionScheme:undefined
        }
        that.checkInspectionStandardDetails = []
        return
      }
      checkInspectionSchemeSetDetail({ id: val }).then(res => {
        let {id,inspectionScheme,checkInspectionSchemeSetProjectDetailVos} = res.data
        that.form = {
          ...this.form,
          inspectionSchemeId:id,
          inspectionScheme:inspectionScheme
        }
        that.checkInspectionStandardDetails = checkInspectionSchemeSetProjectDetailVos.map(item => {
          return {
            key: that._uuid(),
            inspectionBasisId:item.inspectionBasisId,
            inspectionBasisName:item.inspectionBasisName,
            inspectionGrade:item.inspectionGrade,
            parameterTermAqlId:item.parameterTermAqlId,
            parameterTermAqlName:item.parameterTermAqlName,
            projectId:item.parameterTermId,
            projectName:item.parameterTermName
          }
        })
      })
    },
    handlerCopy(){
      this.type = 'add'
      this.isCopy = true
      this.form = {
        ...this.form,
        id:undefined
      }
    },

    submitAction(opt = {}) {
      const that = this

      const values = Object.assign({}, opt, { ...that.approvalForm }, { approveId: that.record.id })
      that.spinning = true
      checkInspectionStandardSetApproval(values)
        .then(res => {
          that.spinning = false
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('ok')
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    },

    async materialFuzzyAction(wd,isFilter=false) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 20,
        materialCode: wd
      }
      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      // productMaterialInfoPageList

      let res = await Promise.all(
        [
          routineMaterialInfoPageList(_searchParam).then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          }),
          productMaterialInfoPageList(_searchParam).then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          })
        ]
      )
      let result = []
      if(isFilter){
        //显示 常规和成品的 自制和委外件，
        result = [...res[0],...res[1]].filter(item => [1,3].includes(+item.materialSource))
      }else{
        //显示 常规件 ，不过滤
        result = [...res[0]]
      }
      console.log(result)
      result = result.map((item, index) => {
          item.__key = that._uuid()
          item.__value = item.materialName
          item.materialCodeFormat = that.formatMaterialCode(item.materialCode,".")
          item.__label = `${item.materialName}(${item.materialCodeFormat})`
          item.specifications = item.specification || `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
          return item
        })

      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: result }
    },
    materialFuzzyHandleChange(key) {
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.materialCodeFormat === key)
      that.form = {
        ...that.form,
        materialId: target.id,
      }

      that.record = {
        materialId:target.id,
        materialCode:target.materialCodeFormat,
        materialName:target.materialName,
        specification:target.specifications,
        materialSource:target.materialSource
      }

      that.materialFuzzySearch = { ...that.materialFuzzySearch, item: target }
    },
    formatMaterialCode(codeStr,joinSymbol=""){
      if(typeof codeStr !== 'string'){
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,trimRight = /[0]*$/g;
      return codeStr.split('.').map(s => s.replace(trimLeft,'')).join(joinSymbol)
    },
    handlerSelectName(val,key,record){
      const that = this
      let checkInspectionStandardDetails = [...that.checkInspectionStandardDetails]
      let target = checkInspectionStandardDetails.find(item => item.key === record.key)
      let list = that[`${key}List`]
      let keyName = `${key}Name`
      let item = list.find(item => item.id === val)
      target[keyName] = item.termName
      that.checkInspectionStandardDetails = checkInspectionStandardDetails
    },
    handleInspectionTypeChange(val){
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField(['inspectionSchemeId'])
      })
    }
  },
};
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 2px;
}
</style>
