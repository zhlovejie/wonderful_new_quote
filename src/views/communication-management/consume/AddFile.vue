<template>
  <a-modal
    :title="modalTitle"
    :width="450"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-file-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:record.id}]" />
        </a-form-item>
        <a-form-item
          label="文件"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <UploadFile ref="uploadFile" style="width:100%;" />
        </a-form-item>

        <a-form-item
          label="本月总充值"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input-number
            style="width:100%;"
            :min="0"
            :step="1"
            :precision="2"
            v-decorator="['totalRecharge', {initialValue:record.totalRecharge, rules: [{ required: true, message: '请输入本月总充值' }]}]"
          />
        </a-form-item>

        <a-form-item
          label="本月总消费"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input-number
            style="width:100%;"
            :min="0"
            :step="1"
            :precision="2"
            v-decorator="['totalSpend', { initialValue:record.totalSpend,rules: [{ required: true, message: '请输入本月总消费' }]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { comManageSpendDetailUpload } from '@/api/communicationManagement'
import UploadFile from './UploadFile'

export default {
  name: 'AddForm',
  components: {
    UploadFile
  },
  data() {
    return {
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'add_form' }),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      record: {}
    }
  },
  computed: {
    modalTitle() {
      return '上传'
    }
  },
  methods: {
    init() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async query(type, record) {
      let that = this
      that.type = type
      that.record = Object.assign({}, record)
      that.visible = true

      await that.init()

      that.$refs.uploadFile && that.$refs.uploadFile.setFiles([])

      if(that.$refs.uploadFile && that.record.detailUrl){
        that.$refs.uploadFile.setFiles([
          {
            url: that.record.detailUrl
          }
        ])
      }
          
    },
    handleSubmit() {
      let that = this
      let files = that.$refs.uploadFile.getFiles()
      if (files.length === 0) {
        that.$message.info('您还没有上传文件')
        return
      }
      this.form.validateFields(async (err, values) => {
        if (!err) {
          values.detailUrl = files[0].url
          that.spinning = true
          comManageSpendDetailUpload(values)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code !== 200) {
                return
              }
              that.$refs.uploadFile.setFiles([])
              that.handleCancel()
              that.$emit('finish')
            })
            .catch(err => {
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    }
  }
}
</script>
