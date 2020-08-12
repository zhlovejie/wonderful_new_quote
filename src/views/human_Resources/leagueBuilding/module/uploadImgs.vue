<template>
  <a-modal
    title="团队风采"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancels"
    okText="上传"
    :maskClosable="false"
  >
    <div class="clearfix">
      <a-upload
        :action="uploadUrl"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < 10">
          <a-icon type="plus" />
          <div class="ant-upload-text">上传图片</div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
  </a-modal>
</template>

<script>
import { getUploadPath2 } from '@/api/common'
import { leagueBuildingUpload } from '@/api/humanResources'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  name: 'ApprovalModal',
  data() {
    return {
      visible: false,
      uploadUrl: getUploadPath2(),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      type: '',
    }
  },
  methods: {
    query(type, record) {
      this.type = type
      this.visible = true
    },
    handleOk() {
      let that = this
      let params = []
      for (let items of this.fileList) {
        params.push(items.response.data)
      }
      leagueBuildingUpload({ applyId: this.type, urlList: params }).then((res) => {
        that.visible = false
        that.$emit('finish')
        that.$message.info(res.msg)
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    handleCancels() {
      let that = this
      // that.form.resetFields() // 清空表
      that.visible = false
    },
  },
}
</script>