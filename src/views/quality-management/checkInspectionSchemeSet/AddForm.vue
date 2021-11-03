<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1400"
  >
    <a-spin :spinning="spinning">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row >
        <a-col :span="24">
          <a-form-model-item
            label="检验方案"
            :label-col="{span:2}"
            :wrapper-col="{span:22}"
            prop="inspectionScheme"
          >
            <a-input
              v-if="!isDisabled"
              allow-clear
              v-model="form.inspectionScheme"
              placeholder="检验方案"
            />
            <span v-else>{{form.inspectionScheme}}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="24">
          <a-form-model-item
            label="备注信息"
            :label-col="{span:2}"
            :wrapper-col="{span:22}"
            prop="remarks"
          >
            <a-textarea
              v-if="!isDisabled"
              placeholder="备注"
              style="width: 100%"
              allow-clear
              autoSize
              v-model="form.remarks"
            />
            <span v-else>{{form.remarks}}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <table class="custom-table custom-table-border">
      <thead>
        <tr>
          <th rowspan="2">项目顺序</th>
          <th colspan="2">检验项目信息</th>
          <th colspan="3">检验标准参数</th>
          <th rowspan="2">备注</th>
          <th rowspan="2" v-if="!isDisabled">操作</th>
        </tr>

        <tr>
          <th>检验项目名称</th>
          <th>项目备注</th>
          <th>检验依据</th>
          <th>AQL值</th>
          <th>检验等级</th>
        </tr>
      </thead>
      <tbody>


        <tr
          v-for="(item,idx) in checkInspectionSchemeSetProjects"
          :key="item.key"
        >
          <td>{{idx + 1}}</td>
          <td>
            <a-select
              v-if="!isDisabled"
              style="width:200px;"
              :value="item.parameterTermId"
              @change="(val) => handlerToolsSelect(val,item.key)"
            >
              <a-select-option
                v-for="item in parameterTermList"
                :key="item.id"
              >
                {{item.termName}}
              </a-select-option>
            </a-select>
            <span v-else>{{item.parameterTermName}}</span>

          </td>
          <td>{{item.parameterTermRemarks}}</td>
          <td>
            <a-select
              v-if="!isDisabled"
              style="width:200px;"
              v-model="item.inspectionBasisId"
              @change="(val) => handlerInspectionBasisChange(val,item.key)"
            >
              <a-select-option
                v-for="_base in inspectionBasisList"
                :key="_base.id"
                :value="_base.id"
              >
                {{_base.inspectionBasis}}
              </a-select-option>
            </a-select>
            <span v-else>{{item.inspectionBasisName}}</span>
          </td>
          <td>
            <a-select
              v-if="!isDisabled"
              style="width:150px;"
              v-model="item.parameterTermAqlId"
              @change="(val) => handlerAQLChange(val,item.key)"
            >
              <a-select-option
                v-for="_base in item.aqlList"
                :key="_base.id"
                :value="_base.id"
              >
                {{_base.text}}
              </a-select-option>
            </a-select>
            <span v-else>{{item.parameterTermAqlName}}</span>
          </td>
          <td>
            {{ {0:'正常',1:'加严',2:'放宽'}[item.inspectionGrade] }}
          </td>
          <td>
            <a-textarea
              v-if="!isDisabled"
              placeholder="备注"
              style="width: 100%"
              allow-clear
              autoSize
              v-model="item.remarks"
            />
            <span v-else>{{item.remarks}}</span>
          </td>
          <td v-if="!isDisabled">
            <a href="javascript:void(0);" @click="doAction('del',item)">删除</a>
          </td>
        </tr>
      </tbody>
    </table>
    <a-button
      v-if="!isDisabled"
      style="width: 100%"
      type="dashed"
      icon="plus"
      @click="doAction('add',null)"
    >新增行</a-button>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  checkInspectionBasisDetail,
  checkInspectionBasisList,
  checkParameterTermList,
  checkInspectionSchemeSetDetail,
  checkInspectionSchemeSetAddOrUpdate
} from '@/api/qualityManagement'
import { getDictionary } from '@/api/common'
import ToolsSingleSelect from '../checkToolAuthentication/ToolsSingleSelect'
export default {
  components: {
    ToolsSingleSelect
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {},
      checkInspectionSchemeSetProjects: [],
      aqlDataSource: [],
      inspectionBasisList: [],
      rules: {
        inspectionScheme: [{ required: true, message: '请输入检验方案', trigger: 'blur' }]
      },
      type: 'add',
      parameterTermList: [],
      spinning:false
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : this.isEdit ? '编辑' : '查看'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isDisabled() {
      return this.isView
    }
  },
  created() {},
  methods: {
    doAction(type, record) {
      const that = this
      let checkInspectionSchemeSetProjects = [...that.checkInspectionSchemeSetProjects]
      if (type === 'add') {
        checkInspectionSchemeSetProjects.push({
          key: that._uuid(),
          parameterTermId: undefined,
          parameterTermName: undefined,
          parameterTermRemarks: undefined,

          inspectionBasisId: undefined,
          inspectionBasisName: undefined,

          parameterTermAqlId: undefined,
          parameterTermAqlName: undefined,

          inspectionGrade: undefined,

          remarks: undefined,

          schemeSetId: undefined,
          aqlList: []
        })
        that.checkInspectionSchemeSetProjects = checkInspectionSchemeSetProjects
      } else if (type === 'del') {
        that.checkInspectionSchemeSetProjects = checkInspectionSchemeSetProjects.filter(item => item.key !== record.key)
      }
    },
    fetchAQL() {
      const that = this
      return getDictionary({ text: 'AQL值' }).then(res => {
        that.aqlDataSource = res.data
      })
    },
    fetchInspectionBasis() {
      const that = this
      return checkInspectionBasisList().then(res => {
        that.inspectionBasisList = res.data
      })
    },
    fetchAQLList(id) {
      return checkInspectionBasisDetail({ id }).then(res => {
        const { id, inspectionBasis, inspectionGrade, remarks, checkInspectionBasisAqlDeatilVos } = res.data || {
          checkInspectionBasisAqlDeatilVos: []
        }
        const aqlList = []
        checkInspectionBasisAqlDeatilVos.map(item => {
          item.checkInspectionBasisAqlInfoDetailVos.map(info => {
            aqlList.push(info.parameterTermId)
          })
          return item
        })
        return { aqlList, inspectionGrade }
      })
    },
    handlerAQLChange(val, key) {
      const that = this
      const checkInspectionSchemeSetProjects = [...that.checkInspectionSchemeSetProjects]
      const target = checkInspectionSchemeSetProjects.find(item => item.key === key)
      if (target) {
        const item = target.aqlList.find(item => item.id === val)
        target.parameterTermAqlId = item.id
        target.parameterTermAqlName = item.text
        that.checkInspectionSchemeSetProjects = checkInspectionSchemeSetProjects
      }
    },
    async handlerInspectionBasisChange(val, key) {
      const that = this
      const { aqlList, inspectionGrade } = await that.fetchAQLList(val)

      const item = that.inspectionBasisList.find(item => item.id === val)

      const checkInspectionSchemeSetProjects = [...that.checkInspectionSchemeSetProjects]
      const target = checkInspectionSchemeSetProjects.find(item => item.key === key)
      if (target) {
        target.aqlList = that.aqlDataSource.filter(aql => aqlList.includes(aql.id))
        target.inspectionBasisId = val
        target.inspectionBasisName = item.inspectionBasis
        target.inspectionGrade = inspectionGrade
        that.checkInspectionSchemeSetProjects = checkInspectionSchemeSetProjects
      }
    },
    async query(type, record) {
      const that = this
      that.type = type
      that.form = {}
      that.checkInspectionSchemeSetProjects = []
      that.aqlList = []
      that.visible = true

      that.spinning = true

      try{
        await Promise.all([that.fetchAQL(),that.fetchInspectionBasis(),that.fetchParameterTermList()])
        that.spinning = false
      }catch(err){
        that.spinning = false
        that.$message.error(err.message)
      }

      if (that.isAdd) {
      } else {
        that.spinning = true
        try{
          let detail = await checkInspectionSchemeSetDetail({ id: record.id }).then(res => {
            that.spinning = false
            return res.data
          })
          that.form = {
            id:detail.id,
            inspectionScheme:detail.inspectionScheme,
            remarks:detail.remarks
          }

          if(Array.isArray(detail.checkInspectionSchemeSetProjectDetailVos)){
            for(let item of detail.checkInspectionSchemeSetProjectDetailVos){
              const { aqlList, inspectionGrade } = await that.fetchAQLList(item.inspectionBasisId)
              item.inspectionGrade = inspectionGrade
              item.aqlList = that.aqlDataSource.filter(aql => aqlList.includes(aql.id))
              item.key = that._uuid()
              item.schemeSetId = record.id
            }
            that.checkInspectionSchemeSetProjects = detail.checkInspectionSchemeSetProjectDetailVos
          }
        }catch(err){
          that.spinning = false
          that.$message.error(err.message)
        }


      }
    },
    validate() {
      if(this.checkInspectionSchemeSetProjects.length === 0){
        this.$message.info('请添加检验项目');
        return false
      }
      return true
    },
    handleOk() {
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!that.validate()) {
            return
          }
          checkInspectionSchemeSetAddOrUpdate({
            ...that.form,
            checkInspectionSchemeSetProjects: that.checkInspectionSchemeSetProjects
          })
            .then(res => {
              if (res.code === 200) {
                that.$emit('ok')
                that.visible = false
              }
              that.$message.info(res.msg)
            })
            .catch(err => {
              that.$message.error(err.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      // this.$refs.ruleForm.resetFields();
    },
    handleCancel() {
      // this.resetForm()
      this.visible = false
    },
    handlerToolsSelect(val, key) {
      const that = this
      const { id, termName, remarks } = that.parameterTermList.find(item => item.id === val)
      const checkInspectionSchemeSetProjects = [...that.checkInspectionSchemeSetProjects]
      const target = checkInspectionSchemeSetProjects.find(item => item.key === key)
      if (target) {
        target.parameterTermId = id
        target.parameterTermName = termName
        target.parameterTermRemarks = remarks
        that.checkInspectionSchemeSetProjects = checkInspectionSchemeSetProjects
      }
    },
    async fetchParameterTermList() {
      const that = this
      const id = await checkParameterTermList({ termName: '检验项目' })
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
      that.parameterTermList = list
    }
  }
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 2px;
}
</style>
