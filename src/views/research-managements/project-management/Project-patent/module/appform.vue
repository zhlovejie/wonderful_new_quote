<template>
  <a-modal
    :title="modelTitle"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <a-form-item label="专利类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择专利类别"
            v-decorator="[
              'dicId',
              { initialValue: detail.dicId, rules: [{ required: true, message: '请选择专利类别' }] },
            ]"
          >
            <a-select-option v-for="ptype in productTypes" :key="ptype.id" :value="ptype.id">{{
              ptype.text
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="专利名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'patentName',
              { initialValue: detail.patentName, rules: [{ required: true, message: '请输入专利名称' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="专利号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'patentNum',
              { initialValue: detail.patentNum, rules: [{ required: true, message: '请输入专利号' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="专利申请日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            placeholder="专利申请日"
            v-decorator="[
              'applicationDate',
              {
                initialValue: detail.applicationDate ? moment(`${detail.applicationDate}`) : undefined,
                rules: [{ required: true, message: '选择专利申请日' }],
              },
            ]"
            style="width: 100%"
            format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-alert message="提示" type="warning" show-icon style="margin-bottom: 5px">
            <div slot="description">
              <div>上传的第一张图片将作为专利封面图片来展示</div>
            </div>
          </a-alert> -->
          <div class="clearfix">
            <a-upload
              accept="multiple"
              name="file"
              :action="uploadPath"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              @change="handleChange"
              :beforeUpload="handleBeforeUpload"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">选择图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :width="1000" :footer="null" @cancel="previewCancel">
              <div style="overflow: auto">
                <img alt="图片" style="width: auto; height: auto; max-height: 1000px" :src="previewImage" />
              </div>
            </a-modal>
          </div>
          <a-input type="hidden" v-decorator="['productPic', { initialValue: detail.productPic }]" />
        </a-form-item>

        <a-form-item label="专利描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <vue-ueditor-wrap v-model="content" ref="ueditor" :config="myConfig"></vue-ueditor-wrap>
          <a-input
            type="hidden"
            v-decorator="[
              'patentDescription',
              {
                initialValue: detail.patentDescription,
                rules: [{ required: false, min: 5, message: '请填写专利描述！' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getProjectPatentDetail } from '@/api/workBox'
import { patentUploadDevelopmentProjectPatentApply } from '@/api/projectManagement'

import { getUploadPath2, getDictionary, getUeditorUploadPath, customUpload } from '@/api/common'
import VueUeditorWrap from 'vue-ueditor-wrap'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import moment from 'moment'
let uuid = () => `${Math.random().toString(32).slice(-6)}-${Math.random().toString(32).slice(-6)}`

const myConfig = Object.freeze({
  // 如果需要上传功能,找后端小伙伴要服务器接口地址
  // serverUrl: this.$config.baseUrl + 'ueditor/uploadImg',
  serverUrl: getUeditorUploadPath(),
  // 你的UEditor资源存放的路径,相对于打包后的index.html
  UEDITOR_HOME_URL: '/plugins/',
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  // 工具栏是否可以浮动
  autoFloatEnabled: false,
  // 初始容器高度
  initialFrameHeight: 340,
  // 初始容器宽度
  initialFrameWidth: '100%',
  // 关闭自动保存
  nableAutoSave: true,
})

export default {
  name: 'work-box-project-patent-addForm',
  data() {
    return {
      // ueditor配置
      myConfig,
      content: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      productTypes: [],
      actionType: 'add', // 新增还是修改的标记
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [], // 已上传的图片文件列表
      uploadPath: getUploadPath2(),
      detail: {},
      record: {},
    }
  },
  components: {
    ATextarea,
    VueUeditorWrap,
  },
  computed: {
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    modelTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : '修改'
    },
  },
  methods: {
    moment,
    async query(type, record) {
      const that = this
      that.visible = true
      that.actionType = type
      that.record = record
      that.detail = {}
      that.fileList = []
      await getDictionary({ text: '专利类别' }).then((res) => (that.productTypes = res.data))
      if (that.isAdd) {
        return
      }
      return
      // that.detail = await getProjectPatentDetail({ id: record.id }).then((res) => res.data)
      // const {
      //   form: { setFieldsValue },
      // } = this
      // that.$nextTick(() => {
      //   // setFieldsValue只有通过这种方式给表单赋值
      //   setFieldsValue(that.detail)
      // })
      if (that.detail.originalUrl) {
        let _arr = []
        let imgInfo = []
        try {
          imgInfo = JSON.parse(record.originalUrl)
        } catch (err) {
          imgInfo = []
        }

        imgInfo.map((item) => {
          const picList = item.thumb.split('/')
          _arr.push({
            uid: uuid(),
            name: picList[picList.length - 1],
            status: 'done',
            url: item.thumb,
            __thumbURL: item.thumb,
            __originURL: item.origin,
          })
        })

        that.fileList = _arr
      }
      that.content = that.detail.patentDescription
    },
    handleSubmit() {
      const that = this
      that.form.setFieldsValue({ patentDescription: that.content })
      const {
        form: { validateFields },
      } = that
      validateFields(async (errors, values) => {
        if (!errors) {
          let ArrFilesInfo = []
          for (let file of that.fileList) {
            if (file.__thumbURL && file.__originURL) {
              ArrFilesInfo.push({
                origin: file.__originURL,
                thumb: file.__thumbURL,
              })
            } else if (file.response && file.originFileObj) {
              file.__thumbURL = await that.customUploadAction(file.originFileObj)
              file.__originURL = file.response.data
              ArrFilesInfo.push({
                origin: file.__originURL,
                thumb: file.__thumbURL,
              })
            }
          }
          values.applicationDate = values.applicationDate.format('YYYY-MM-DD')
          values.thumbnailUrl = ArrFilesInfo.length > 0 ? ArrFilesInfo[0].thumb : ''
          values.originalUrl = JSON.stringify(ArrFilesInfo)
          values.dicText = that.productTypes.find((item) => item.id === values.dicId).text

          delete values.productPic
          console.log(values)
          // return
          // that.$set(values, 'id', that.pId)
          let arr = {
            patentId: that.record.id,
            projectPatent: values,
          }
          that.confirmLoading = true
          patentUploadDevelopmentProjectPatentApply(arr)
            .then((res) => {
              that.confirmLoading = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.handleCancel()
                that.$emit('finish') // 刷新父组件
              }
            })
            .catch(function (err) {
              that.confirmLoading = false
              console.log(err)
            })
        }
      })
    },
    handleCancel() {
      this.fileList = []
      this.installList = []
      this.operateList = []
      this.content = ''
      this.form.resetFields() // 清空表
      this.visible = false
    },
    previewCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      let url = ''
      if (file.response) {
        url = file.response.data
      } else {
        url = file.__originURL ? file.__originURL : file.thumbUrl
      }
      this.previewImage = ''
      this.previewVisible = true
      this.$nextTick(() => {
        this.previewImage = url
      })
    },
    handleChange({ file, fileList }) {
      // 上传中、完成、失败都会调用这个函数。
      this.fileList = fileList.map((item) => {
        let _uid = -Date.now()
        item.uid = item.uid || _uid
        if (item.originFileObj) {
          item.originFileObj.uid = item.originFileObj.uid || _uid
        }
        return item
      }) // 展示照片墙

      // debugger
      let case1 = this.fileList
        .map((f) => {
          let _case =
            f.response &&
            f.response.code &&
            f.response.code === 200 &&
            Array.isArray(f.response.data) &&
            f.response.data.length > 0
          return _case ? { ...f.response.data[0] } : null
        })
        .filter((item) => item !== null)
        .map((item) => item.url)
        .join(',')
      let case2 = this.fileList.map((item) => (item && item.url ? item.url : '')).join(',')
      this.form.setFieldsValue({ productPic: case1 || case2 })
    },
    handleBeforeUpload(file, fileList) {
      return true
      // return this.compressPictures(file)
    },
    compressPictures(file) {
      if (file.type.indexOf('image') !== 0) {
        return false
      }

      return new Promise((resolve, reject) => {
        let fileType = file.type
        let reader = new FileReader(),
          img = new Image()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          img.src = e.target.result
        }
        img.onload = function () {
          let canvas = document.createElement('canvas')
          let context = canvas.getContext('2d')
          let originWidth = this.width
          let originHeight = this.height
          let maxWidth = 500,
            maxHeight = 500
          let targetWidth = originWidth,
            targetHeight = originHeight
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              targetWidth = maxWidth
              targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
              targetHeight = maxHeight
              targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
          }
          canvas.width = targetWidth
          canvas.height = targetHeight
          context.clearRect(0, 0, targetWidth, targetHeight)
          context.drawImage(img, 0, 0, targetWidth, targetHeight)
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: fileType }))
            },
            fileType,
            0.92
          )
        }
        img.onerror = function (err) {
          reject(err)
        }
      })
    },
    async customUploadAction(file) {
      //上传 压缩过的图片
      let that = this
      let compressFile = await that.compressPictures(file)
      const formData = new FormData()
      formData.append('file', compressFile)
      let url = await customUpload(formData).then((res) => res.data)
      return url
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
</style>
