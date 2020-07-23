<template>
  <a-modal
    title="导入"
    :width="700"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template>
        <a-button key="back">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning">保存</a-button>
      </template>

      <a-upload
        name="file"
        :action="uploadUrl"
        :multiple="false"
        :beforeUpload="beforeUpload"
        :fileList="fileList"
        @change="uploadHandle"
      >
        <a-button>
          <a-icon type="upload" />Click to Upload
        </a-button>
      </a-upload>
    </template>
  </a-modal>
</template>
<script>
import moment from 'moment'

export default {
  name: 'icotcard-management-mycard-import',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      detail: {},
      record: {},
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  methods: {
    moment,
    showAddForm() {
      this.visible = true
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          console.log(that.routesList)
          //return
          values.status = that.record.status || 0 //状态待审批
          values.beginAreaId = that.beginAreaId //外层出发城市
          values.routes = that.$_.cloneDeep(that.routesList).map(item => {
            delete item._key
            return item
          })
          that.spinning = true
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    // 上传之前的钩子
    beforeUpload(file){
      
    },
    uploadHandle(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
</style>