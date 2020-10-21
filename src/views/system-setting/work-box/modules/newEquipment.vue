<template>
  <a-modal
    v-if="visible"
    title="操作"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- <a-form-item label="id" hidden>
           <a-input v-decorator="['id', {}]"/>
         </a-form-item>
         <a-form-item label="type" hidden>
           <a-input v-decorator="['type', {}]"/>
         </a-form-item>-->
        <a-form-item label="版本名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入版本名称"
            v-decorator="[
              'versionName',
              {
                rules: [
                  {
                    type: 'string',
                    message: '请输入正确版本名称!',
                  },
                  {
                    required: true,
                    message: '请输入正确版本名称!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入版本号"
            v-decorator="[
              'versionCode',
              {
                rules: [
                  {
                    type: 'string',
                    message: '请输入正确版本号!',
                  },
                  {
                    required: true,
                    message: '请输入正确版本号!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="选择设备类型"
            :allowClear="true"
            v-decorator="['type', { rules: [{ required: true, message: '请选择设备类型！' }] }]"
          >
            <a-select-option v-for="item in equipmentType" :key="item.code" :value="item.code">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上传地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['innetType', { initialValue: 1, rules: [{ required: true, message: '请选择上传地址！' }] }]"
            @change="address"
          >
            <a-radio :value="1"> 外网 </a-radio>
            <a-radio :value="2"> 内网 </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="更新说明" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-textarea
            :disabled="queryBoolean"
            placeholder="请输入更新说明"
            v-decorator="[
              'remark',
              {
                rules: [
                  {
                    type: 'string',
                    message: '请输入更新说明!',
                  },
                  {
                    required: true,
                    message: '请输入更新说明!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            accept=".apk,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            name="file"
            :multiple="true"
            :action="this.path === 1 ? this.uploadPath : this.uploadAdd"
            :fileList="fileList"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> 上传（.apk类型） </a-button>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel"> </a-modal>
          </a-upload>
          <a-input
            type="hidden"
            v-decorator="['downloadUrl', { rules: [{ required: true, message: '请选择文件！' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { editFileManagement } from '@/api/OperationalScheme'
import {
  uploadAndroidApkEquipment,
  deleteAndroidVersionEquipment,
  editAndroidVersionEquipment,
  addAndroidVersionEquipment,
  queryCode,
} from '@/api/workBox'
import { getApkUploadPath, uploadAddress } from '@/api/manage'

export default {
  name: 'AndroidModal',
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
      equipmentType: [], //设备类型
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      path: 1,
      fileName: '',
      downloadUrl: '',
      id: 0,
      uploadPath: getApkUploadPath(),
      uploadAdd: uploadAddress(),
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    /*player () {
      return this.$refs.videoPlayer.player
    }*/
  },
  created() {
    queryCode({ code: 'az_00' }).then((res) => {
      this.equipmentType = res.data
    })
  },
  methods: {
    add: function (type) {
      this.visible = true
      this.addOredit = 'save'
      /*this.$nextTick(() => {
        this.form.setFieldsValue({
          type: type
        })
      })*/
    },
    edit: function (record) {
      console.log('record', record)
      this.addOredit = 'edit'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          fileName: record.fileName,
          id: record.id,
          downloadUrl: record.downloadUrl,
        })
      })
      if (record.downloadUrl != null && record.downloadUrl.length > 0) {
        const split = record.downloadUrl.split('/')
        this.fileList[0] = {
          uid: '-1',
          status: 'done',
          name: split[6],
          downloadUrl: record.downloadUrl,
        }
      }
    },
    close() {
      this.$emit('ok')
      this.visible = false
    },
    address(e) {
      this.path = e.target.value
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          if (_this.addOredit == 'save') {
            addAndroidVersionEquipment(values)
              .then((data) => {
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
                // 清空表单
                _this.form.resetFields()
                // 清空图片
                this.fileList = []
                _this.close()
              })
          } else if (this.addOredit == 'edit') {
            editAndroidVersionEquipment(values)
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
                _this.form.resetFields()
                this.fileList = []
                _this.close()
              })
          }
        }
      })
    },
    previewCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      // 上传中、完成、失败都会调用这个函数。
      fileList = fileList.slice(-1)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          // 成功
          console.log('file.response.data:', file.response.data)
          this.form.setFieldsValue({ downloadUrl: file.response.data })
        }
      } else if (file.status === 'removed') {
        // 删除清空
        this.form.setFieldsValue({ downloadUrl: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    handleCancel() {
      this.close()
      this.fileList = []
    },
  },
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
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>
