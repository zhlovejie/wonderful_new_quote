<template>
  <div class="__fac_info_wrapper__">
    <h2>委外加工申请人信息</h2>
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
          {{form.materialVo.needDate}}
        </span>
      </a-form-model-item>
    </a-form-model>

    <MaterialInfo ref="materialInfo" :baseInfo="form"/>
  </div>
</template>

<script>
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import MaterialInfo from './MaterialInfo'
export default {
  name: 'baseInfo',
  components: {
    DepartmentUserCascade,
    DepartmentSelect,
    MaterialInfo
  },
  inject:['addForm'],
  data() {
    return {
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
      fillFlag: false
    }
  },
  computed:{
    canEdit(){
      return this.addForm.isAdd || this.addForm.isEdit
    }
  },
  activated(){
    console.log('activated baseinfo called....')
    const that = this
    if(that.addForm.isAdd){
      return
    }
    let detail = that.$_.cloneDeep(that.addForm.detail || {}) 
    // delete detail.materialVo
    that.form = {
      ...detail,
      applyUser:{
        userId:detail.applyUserId,
        userName:detail.applyUserName,
        depId:detail.applyDepartmentId,
        depName:detail.applyDepartmentName
      }
    }
  },
  methods: {
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
      let result_materialInfo = await that.$refs.materialInfo.validate()

      if(result.code === 0 && result_materialInfo.code === 0){
        return {
          code:0,
          result:{
            ...result.result,
            ...result_materialInfo.result
          }
        }
      }else{
        return {
          code:500,
          result:{}
        }
      }
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
</style>
