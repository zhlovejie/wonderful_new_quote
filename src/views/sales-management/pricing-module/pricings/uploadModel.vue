<template>
  <a-modal
    title="上传参考图"
    :width="716"
    :footer="null"
    v-model="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
  <a-form :form="form" layout="inline">
    <div class="top-ation">
        <div>点击上传参考图片</div>
    </div>
    <div class="marg-t16">
      <a-form-item>
        <div class="clearfix">
          <a-upload
            accept="multiple"
            name="files"
            :action="uploadPath"
            listType="picture-card"
            :fileList="fileList"
            @preview="handlePreview"
            @change="uploadChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">选择图片</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" >
            <img alt="图片" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
        <a-input
          type="hidden"
          v-decorator="['effectPic', {rules: [{required: true,message: '请选择图片！'}]}]"
        />

        <a-button @click="clickVue()">确定上传参考图片</a-button>

      </a-form-item>
    </div>
  </a-form>
  </a-modal>
</template>

<script>
import { getUploadPath } from '@/api/manage'
// 上传图片
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'UploadModel',
  components: {},
  // props: {
  //   effectPic: {
  //     type: String,
  //     required: true,
  //     default:function(){
  //       return ''
  //     }
  //   }
  // },
  data () {
    return {
      uploadPath: getUploadPath(),
      visible: false,
      previewVisible: false, // 预览图片
      fileList: [],
      previewImage: '',
      confirmLoading: false,
      data:[],
      effectPic:'',
      form: this.$form.createForm(this)
    }
  },
  computed: {},
  watch: {},
  cerated () {},
  mounted () {},
  methods: {
    query (record) {
      this.loading = false
      console.log('query record' + JSON.stringify(record))
      this.visible = true
      this.effectPic = record.effectPic
      this.queryParam = { 'productType': record.productType }
    },
    // 上传图片
    uploadChange ({ file, fileList }) {
      
      // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          this.form.setFieldsValue({ effectPic: file.response.data[0].url })
          // 成功
          // const dataSource = [...this.data]
          // const target = dataSource.find(item => item.key === effectPic.key)
          // target.effectPic = file.response.data[0].url
          // for (let i = 0; i < this.data.length; i++) {
          //   const key = this.data[i]
            
          //   // if (key.key == record.key) {
          //   //   this.data[i] = target
          //   // }
          // }
        }
      } else if (file.status === 'removed') {
        // 删除清空
        this.qualificationPicture = ''
        // this.form.setFieldsValue({ qualificationPicture: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    // 关闭弹窗函数
    close () {
      this.$emit('close')
      this.visible = false
      this.fileList = []
      this.effectPic = ''
      console.log('关闭弹窗函数后this.effectPic是否为空了', this.effectPic)
    },
    // 点击确定按钮执行关闭弹窗函数
    clickVue () {
      this.effectPic = this.fileList[0].response.data[0].url
      this.$emit('custom-change', this.effectPic)
      this.close()
    },
    // 取消预览图片
    previewCancel () {
      this.previewVisible = false
    },
    // 预览图片
    handlePreview (file) {
      // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    }
  }

}
</script>

<style scoped>

</style>
