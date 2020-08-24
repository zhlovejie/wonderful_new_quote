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
        <a-form-item label="id" hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <a-form-item label="type" hidden>
          <a-input v-decorator="['type',{initialValue:detail.type}]" />
        </a-form-item>
        <a-form-item label="type" hidden>
          <a-input v-decorator="['toolType',{initialValue:detail.toolType}]" />
        </a-form-item>
        <a-form-item label="文件名称">
          <a-input
            placeholder="请输入文件名称"
            v-decorator="['fileName', {
              rules: [{
                required: true, message: '请输入文件名称!',
              }]
            }]"
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
            <a-button>
              <a-icon type="upload" />上传（.docx、.doc、.pdf类型）
            </a-button>
          </a-upload>
          <a-input
            type="hidden"
            v-decorator="['fileUrl', {rules: [{required: true,message: '请选择文件！'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveFileManagement, editFileManagement } from '@/api/OperationalScheme'
import { getUploadPath } from '@/api/manage'

export default {
  name: 'ToolBoxCommonUploadForm',
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      confirmLoading: false,
      actionType: 'add',
      //1技术参数 2运营指导手册 3软件说明文档 4电子图册 5产品海报 6 企业简介 7 销售技巧 8 产品说明书
      fileType: 0,
      fileList: [],
      uploadPath: getUploadPath(),
      accept:
        '.docx, .doc, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf',
      detail:{}
    }
  },
  computed: {
    modalTitle(){
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
    query(actionType, record, fileType,toolType=0) {
      let that = this
      that.form.resetFields()
      that.fileList = []
      that.visible = true
      that.actionType = actionType
      that.detail = Object.assign({},record || {},{ type: fileType ,toolType:toolType})
      //that.form.setFieldsValue({ type: fileType })

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
            }
          ]
        }
      }
    },
    handleOk() {
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let _api = that.isAdd ? saveFileManagement : editFileManagement
          _api(values)
            .then((res) => {
              that.confirmLoading = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('ok')
                that.handleCancel()
              }
            })
            .catch((err) => {
              that.confirmLoading = false
              that.$message.info(err.message)
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
    checkFile(file){
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
      this.fileList = fileList.filter(f => this.checkFile(f))
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>


