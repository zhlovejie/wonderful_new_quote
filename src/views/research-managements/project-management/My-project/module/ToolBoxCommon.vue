<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="文件名称">
          <a-input
            placeholder="请输入文件名称"
            v-decorator="[
              'fileName',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入文件名称!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="文件">
          <a-upload
            :accept="accept"
            name="files"
            :multiple="true"
            :action="this.uploadPath"
            :fileList="fileList"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" />上传（.docx、.doc、.pdf类型） </a-button>
          </a-upload>
          <a-input type="hidden" v-decorator="['fileUrl', { rules: [{ required: true, message: '请选择文件！' }] }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getUploadPath } from '@/api/manage'
import { fileDesignDivConf } from '@/api/projectManagement'
import moment from 'moment'

export default {
  name: 'ToolBoxCommonUploadForm',
  data() {
    return {
      visible: false,
      department: [],
      userList: [],
      record: {},
      form: this.$form.createForm(this),
      confirmLoading: false,
      actionType: 'add',
      fileList: [],
      uploadPath: getUploadPath(),
      accept:
        '.docx, .doc, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf',
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '添加' : '编辑'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
  },
  methods: {
    moment,
    query(actionType, record) {
      let that = this
      that.form.resetFields()
      that.fileList = []
      that.visible = true
      that.actionType = actionType
      that.record = record
      that.detail = Object.assign({}, record || {})
      if (that.isEdit) {
        let { fileName, id, fileUrl } = record
        that.$nextTick(() => that.form.setFieldsValue({ fileName, id, fileUrl }))
        if (record.fileUrl && record.fileUrl.length > 0) {
          let _sp = record.fileUrl.split('/')
          let _fileName = _sp[_sp.length - 1]
          this.fileList = [
            {
              uid: '-1',
              status: 'done',
              name: _fileName,
              url: record.fileUrl,
            },
          ]
        }
      }
    },
    handleOk() {
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.record.id
          fileDesignDivConf(values).then((res) => {
            if (res.code === 200) {
              that.handleCancel()
              that.$message.info(res.msg)
              that.$emit('ok')
            } else {
              that.$message.error(res.msg)
              that.handleCancel()
            }
          })
        }
      })
    },
    beforeUpload(file) {
      const isLt10M = this.checkFile(file)
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!')
      }
      return isLt10M
    },
    checkFile(file) {
      return file.size / 1024 / 1024 < 10
    },
    handleChange({ file, fileList }) {
      //console.log(arguments)
      //console.log('file.status:'+file.status)
      // 上传中、完成、失败都会调用这个函数
      fileList = fileList.slice(-1)
      if (file && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response && file.response.code === 200) {
          this.form.setFieldsValue({ fileUrl: file.response.data[0].url })
        }
      } else if (file.status === 'removed') {
        // 删除清空
        this.form.setFieldsValue({ fileUrl: '' })
      }
      this.fileList = fileList.filter((f) => this.checkFile(f))
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>


