 <template>
  <a-modal
    v-if="visible"
    :title="titleType"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="id" hidden>
          <a-input v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入任务名称"
            v-decorator="['jobName', { rules: [{ required: true, message: '任务名称!' }] }]"
          />
        </a-form-item>

        <a-form-item label="任务组名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入任务组名称"
            v-decorator="['jobGroup', { rules: [{ required: true, message: '任务组名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="bean名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入bean名称"
            v-decorator="['beanName', { rules: [{ required: true, message: 'bean名称!' }] }]"
          />
        </a-form-item>

        <a-form-item label="方法名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入方法名称"
            v-decorator="['methodName', { rules: [{ required: true, message: '方法名称!' }] }]"
          />
        </a-form-item>

        <a-form-item label="参数信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :disabled="queryBoolean" placeholder="请输入参数信息" v-decorator="['methodParams']" />
        </a-form-item>

        <a-form-item label="cron表达式信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入cron表达式"
            v-decorator="['cronExpression', { rules: [{ required: true, message: 'cron表达式!' }] }]"
          />
        </a-form-item>

        <a-form-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :disabled="queryBoolean" placeholder="备注信息" v-decorator="['remarks']" />
        </a-form-item>
      </a-form>
      <!--<span style="color: #cf1322">*注：银行卡开户行/税号信息需要填写全部信息</span>-->
    </a-spin>
  </a-modal>
</template>

<script>
import { save, modify } from '@/api/system/sysJob'

export default {
  name: 'SysJobModal',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      visible: false,
      confirmLoading: false,
      addOredit: 'save',
      queryBoolean: false,
      titleType: '',
      type: 0,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    add(type) {
      this.addOredit = 'save'
      this.titleType = '新增'
      this.visible = true
      this.type = type
    },
    edit(record, type) {
      console.log('record', record)
      this.titleType = '编辑'
      this.addOredit = 'edit'
      this.visible = true
      this.type = type
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    query(record, type) {
      this.queryBoolean = true
      this.addOredit = 'edit'
      this.type = type
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    close() {
      this.$emit('ok')
      this.visible = false
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          if (_this.addOredit == 'save') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            save(values, this.type)
              .then((data) => {
                console.log('date', data)
                if (data.code == 200) {
                  _this.$message.success('保存成功')
                } else {
                  _this.$message.error(data.msg)
                }
              })
              .catch(() => {
                // Do something
              })
              .finally(() => {
                _this.confirmLoading = false
                _this.close()
              })
          } else if (this.addOredit == 'edit') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            modify(values, this.type)
              .then((data) => {
                if (data.code == 200) {
                  _this.$message.success('修改成功')
                } else {
                  _this.$message.error(data.msg)
                }
              })
              .catch(() => {
                // Do something
              })
              .finally(() => {
                _this.confirmLoading = false
                _this.close()
              })
          }
        }
      })
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped>
</style>
