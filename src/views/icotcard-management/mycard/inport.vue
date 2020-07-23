<template>
  <a-modal
    title="导入"
    :width="700"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div>
      <span>文件:</span>
      <a-upload
        name="file"
        :action="uploadUrl"
        :multiple="false"
        :beforeUpload="beforeUpload"
        :fileList="fileList"
        class="uploadBtn"
      >
        <a-button  type=primary block>
          <a-icon type="upload" />点击上传文件
        </a-button>
      </a-upload>
    </div>
    <template slot="footer">
      <template>
        <a-button key="back">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="uploadHandle" >上传</a-button>
        <a-button key="down" type="primary"  @click="downMuban" >下载模板</a-button>
      </template>
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
      uploadUrl:'',
      detail: {},
      record: {},
      fileList:[],
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
      this.fileList = [...this.fileList, file];
      return false;
    },
    downMuban(){

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
.uploadBtn{
  position: absolute;
  left:50%;
  transform: translateX(-50%);
}
</style>