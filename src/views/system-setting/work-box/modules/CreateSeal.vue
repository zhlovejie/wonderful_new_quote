<template>
  <a-modal
    :title="modalTitle"
    :width="540"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <span style="color:red">万德福公章代码必须填WDFGZ</span>
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name',{rules: [{required: true, min: 1, message: '名称不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input @blur="checkCode()" v-decorator="['code',{rules: [{required: true, min: 1, message: '代码不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">选择图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
              <img alt="图片" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
          <a-input type="hidden" v-decorator="['sealUrl', {rules: [{required: true,message: '请选择图片！'}]}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addSeal, editSeal, checkSealCode } from '@/api/workBox'
import { getUploadPath } from '@/api/common'

export default {
  name: 'CreateForm',
  data () {
    return {
      modalTitle: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      subType: 'add', // 新增还是修改的标记
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [], // 已上传的图片文件列表
      operateList: [], // 已上传的操作说明文件
      sId: 0,
      uploadPath: getUploadPath()
    }
  },
  methods: {
    add () { // 父页面点击新增调用
      this.modalTitle = '新增公章'
      this.visible = true
      this.subType = 'add'
    },
    edit (record) { // 父页面点击修改调用
      this.modalTitle = '修改公章'
      this.visible = true
      this.subType = 'edit'
      this.sId = record.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        setFieldsValue({ ...record })
      })
      if (record.sealUrl != null && record.sealUrl.length > 0) {
        const picList = record.sealUrl.split('/')
        this.fileList[0] = {
          uid: '-1',
          name: picList[picList.length - 1],
          status: 'done',
          'url': record.sealUrl
        } // 图片预览缩略图
      }
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          if (this.subType === 'add') { // 新增
            addSeal(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            }).catch(function (err) {
              console.log(err)
            })
          } else if (this.subType === 'edit') { // 修改
            this.$set(values, 'id', this.sId)
            editSeal(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            }).catch(function (err) {
              console.log(err)
            })
          }
        }
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    previewCancel () {
      this.previewVisible = false
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          this.form.setFieldsValue({ sealUrl: file.response.data[0].url })
        }
      } else if (file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ sealUrl: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    checkCode () {
      var param = {}
      if (this.form.getFieldValue('code') === undefined || this.form.getFieldValue('code').length < 1) {
        return
      } else {
        param = { id: this.sId, code: this.form.getFieldValue('code') }
      }
      checkSealCode(param).then(res => {
        if (res.code === 600) {
          this.form.setFields({ 'code': { value: '', errors: [{ 'message': res.msg }] } })
        }
      }).catch(function (err) {
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
