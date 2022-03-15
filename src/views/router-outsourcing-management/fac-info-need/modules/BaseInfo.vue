<template>
  <div class="__fac_info_wrapper__">
    <h2>委外加工申请人信息</h2>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="申请人" prop="applyUserId">
        <DepartmentUserCascade 
          allowClear 
          :info.sync="form.applyUser" 
          style="width:100%;" 
          @change="handleDepartmentUserCascadeChange"
        />
      </a-form-model-item>
      <a-form-model-item label="申请原因" prop="reason">
        <a-input v-model="form.reason" />
      </a-form-model-item>
      <a-form-model-item label="生产车间" prop="workDepartmentId">
        <DepartmentSelect @change="handleDepartmentSelectChange" :depId="form.workDepartmentId" />
      </a-form-model-item>

      <a-form-model-item label="关联生产任务单">
        <a-select 
          style="width: 100%" 
          v-model="form.productTaskId" 
          placeholder="关联生产任务单"
          @change="handleProductTaskChange"
        >
          <a-select-option v-for="item in productTaskList" :key="item.id">{{item.no}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="需求日期" prop="needDate">
        <a-date-picker v-model="form.needDate" format="YYYY-MM-DD" style="width:100%;" />
      </a-form-model-item>
    </a-form-model>

    <MaterialInfo ref="materialInfo" />
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
  provide() {
    return {
      baseInfo: this
    }
  },
  props: ['detail', 'fill', 'disabled'],
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
  watch: {
    detail() {
      // if (this.fill) {
      //   this.fillAction()
      // }
    }
  },
  methods: {
    fillAction() {
      const that = this
      let flag = false
      function __action() {
        if (flag) {
          return
        }
        let params = { ...that.detail }
        params.addressIds = params.addressIds.split(',').map(v => +v)
        params.addressNames = params.addressNames.split(',')
        that.form = params
        that.$refs.uploadImage &&
          that.$refs.uploadImage.setFiles(
            params.licenseUrl.split(',').map(url => {
              return {
                url
              }
            })
          )
        flag = true
      }
      return __action()
    },
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
        debugger
        return {
          code:0,
          result:{
            ...result.result,
            ...result_materialInfo.result
          }
        }
      }
      return result.code !== 0 ? result : result_materialInfo
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
