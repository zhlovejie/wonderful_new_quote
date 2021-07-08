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
        <a-form-item label="fileType" hidden>
          <a-input v-decorator="['fileType', { initialValue: detail.fileType }]" />
        </a-form-item>
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
        <a-form-item label="保管人" v-if="fileType === 3">
          <a-select
            style="width: 40%; float: left"
            v-decorator="['departmentId', { rules: [{ required: true, message: '请选择部门' }] }]"
            placeholder="选择部门"
            @change="depChangeHandler"
            allowClear
          >
            <a-select-option v-for="item in department" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
          <a-select
            style="width: 40%; float: left"
            v-decorator="['userId', { rules: [{ required: true, message: '请选择人员' }] }]"
            placeholder="选择人员"
            allowClear
          >
            <a-select-option v-for="item in userList" :key="item.id" :value="item.id">{{
              item.trueName
            }}</a-select-option>
          </a-select>
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
import { getDevisionManagementList, getUserByDep } from '@/api/systemSetting'
import { getUploadPath } from '@/api/manage'

export default {
  name: 'ToolBoxCommonUploadForm',
  data() {
    return {
      visible: false,
      department: [],
      userList: [],
      form: this.$form.createForm(this),
      confirmLoading: false,
      actionType: 'add',
      // 1、设备操作规程 2、保养操作规程 3、耗材
      fileType: undefined,
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
    initDepList() {
      //部门  id,departmentName
      return getDevisionManagementList({ parentId: 4, current: 1, size: 200 }).then(
        (res) => (this.department = res.data.records)
      )
    },
    initUserList(depId) {
      //人员 id,trueName
      if (!depId) {
        this.userList = []
        return
      }
      return getUserByDep({ departmentId: depId }).then((res) => (this.userList = res.data))
    },
    depChangeHandler(depId) {
      this.userList = []
      this.initUserList(depId)
    },
    query(actionType, record, fileType) {
      let that = this
      that.form.resetFields()
      that.fileList = []
      that.visible = true
      that.fileType = fileType
      that.actionType = actionType
      that.detail = Object.assign({}, record || {}, { fileType: fileType })
      // that.form.setFieldsValue({ fileType: fileType })
      that.initDepList()
      if (that.isEdit && fileType !== 3) {
        let { fileName, id, fileUrl, departmentId, userId } = record
        that.$nextTick(() => that.form.setFieldsValue({ fileName, id, fileUrl, departmentId, userId }))
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
      if (that.isEdit && fileType === 3) {
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
          // that.confirmLoading = true
          if (that.fileType !== 3) {
            that.$emit('ok', values)
          } else {
            let react = that.userList.find((item) => (item.id = values.userId))
            values.userName = react.trueName
            that.$emit('ok', values)
          }

          that.handleCancel()
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


