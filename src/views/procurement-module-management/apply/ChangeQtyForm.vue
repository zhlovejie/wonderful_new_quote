<template>
  <a-modal
    :title="modalTitle"
    :width="450"
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
        <a-form-model-item label="安全库存" >
          <span>500</span>
        </a-form-model-item>
        <a-form-model-item prop="num" label="需求库存">
          <a-input-number
            v-model="form.num"
            style="width:100%;"
            :min="0"
            :step="1"
            :precision="0"
          />
          <span style="color:red;">{{msg}}</span>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

  </a-modal>
</template>
<script>

import {
  requestApplyChangeNum
} from '@/api/procurementModuleManagement'


export default {
  components:{

  },
  data() {
    let validateQty = (rule, value, callback) => {
      if (+value === 0) {
        callback(new Error('数量必须大于0'));
      } else {
        callback();
      }
    };

    return {
      type: 'add',
      visible: false,
      spinning: false,
      form: {
        num:0
      },
      rules: {
        num:[
          { validator: validateQty, trigger: 'change' },
        ]
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      record:{}
    }
  },
  created() {},
  computed: {
    modalTitle() {
      return '调整需求数量'
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
    },
    msg(){
      let diff = +this.form.num - 500
      let msg = diff > 0 ? `提示：超库存${diff}` : ''
      return msg
    }
  },
  methods:{
    query(record){
      const that = this
      that.record = {...record}
      that.visible = true
      that.form = {
        num:record.requestNum || 0
      }
    },
    handleSubmit(){
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let id = that.record.id
          let num = that.form.num
          let unsafetyInventory = that.msg.length > 0 ? 1 : 2
          requestApplyChangeNum(`id=${id}&num=${num}&unsafetyInventory=${unsafetyInventory}`).then(res => {
            that.$message.info(res.msg)
            if(res.code === 200){
              that.$emit('finish')
              that.handleCancel()
            }
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


