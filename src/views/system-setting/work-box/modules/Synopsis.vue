<template>
  <a-modal
    v-if="visible"
    title="操作"
    :width="900"
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
        <a-form-item label="标题">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入标题"
            v-decorator="['title', {
              rules: [{
                type: 'string', message: '请输入正确标题!',
              }, {
                required: true, message: '请输入标题!',
              }]
            }]"/>
        </a-form-item>
        <div>
          <UE :defaultMsg="defaultMsg" :config="config" ref="ue" ></UE>
        </div>
        <a-form-item label="图片" >
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
          <a-input type="hidden" v-decorator="['url', {}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveInformation, editInformation } from '@/api/enterpriseInformation'
import { getUploadPath } from '@/api/manage'
import UE from '@/components/ue/ue.vue'
import { getUeditorUploadPath } from '@/api/common'

export default {
  name: 'EnterpriseSynopsis',
  components: { UE },
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
      visible: false,
      confirmLoading: false,
      addOredit: 'save',
      queryBoolean: false,
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      uploadPath: getUploadPath(),
      defaultMsg: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200,
        serverUrl: getUeditorUploadPath()
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    add () {
      this.visible = true
      this.addOredit = 'save'
    },
    edit (record) {
      this.defaultMsg = ''
      console.log('record', record)
      this.addOredit = 'edit'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          id: record.id,
          title: record.title,
          url: record.url
        })
        this.defaultMsg = record.informationContent
      })
      if (record.url != null && record.url.length > 0) {
        this.fileList[0] = {
          uid: '-1',
          name: record.title,
          status: 'done',
          'url': record.url
        } // 图片预览缩略图
      }
    },
    close () {
      this.$emit('ok')
      this.visible = false
      this.$refs.ue.destroyed()
      this.fileList = []
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
            _this.$set(values, 'informationContent', _this.getUEContent())
            _this.$set(values, 'informationContentTxt', _this.getUEContentTxt())
            _this.$set(values, 'informationType', 1)
            saveInformation(values).then((data) => {
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
            _this.$set(values, 'informationContent', _this.getUEContent())
            _this.$set(values, 'informationContentTxt', _this.getUEContentTxt())
            editInformation(values).then((data) => {
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
          this.form.setFieldsValue({ url: file.response.data[0].url })
        }
      } else if (file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ url: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    getUEContent () {
      return this.$refs.ue.getUEContent()
    },
    getUEContentTxt () {
      return this.$refs.ue.getUEContentTxt()
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
