<template>
  <a-modal
    v-if="visible"
    title="操作"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" >
        <a-form-item label="id" hidden>
          <a-input v-decorator="['id', {}]"/>
        </a-form-item>
        <a-form-item label="资质名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输资质名称"
            v-decorator="['qualificationName', {
              rules: [{
                type: 'string', message: '请输入正确资质名称!',
              }, {
                required: true, message: '请输入资质名称!',
              }]
            }]"/>
        </a-form-item>
        <a-form-item label="类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择资质类型" v-decorator="['qualificationType',{rules: [{required: true, message: '请选择资质类型！'}]}]">
            <a-select-option v-for="qtype in qualificationTypes" :key="qtype.id" :value="qtype.id">{{ qtype.text }}</a-select-option>"/>
          </a-select>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="clearfix">
            <a-upload
              accept="multiple"
              name="files"
              :action="this.uploadPath"
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
          <a-input type="hidden" v-decorator="['qualificationPicture', {rules: [{required: true,message: '请选择图片！'}]}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveQualification, editQualification, getQualificationType } from '@/api/qualification'
import { getUploadPath } from '@/api/manage'

export default {
  name: 'QualificationModal',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      qualificationTypes: [],
      visible: false,
      confirmLoading: false,
      addOredit: 'save',
      queryBoolean: false,
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      uploadPath: getUploadPath(),
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      toolType:'0'
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () { // 初始化钩子,获取所有产品类型
    getQualificationType({ text: '资质类型' }).then(res => {
      this.qualificationTypes = res.data
    })
  },
  methods: {
    add (obj = {}) {
      this.visible = true
      this.addOredit = 'save'
      this.toolType = obj.toolType || '0'
    },
    edit (record) {
      console.log('record', record)
      this.addOredit = 'edit'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          qualificationName: record.qualificationName,
          qualificationType: record.qualificationType,
          qualificationPicture: record.qualificationPicture
        })
      })
      if (record.qualificationPicture != null && record.qualificationPicture.length > 0) {
        this.fileList[0] = {
          uid: '-1',
          name: record.qualificationName,
          status: 'done',
          'url': record.qualificationPicture
        } // 图片预览缩略图
      }
    },
    close () {
      this.$emit('ok')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          if (_this.addOredit == 'save') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            values.toolType = _this.toolType || 0
            saveQualification(values).then((data) => {
              console.log('date', data)
              if (data.code == 200) {
                _this.$message.success('保存成功')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              // 清空表单
              _this.form.resetFields()
              // 清空图片
              this.fileList = []
              _this.close()
            })
          } else if (this.addOredit == 'edit') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            editQualification(values).then((data) => {
              if (data.code == 200) {
                _this.$message.success('修改成功')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.form.resetFields()
              _this.close()
            })
          }
        }
      }
      )
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
          this.form.setFieldsValue({ qualificationPicture: file.response.data[0].url })
        }
      } else if (file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ qualificationPicture: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    getUEContent () {
      return this.$refs.ue.getUEContent()
    },
    handleCancel () {
      this.close()
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
