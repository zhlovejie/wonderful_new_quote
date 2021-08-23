<template>
  <a-modal
    title="报价异常单处理"
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
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="ask-price-form-wrapper"
      >
        <a-form-model-item
          label="处理方式"
          prop="disposeType"
        >
          <a-radio-group
            name="disposeType"
            v-model="form.disposeType"
          >
            <a-radio :value="1">重抢</a-radio>
            <a-radio :value="2">新报价采购</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <template v-if="form.disposeType === 1">
          <a-form-model-item
            label="抢单时长"
            prop="grabTime"
          >
            <a-input-number
              placeholder="抢单时长"
              v-model="form.grabTime"
              style="width:100%;"
              :min="0"
              :step="1"
              :precision="0"
              :formatter="value => `${value}分钟`"
              :parser="value => value.replace('分钟', '')"
            />
          </a-form-model-item>
          <a-form-model-item
            label="公示时长"
            prop="publicityTime"
          >
            <a-input-number
              placeholder="公示时长"
              v-model="form.publicityTime"
              style="width:100%;"
              :min="0"
              :step="1"
              :precision="0"
              :formatter="value => `${value}分钟`"
              :parser="value => value.replace('分钟', '')"
            />
          </a-form-model-item>
        </template>
        <a-form-model-item
          label="处理理由"
          prop="reason"
        >
          <a-input
            v-model="form.reason"
            type="textarea"
            placeholder="处理理由"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { quotationDetail,quotationExceptionAdd } from '@/api/procurementModuleManagement'

export default {
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {},
      rules: {
        disposeType: [{ required: true, message: '请选择处理方式' }],
        reason: [{ required: true, message: '请输入处理理由' }],
        grabTime: [{ required: true, message: '请输入抢单时间' }],
        publicityTime: [{ required: true, message: '请输入公示时间' }]
      },
      visible: false,
      spinning: false,
      record: {},
      detail:{}
    }
  },
  computed: {
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
  methods: {
    query(record) {
      const that = this
      that.record = { ...record }
      that.visible = true
      that.form = {
        ...that.form,
        quotationId: that.record.id,
      }
      that.spinning = true
      quotationDetail({id:that.record.id}).then(res => {
        that.spinning = false
        that.detail = res.data

        if(that.detail.detail.exception){
          that.form = {...that.form,id:that.detail.detail.exception.id}
        }else{
          console.error('that.detail.exception is not exists.')
        }
      }).catch(err => {
        that.spinning = false
        that.$message.error(err)
      })
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { modelName, modelType } = that.form
          that.spinning = true
          quotationExceptionAdd({ ...that.form})
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      this.resetForm()
      this.visible = false
    }
  }
}
</script>

<style scoped>
.ask-price-form-wrapper >>> .ant-card {
  margin-bottom: 20px;
}
.ask-price-form-wrapper >>> .ant-card:last-child {
  margin-bottom: 0;
}
.ask-price-form-wrapper >>> .ant-card .ant-card-body {
  padding: 10px 0;
}
.ask-price-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
