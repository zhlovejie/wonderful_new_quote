<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item prop="isSolved" label="是否解决">
          <a-radio-group name="radioGroup" v-model="form.isSolved" :default-value="1">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item prop="solvedTime" label="解决时间">
          <a-date-picker v-model="form.solvedTime" style="width:100%;" />
        </a-form-model-item>
        <a-form-model-item prop="remark" label="备注">
          <a-textarea v-model="form.remark" placeholder="备注" allow-clear style="width:100%;" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>

  </a-modal>
</template>
<script>

import {
  exceptionReportSaveExceptionFeedback,
} from '@/api/after-sales-management-custom'
import moment from 'moment'
export default {
  components:{

  },
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      form: {
        isSolved:1
      },
      rules: {
        solvedTime:[
           { required: true, message: '请选择解决时间', trigger: 'change' }
        ],
        remark:[
          { required: true, message: '请输入备注信息', trigger: 'change' }
        ]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      record:{}
    }
  },
  created() {},
  computed: {
    modalTitle() {
      return '新增反馈记录'
    },
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
      btn.push(
        h(
          'a-button',
          {
            key: 'submit',
            on: { click: () => that.handleSubmit() },
            props: { type: 'primary', loading: that.spinning }
          },
          '提交'
        )
      )
      return btn
    }
  },
  methods:{
    query(record){
      const that = this
      that.record = {...record}
      that.visible = true
      that.form = {
        ...that.form,
        exceptionId:record.id
      }
    },
    handleSubmit(){
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          that.spinning = true
          let params = {...that.form}
          params.solvedTime = params.solvedTime.format('YYYY-MM-DD HH:mm:ss')
          exceptionReportSaveExceptionFeedback(params).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if(res.code === 200){
              that.$emit('finish')
              that.handleCancel()
            }
          }).catch(err => {
            that.spinning = true
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    handleCancel(){
      this.$refs.ruleForm.resetFields();
      this.visible = false
    }
  }
}
</script>

<style scoped>
.ant-form-item{
  margin-bottom: 0;
}

</style>


