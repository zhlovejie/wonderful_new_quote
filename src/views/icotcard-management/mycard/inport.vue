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
        <a-button key="submit" type="primary" :loading="spinning" @click="uploadHandle">上传</a-button>
        <a-button key="down" type="primary" ><a href="https://www.delanshi.cn/images/cloud/20200727/物联网卡导入模板d358f92a-6ea8-47ae-a06b-7d2ff5cdea74.xls">下载模板</a></a-button>
      </template>
    </template>
    <div class='uploadDiv'>
      <a-upload
        name="file"
        :multiple="false"
        uploading:false,
        :beforeUpload="beforeUpload"
        :fileList="fileList"
        class="uploadBtn"
      >
        <a-button type="primary" >
          <a-icon type="upload" />点击上传文件
        </a-button>
      </a-upload>
    </div>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { importSimCard } from '@/api/simCard'

export default {
  name: 'icotcard-management-mycard-import',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      detail: {},
      record: {},
      fileList: [],
      aceptFileTypes: [
        '.xls',
        '.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
    }
  },
  methods: {
    moment,
    showInport() {
      this.visible = true
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    // 上传之前的钩子
    beforeUpload(file) {
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.xls,.xlsx的Excel!')
      }
      this.fileList = [file]
      return false
    },
    downMuban() {},
    uploadHandle() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      this.spinning = true
      importSimCard(formData)
      .then(res => {
        this.fileList = [];
        this.spinning = false;
        this.$message.success(res.msg);
      })
      .catch((err) =>{
        this.spinning = false
        this.$message.success(res.msg)
      })
    },
  },
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
.uploadDiv{
  display: flex;
  justify-content: center;
}
</style>