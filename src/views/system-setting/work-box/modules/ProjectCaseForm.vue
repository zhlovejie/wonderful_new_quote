<template>
  <a-modal
    :title="title"
    :width="940"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="案例名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            @blur="checkName"
            style="width:70%"
            v-decorator="['caseName',{rules: [{required: true, min: 1, message: '案例名称不可为空！'}]}]"
          />
        </a-form-item>
        <a-form-item label="小区名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input style="width:70%" v-decorator="['unitName']" />
        </a-form-item>
        <a-form-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            style="width:70%;"
            placeholder="备注信息"
            :rows="3"
            v-decorator="['remark', { rules: [{ required: false, message: '请输入备注信息' }] }]"
          />
        </a-form-item>

        <a-form-item label="案例文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="clearfix">
            <a-upload
              accept="multiple"
              name="files"
              :action="uploadPath"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div>
                <a-icon type="plus" />
                <div class="ant-upload-text">选择</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
              <img alt="图片" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
          <a-input type="hidden" v-decorator="['photoUrls',{rules: [{required: true, min: 1, message: '请选择文件！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addProjectCase, editProjectCase, checkCaseName } from '@/api/workBox'
import { getUploadPath } from '@/api/common'

export default {
  name: 'ProjectCaseForm', // 工程案例表单
  data() {
    return {
      title: '',
      headers: {
        authorization: 'authorization-text'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      subType: 'add', // 新增还是修改的标记
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [], // 已上传的图片文件列表
      uploadUrls: '', // 已经上传的图片url逗号拼接
      pId: 0,
      uploadPath: getUploadPath()
    }
  },
  methods: {
    add() {
      // 父页面点击新增调用
      this.title = '新增工程案例'
      this.visible = true
      this.subType = 'add'
    },
    edit(record) {
      // 父页面点击修改调用
      this.title = '修改工程案例'
      this.visible = true
      this.subType = 'edit'
      this.pId = record.id
      const {
        form: { setFieldsValue }
      } = this
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        setFieldsValue({ ...record })
      })
      // 拆解所有的图片并展示
      if (record.photoUrls != null && record.photoUrls.length > 0) {
        const urls = record.photoUrls.split(',')
        for (var i = 0; i < urls.length; i++) {
          const url = urls[i]
          const file = url.split('/')
          const fileName = file[file.length - 1]
          this.fileList[i] = {
            uid: i,
            name: fileName,
            status: 'done',
            url: url
          } // 图片预览缩略图
        }
        this.uploadUrls = record.photoUrls
      }
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          if (this.subType === 'add') {
            // 新增
            addProjectCase(values)
              .then(res => {
                if (res.code === 200) {
                  this.handleCancel()
                  this.$emit('ok') // 刷新父组件
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          } else if (this.subType === 'edit') {
            // 修改
            this.$set(values, 'id', this.pId)
            editProjectCase(values)
              .then(res => {
                if (res.code === 200) {
                  this.handleCancel()
                  this.$emit('ok') // 刷新父组件
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          }
        }
        this.confirmLoading = false
      })
    },
    handleCancel() {
      // 窗口关闭
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
      this.uploadUrls = ''
    },
    previewCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {// 成功
          if ( this.uploadUrls != '' && this.uploadUrls.length > 0) {
            this.uploadUrls += ',' + file.response.data[0].url
          } else {
            this.uploadUrls = file.response.data[0].url
          }
        }
      } else if (file.status === 'removed') {
        // 删除清空
        let url = ''
        if (file.response !== undefined) {
          url = file.response.data[0].url
        } else {
          url = file.url
        }
        this.uploadUrls = this.uploadUrls.replace(',' + url, '')
        this.uploadUrls = this.uploadUrls.replace(url, '')
      } else if (file.status === 'error') {
        this.$message.error('上传图片失败！')
      }
      this.fileList = fileList // 展示照片墙
      this.form.setFieldsValue({ photoUrls: this.uploadUrls })
    },
    checkName() {
      var param = {}
      if (this.form.getFieldValue('caseName') === undefined || this.form.getFieldValue('caseName').length < 1) {
        return
      } else {
        param = { id: this.pId, caseName: this.form.getFieldValue('caseName') }
      }
      checkCaseName(param)
        .then(res => {
          if (res.code === 200) {
            if (res.data.length > 0) {
              this.form.setFields({
                caseName: { value: '', errors: [{ message: '该案例名称已经存在!', field: 'caseName' }] }
              })
            }
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  }
}
</script>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
